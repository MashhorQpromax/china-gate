-- ============================================================
-- CHINA GATE: Audit Log / Change Tracking System
-- ============================================================
-- Layer 2 of 3: Complete Change Data Capture
-- Tracks WHO changed WHAT, from WHICH value to WHICH value
-- Covers: profiles, products, deals, quotations, RFQs, etc.
-- ============================================================

-- Create audit schema (isolated)
CREATE SCHEMA IF NOT EXISTS audit;

-- ============================================================
-- CORE AUDIT LOG TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS audit.change_log (
  id BIGSERIAL PRIMARY KEY,

  -- What changed
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),

  -- Who changed it
  changed_by UUID,
  changed_by_name TEXT,
  changed_by_role TEXT,

  -- How it was changed
  change_source TEXT DEFAULT 'api' CHECK (change_source IN (
    'api', 'dashboard', 'admin', 'system_job', 'trigger', 'migration', 'manual'
  )),
  ip_address INET,
  user_agent TEXT,

  -- What exactly changed
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],

  -- Context
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- When
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit.change_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_record ON audit.change_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit.change_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit.change_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit.change_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON audit.change_log(operation);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_table_date ON audit.change_log(table_name, created_at DESC);

-- ============================================================
-- SENSITIVE FIELD TRACKING TABLE
-- Defines which fields on which tables require detailed tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS audit.tracked_fields (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  sensitivity_level TEXT DEFAULT 'normal' CHECK (sensitivity_level IN ('low', 'normal', 'high', 'critical')),
  track_old_value BOOLEAN DEFAULT true,
  track_new_value BOOLEAN DEFAULT true,
  notify_on_change BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(table_name, field_name)
);

-- Register sensitive fields to track
INSERT INTO audit.tracked_fields (table_name, field_name, sensitivity_level, notify_on_change) VALUES
  -- Profiles (user data)
  ('profiles', 'email', 'critical', true),
  ('profiles', 'company_name', 'high', false),
  ('profiles', 'account_type', 'critical', true),
  ('profiles', 'country', 'normal', false),
  ('profiles', 'is_verified', 'high', true),
  ('profiles', 'account_status', 'critical', true),
  ('profiles', 'risk_score', 'high', true),
  ('profiles', 'two_factor_enabled', 'high', true),

  -- Products
  ('products', 'status', 'high', true),
  ('products', 'base_price', 'high', false),
  ('products', 'featured', 'normal', false),
  ('products', 'verified', 'high', true),
  ('products', 'stock_quantity', 'normal', false),
  ('products', 'supplier_id', 'critical', true),

  -- Deals (financial)
  ('deals', 'stage', 'high', false),
  ('deals', 'total_value', 'critical', true),
  ('deals', 'unit_price', 'critical', true),
  ('deals', 'quantity', 'high', false),
  ('deals', 'payment_status', 'critical', true),
  ('deals', 'amount_paid', 'critical', true),
  ('deals', 'buyer_id', 'critical', true),
  ('deals', 'supplier_id', 'critical', true),

  -- Quotations
  ('quotations', 'status', 'high', false),
  ('quotations', 'unit_price', 'high', false),
  ('quotations', 'total_price', 'high', false),

  -- Purchase Requests
  ('purchase_requests', 'status', 'high', false),
  ('purchase_requests', 'max_budget', 'high', false),
  ('purchase_requests', 'awarded_to', 'critical', true),

  -- Supplier Verifications
  ('supplier_verifications', 'verification_level', 'critical', true),
  ('supplier_verifications', 'avg_rating', 'high', false),

  -- Letters of Credit (financial)
  ('letters_of_credit', 'status', 'critical', true),
  ('letters_of_credit', 'amount', 'critical', true),

  -- Disputes
  ('disputes', 'status', 'high', true),
  ('disputes', 'resolution', 'high', true)
ON CONFLICT (table_name, field_name) DO NOTHING;

-- ============================================================
-- GENERIC AUDIT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION audit.log_change()
RETURNS TRIGGER AS $$
DECLARE
  _old_data JSONB;
  _new_data JSONB;
  _changed_fields TEXT[];
  _record_id UUID;
  _changed_by UUID;
  _changed_by_name TEXT;
  _source TEXT;
