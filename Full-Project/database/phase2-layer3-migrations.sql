-- ============================================================
-- CHINA GATE: Database Migration System
-- ============================================================
-- Layer 3 of 3: Schema Version Control
-- Tracks every migration, supports rollback
-- ============================================================

-- Create migrations schema
CREATE SCHEMA IF NOT EXISTS migrations;

-- ============================================================
-- MIGRATION TRACKING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS migrations.schema_versions (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,

  -- Migration content (for reference/rollback)
  up_sql TEXT,
  down_sql TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'rolled_back', 'failed')),
  error_message TEXT,

  -- Who/When
  applied_by TEXT DEFAULT current_user,
  applied_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ,
  execution_time_ms INTEGER,

  -- Checksum to detect modifications
  checksum TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migrations_version ON migrations.schema_versions(version);
CREATE INDEX IF NOT EXISTS idx_migrations_status ON migrations.schema_versions(status);

-- ============================================================
-- MIGRATION LOCK (prevent concurrent migrations)
-- ============================================================

CREATE TABLE IF NOT EXISTS migrations.migration_lock (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  locked_by TEXT,
  locked_at TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT false
);

INSERT INTO migrations.migration_lock (id, is_locked) VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- MIGRATION FUNCTIONS
-- ============================================================

-- Acquire migration lock
CREATE OR REPLACE FUNCTION migrations.acquire_lock(p_locked_by TEXT DEFAULT current_user)
RETURNS BOOLEAN AS $$
DECLARE
  _rows INTEGER;
BEGIN
  UPDATE migrations.migration_lock
  SET is_locked = true, locked_by = p_locked_by, locked_at = NOW()
  WHERE id = 1 AND is_locked = false;

  GET DIAGNOSTICS _rows = ROW_COUNT;
  RETURN _rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Release migration lock
CREATE OR REPLACE FUNCTION migrations.release_lock()
RETURNS void AS $$
BEGIN
  UPDATE migrations.migration_lock
  SET is_locked = false, locked_by = NULL, locked_at = NULL
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- Apply a migration
CREATE OR REPLACE FUNCTION migrations.apply_migration(
  p_version TEXT,
  p_name TEXT,
  p_description TEXT,
  p_up_sql TEXT,
  p_down_sql TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  _start_time TIMESTAMPTZ;
  _end_time TIMESTAMPTZ;
  _checksum TEXT;
BEGIN
  -- Check if already applied
  IF EXISTS (
    SELECT 1 FROM migrations.schema_versions
    WHERE version = p_version AND status = 'applied'
  ) THEN
    RAISE NOTICE 'Migration % already applied, skipping', p_version;
    RETURN false;
  END IF;

  -- Acquire lock
  IF NOT migrations.acquire_lock() THEN
    RAISE EXCEPTION 'Cannot acquire migration lock. Another migration may be running.';
  END IF;

  _start_time := clock_timestamp();
  _checksum := md5(p_up_sql);

  -- Record the migration
  INSERT INTO migrations.schema_versions (version, name, description, up_sql, down_sql, checksum)
  VALUES (p_version, p_name, p_description, p_up_sql, p_down_sql, _checksum)
  ON CONFLICT (version) DO UPDATE
  SET status = 'pending', error_message = NULL;

  BEGIN
    -- Execute the migration
    EXECUTE p_up_sql;

    _end_time := clock_timestamp();

    -- Mark as applied
    UPDATE migrations.schema_versions
    SET status = 'applied',
        applied_at = NOW(),
        execution_time_ms = EXTRACT(MILLISECOND FROM (_end_time - _start_time))::INTEGER
    WHERE version = p_version;

    -- Release lock
    PERFORM migrations.release_lock();
    RETURN true;

  EXCEPTION WHEN OTHERS THEN
    -- Mark as failed
    UPDATE migrations.schema_versions
    SET status = 'failed',
        error_message = SQLERRM,
        applied_at = NOW()
    WHERE version = p_version;

    -- Release lock
    PERFORM migrations.release_lock();
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Rollback a migration
CREATE OR REPLACE FUNCTION migrations.rollback_migration(p_version TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  _down_sql TEXT;
BEGIN
  -- Get the rollback SQL
  SELECT down_sql INTO _down_sql
  FROM migrations.schema_versions
  WHERE version = p_version AND status = 'applied';

  IF _down_sql IS NULL THEN
    RAISE EXCEPTION 'No rollback SQL found for migration %', p_version;
  END IF;

  -- Acquire lock
  IF NOT migrations.acquire_lock() THEN
    RAISE EXCEPTION 'Cannot acquire migration lock.';
  END IF;

  BEGIN
    EXECUTE _down_sql;

    UPDATE migrations.schema_versions
    SET status = 'rolled_back', rolled_back_at = NOW()
    WHERE version = p_version;

    PERFORM migrations.release_lock();
    RETURN true;

  EXCEPTION WHEN OTHERS THEN
    PERFORM migrations.release_lock();
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Get current database version
CREATE OR REPLACE FUNCTION migrations.current_version()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT version FROM migrations.schema_versions
    WHERE status = 'applied'
    ORDER BY applied_at DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- Get migration status report
CREATE OR REPLACE FUNCTION migrations.status_report()
RETURNS TABLE (
  version TEXT,
  name TEXT,
  status TEXT,
  applied_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  has_rollback BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sv.version, sv.name, sv.status, sv.applied_at,
    sv.execution_time_ms,
    (sv.down_sql IS NOT NULL) AS has_rollback
  FROM migrations.schema_versions sv
  ORDER BY sv.version;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- REGISTER ALL EXISTING MIGRATIONS (retroactive)
-- ============================================================

-- Register Phase 1 (initial schema)
SELECT migrations.apply_migration(
  '001',
  'phase1-initial-schema',
  'Initial profiles, auth, login_history, user_sessions tables',
  '-- Phase 1: Initial schema (applied before migration system)',
  NULL
);

-- Register Phase 2 (B2B marketplace)
SELECT migrations.apply_migration(
  '002',
  'phase2-complete-schema',
  'Complete B2B marketplace: categories, products, RFQs, deals, shipments, etc.',
  '-- Phase 2: Complete schema (applied before migration system)',
  NULL
);

-- Register Phase 2.5 (tracking)
SELECT migrations.apply_migration(
  '003',
  'phase2-tracking',
  'User tracking: page_views, user_activities, user_devices, security_audit_log',
  '-- Phase 2.5: Tracking (applied before migration system)',
  NULL
);

-- Register FK fix
SELECT migrations.apply_migration(
  '004',
  'phase2-fix-fk-profiles',
  'Add FK constraints from all tables to profiles for PostgREST joins',
  '-- Phase 2 Fix: FK to profiles (applied before migration system)',
  NULL
);

-- Register Data Warehouse
SELECT migrations.apply_migration(
  '005',
  'phase2-layer1-data-warehouse',
  'Analytics schema: dimension tables, fact tables, materialized views',
  '-- Layer 1: Data Warehouse (applied in this batch)',
  'DROP SCHEMA IF EXISTS analytics CASCADE;'
);

-- Register Audit Log
SELECT migrations.apply_migration(
  '006',
  'phase2-layer2-audit-log',
  'Audit schema: change_log, triggers on all sensitive tables',
  '-- Layer 2: Audit Log (applied in this batch)',
  'DROP SCHEMA IF EXISTS audit CASCADE;'
);

-- Register Migration System itself
SELECT migrations.apply_migration(
  '007',
  'phase2-layer3-migrations',
  'Migration system: schema_versions, lock, apply/rollback functions',
  '-- Layer 3: Migration System (self-referencing)',
  NULL
);