BEGIN
  -- Determine record ID
  IF TG_OP = 'DELETE' THEN
    _record_id := OLD.id;
    _old_data := to_jsonb(OLD);
    _new_data := NULL;
    _changed_fields := ARRAY(SELECT key FROM jsonb_object_keys(to_jsonb(OLD)) AS key);
  ELSIF TG_OP = 'INSERT' THEN
    _record_id := NEW.id;
    _old_data := NULL;
    _new_data := to_jsonb(NEW);
    _changed_fields := ARRAY(SELECT key FROM jsonb_object_keys(to_jsonb(NEW)) AS key);
  ELSIF TG_OP = 'UPDATE' THEN
    _record_id := NEW.id;
    _old_data := to_jsonb(OLD);
    _new_data := to_jsonb(NEW);
    -- Only track actually changed fields
    _changed_fields := ARRAY(
      SELECT key FROM jsonb_each(_new_data) AS n(key, val)
      WHERE _old_data->key IS DISTINCT FROM _new_data->key
        AND key NOT IN ('updated_at', 'created_at')
    );
    -- Skip if nothing meaningful changed
    IF array_length(_changed_fields, 1) IS NULL THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Try to get the current user from session context
  BEGIN
    _changed_by := current_setting('app.current_user_id', true)::UUID;
  EXCEPTION WHEN OTHERS THEN
    _changed_by := NULL;
  END;

  BEGIN
    _changed_by_name := current_setting('app.current_user_name', true);
  EXCEPTION WHEN OTHERS THEN
    _changed_by_name := NULL;
  END;

  BEGIN
    _source := current_setting('app.change_source', true);
  EXCEPTION WHEN OTHERS THEN
    _source := 'api';
  END;

  -- Insert audit record
  INSERT INTO audit.change_log (
    table_name, record_id, operation,
    changed_by, changed_by_name, change_source,
    old_data, new_data, changed_fields
  ) VALUES (
    TG_TABLE_NAME, _record_id, TG_OP,
    _changed_by, _changed_by_name, COALESCE(_source, 'api'),
    _old_data, _new_data, _changed_fields
  );

  -- Return appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ATTACH TRIGGERS TO ALL SENSITIVE TABLES
-- ============================================================

-- Profiles
DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
CREATE TRIGGER trg_audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Products
DROP TRIGGER IF EXISTS trg_audit_products ON public.products;
CREATE TRIGGER trg_audit_products
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Deals
DROP TRIGGER IF EXISTS trg_audit_deals ON public.deals;
CREATE TRIGGER trg_audit_deals
  AFTER INSERT OR UPDATE OR DELETE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Quotations
DROP TRIGGER IF EXISTS trg_audit_quotations ON public.quotations;
CREATE TRIGGER trg_audit_quotations
  AFTER INSERT OR UPDATE OR DELETE ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Purchase Requests
DROP TRIGGER IF EXISTS trg_audit_purchase_requests ON public.purchase_requests;
CREATE TRIGGER trg_audit_purchase_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.purchase_requests
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Supplier Verifications
DROP TRIGGER IF EXISTS trg_audit_supplier_verifications ON public.supplier_verifications;
CREATE TRIGGER trg_audit_supplier_verifications
  AFTER INSERT OR UPDATE OR DELETE ON public.supplier_verifications
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Shipments
DROP TRIGGER IF EXISTS trg_audit_shipments ON public.shipments;
CREATE TRIGGER trg_audit_shipments
  AFTER INSERT OR UPDATE OR DELETE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Letters of Credit
DROP TRIGGER IF EXISTS trg_audit_letters_of_credit ON public.letters_of_credit;
CREATE TRIGGER trg_audit_letters_of_credit
  AFTER INSERT OR UPDATE OR DELETE ON public.letters_of_credit
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Letters of Guarantee
DROP TRIGGER IF EXISTS trg_audit_letters_of_guarantee ON public.letters_of_guarantee;
CREATE TRIGGER trg_audit_letters_of_guarantee
  AFTER INSERT OR UPDATE OR DELETE ON public.letters_of_guarantee
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Disputes
DROP TRIGGER IF EXISTS trg_audit_disputes ON public.disputes;
CREATE TRIGGER trg_audit_disputes
  AFTER INSERT OR UPDATE OR DELETE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Partnerships
DROP TRIGGER IF EXISTS trg_audit_partnerships ON public.partnerships;
CREATE TRIGGER trg_audit_partnerships
  AFTER INSERT OR UPDATE OR DELETE ON public.partnerships
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Quality Inspections
DROP TRIGGER IF EXISTS trg_audit_quality_inspections ON public.quality_inspections;
CREATE TRIGGER trg_audit_quality_inspections
  AFTER INSERT OR UPDATE OR DELETE ON public.quality_inspections
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Customs Clearances
DROP TRIGGER IF EXISTS trg_audit_customs_clearances ON public.customs_clearances;
CREATE TRIGGER trg_audit_customs_clearances
  AFTER INSERT OR UPDATE OR DELETE ON public.customs_clearances
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Notifications (only INSERT to avoid noise)
DROP TRIGGER IF EXISTS trg_audit_notifications ON public.notifications;
CREATE TRIGGER trg_audit_notifications
  AFTER INSERT ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- ============================================================
-- AUDIT QUERY HELPERS
-- ============================================================

-- Get full history of a specific record
CREATE OR REPLACE FUNCTION audit.get_record_history(
  p_table_name TEXT,
  p_record_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  operation TEXT,
  changed_by UUID,
  changed_by_name TEXT,
  change_source TEXT,
  changed_fields TEXT[],
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id, cl.operation, cl.changed_by, cl.changed_by_name,
    cl.change_source, cl.changed_fields, cl.old_data, cl.new_data,
    cl.created_at
  FROM audit.change_log cl
  WHERE cl.table_name = p_table_name
    AND cl.record_id = p_record_id
  ORDER BY cl.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get all changes by a specific user
CREATE OR REPLACE FUNCTION audit.get_user_changes(
  p_user_id UUID,
  p_from TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_to TIMESTAMPTZ DEFAULT NOW(),
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id BIGINT,
  table_name TEXT,
  record_id UUID,
  operation TEXT,
  changed_fields TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cl.id, cl.table_name, cl.record_id, cl.operation, cl.changed_fields, cl.created_at
  FROM audit.change_log cl
  WHERE cl.changed_by = p_user_id
    AND cl.created_at BETWEEN p_from AND p_to
  ORDER BY cl.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get critical changes (high/critical sensitivity)
CREATE OR REPLACE FUNCTION audit.get_critical_changes(
  p_from TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id BIGINT,
  table_name TEXT,
  record_id UUID,
  operation TEXT,
  changed_by UUID,
  changed_by_name TEXT,
  change_source TEXT,
  changed_fields TEXT[],
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ,
  max_sensitivity TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id, cl.table_name, cl.record_id, cl.operation,
    cl.changed_by, cl.changed_by_name, cl.change_source,
    cl.changed_fields, cl.old_data, cl.new_data, cl.created_at,
    MAX(tf.sensitivity_level) AS max_sensitivity
  FROM audit.change_log cl
  JOIN audit.tracked_fields tf ON
    tf.table_name = cl.table_name AND
    tf.field_name = ANY(cl.changed_fields) AND
    tf.sensitivity_level IN ('high', 'critical')
  WHERE cl.created_at >= p_from
  GROUP BY cl.id, cl.table_name, cl.record_id, cl.operation,
    cl.changed_by, cl.changed_by_name, cl.change_source,
    cl.changed_fields, cl.old_data, cl.new_data, cl.created_at
  ORDER BY cl.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Daily audit summary
CREATE OR REPLACE FUNCTION audit.get_daily_summary(
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  table_name TEXT,
  inserts BIGINT,
  updates BIGINT,
  deletes BIGINT,
  unique_users BIGINT,
  critical_changes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.table_name,
    COUNT(*) FILTER (WHERE cl.operation = 'INSERT') AS inserts,
    COUNT(*) FILTER (WHERE cl.operation = 'UPDATE') AS updates,
    COUNT(*) FILTER (WHERE cl.operation = 'DELETE') AS deletes,
    COUNT(DISTINCT cl.changed_by) AS unique_users,
    COUNT(*) FILTER (WHERE EXISTS (
      SELECT 1 FROM audit.tracked_fields tf
      WHERE tf.table_name = cl.table_name
        AND tf.field_name = ANY(cl.changed_fields)
        AND tf.sensitivity_level = 'critical'
    )) AS critical_changes
  FROM audit.change_log cl
  WHERE cl.created_at::DATE = p_date
  GROUP BY cl.table_name
  ORDER BY (COUNT(*)) DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- AUDIT LOG RETENTION POLICY
-- Keep detailed logs for 1 year, summarized for 5 years
-- ============================================================

CREATE TABLE IF NOT EXISTS audit.change_log_archive (
  LIKE audit.change_log INCLUDING ALL
);

-- Function to archive old audit records
CREATE OR REPLACE FUNCTION audit.archive_old_records(
  p_older_than INTERVAL DEFAULT '1 year'
)
RETURNS INTEGER AS $$
DECLARE
  _count INTEGER;
BEGIN
  WITH moved AS (
    DELETE FROM audit.change_log
    WHERE created_at < NOW() - p_older_than
    RETURNING *
  )
  INSERT INTO audit.change_log_archive
  SELECT * FROM moved;

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$ LANGUAGE plpgsql;
