-- ============================================================
-- CHINA GATE: ETL Functions (Extract-Transform-Load)
-- ============================================================
-- Populates Data Warehouse from Operational Database
-- Run daily via Supabase pg_cron or external scheduler
-- ============================================================

-- ============================================================
-- DIMENSION SYNC FUNCTIONS
-- ============================================================

-- Sync users to dim_user (SCD Type 2)
CREATE OR REPLACE FUNCTION analytics.sync_dim_users()
RETURNS INTEGER AS $$
DECLARE
  _count INTEGER := 0;
BEGIN
  -- Close old versions for changed users
  UPDATE analytics.dim_user du
  SET valid_to = NOW(), is_current = false
  WHERE du.is_current = true
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = du.user_id
        AND (
          p.full_name_en IS DISTINCT FROM du.full_name_en OR
          p.company_name IS DISTINCT FROM du.company_name OR
          p.account_type IS DISTINCT FROM du.account_type OR
          p.country IS DISTINCT FROM du.country OR
          p.city IS DISTINCT FROM du.city OR
          p.is_verified IS DISTINCT FROM du.is_verified
        )
    );

  -- Insert new versions for changed users + brand new users
  INSERT INTO analytics.dim_user (
    user_id, full_name_en, full_name_ar, company_name,
    account_type, country, city, sector, is_verified,
    registration_date, valid_from, is_current
  )
  SELECT
    p.id, p.full_name_en, p.full_name_ar, p.company_name,
    p.account_type, p.country, p.city, p.sector, p.is_verified,
    p.created_at::DATE, NOW(), true
  FROM public.profiles p
  WHERE NOT EXISTS (
    SELECT 1 FROM analytics.dim_user du
    WHERE du.user_id = p.id AND du.is_current = true
  );

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$ LANGUAGE plpgsql;

-- Sync products to dim_product (SCD Type 2)
CREATE OR REPLACE FUNCTION analytics.sync_dim_products()
RETURNS INTEGER AS $$
DECLARE
  _count INTEGER := 0;
BEGIN
  -- Close old versions
  UPDATE analytics.dim_product dp
  SET valid_to = NOW(), is_current = false
  WHERE dp.is_current = true
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = dp.product_id
        AND (
          p.name_en IS DISTINCT FROM dp.name_en OR
          p.base_price IS DISTINCT FROM dp.base_price OR
          p.origin_country IS DISTINCT FROM dp.origin_country
        )
    );

  -- Insert new/changed products
  INSERT INTO analytics.dim_product (
    product_id, sku, name_en, name_ar, category_name,
    supplier_id, supplier_name, base_price, currency,
    origin_country, brand_name, valid_from, is_current
  )
  SELECT
    p.id, p.sku, p.name_en, p.name_ar,
    c.name_en AS category_name,
    p.supplier_id,
    prof.company_name AS supplier_name,
    p.base_price, p.currency,
    p.origin_country, p.brand_name,
    NOW(), true
  FROM public.products p
  LEFT JOIN public.categories c ON c.id = p.category_id
  LEFT JOIN public.profiles prof ON prof.id = p.supplier_id
  WHERE NOT EXISTS (
    SELECT 1 FROM analytics.dim_product dp
    WHERE dp.product_id = p.id AND dp.is_current = true
  );

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$ LANGUAGE plpgsql;

-- Sync categories to dim_category
CREATE OR REPLACE FUNCTION analytics.sync_dim_categories()
RETURNS INTEGER AS $$
DECLARE
  _count INTEGER := 0;
BEGIN
  INSERT INTO analytics.dim_category (
    category_id, name_en, name_ar, parent_name_en, level, full_path, is_active
  )
  SELECT
    c.id, c.name_en, c.name_ar,
    pc.name_en AS parent_name_en,
    c.level,
    COALESCE(pc.name_en || ' > ', '') || c.name_en AS full_path,
    c.is_active
  FROM public.categories c
  LEFT JOIN public.categories pc ON pc.id = c.parent_id
  ON CONFLICT (category_id)
  DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_ar = EXCLUDED.name_ar,
    parent_name_en = EXCLUDED.parent_name_en,
    full_path = EXCLUDED.full_path,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FACT TABLE LOAD FUNCTIONS
-- ============================================================

-- Load daily user activity facts
CREATE OR REPLACE FUNCTION analytics.load_fact_user_activity(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS INTEGER AS $$
DECLARE
  _date_key INTEGER;
  _count INTEGER := 0;
BEGIN
  _date_key := TO_CHAR(p_date, 'YYYYMMDD')::INTEGER;

  INSERT INTO analytics.fact_user_activity (
    date_key, user_key,
    page_views, unique_pages, session_count, total_session_duration,
    products_viewed, rfqs_created, quotations_sent, messages_sent,
    avg_session_minutes, is_active
  )
  SELECT
    _date_key,
    du.user_key,
    COALESCE(pv.page_views, 0),
    COALESCE(pv.unique_pages, 0),
    COALESCE(sess.session_count, 0),
    COALESCE(sess.total_duration, 0),
    COALESCE(prod_views.cnt, 0),
    COALESCE(rfqs.cnt, 0),
    COALESCE(quotes.cnt, 0),
    COALESCE(msgs.cnt, 0),
    CASE WHEN COALESCE(sess.session_count, 0) > 0
      THEN ROUND(COALESCE(sess.total_duration, 0)::DECIMAL / sess.session_count / 60, 2)
      ELSE 0 END,
    true
  FROM analytics.dim_user du
  WHERE du.is_current = true
    AND (
      EXISTS (SELECT 1 FROM public.page_views pv WHERE pv.user_id = du.user_id AND pv.viewed_at::DATE = p_date)
      OR EXISTS (SELECT 1 FROM public.user_sessions us WHERE us.user_id = du.user_id AND us.session_start::DATE = p_date)
    )
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS page_views, COUNT(DISTINCT page_path) AS unique_pages
    FROM public.page_views WHERE user_id = du.user_id AND viewed_at::DATE = p_date
  ) pv ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS session_count, SUM(session_duration) AS total_duration
    FROM public.user_sessions WHERE user_id = du.user_id AND session_start::DATE = p_date
  ) sess ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM public.user_activities
    WHERE user_id = du.user_id AND created_at::DATE = p_date AND event_type = 'product_view'
  ) prod_views ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM public.purchase_requests
    WHERE buyer_id = du.user_id AND created_at::DATE = p_date
  ) rfqs ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM public.quotations
    WHERE supplier_id = du.user_id AND created_at::DATE = p_date
  ) quotes ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt FROM public.messages
    WHERE sender_id = du.user_id AND created_at::DATE = p_date
  ) msgs ON true
  ON CONFLICT (date_key, user_key)
  DO UPDATE SET
    page_views = EXCLUDED.page_views,
    unique_pages = EXCLUDED.unique_pages,
    session_count = EXCLUDED.session_count,
    total_session_duration = EXCLUDED.total_session_duration,
    products_viewed = EXCLUDED.products_viewed,
    rfqs_created = EXCLUDED.rfqs_created,
    quotations_sent = EXCLUDED.quotations_sent,
    messages_sent = EXCLUDED.messages_sent,
    avg_session_minutes = EXCLUDED.avg_session_minutes;

  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$ LANGUAGE plpgsql;

-- Load daily platform KPIs
CREATE OR REPLACE FUNCTION analytics.load_fact_platform_daily(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void AS $$
DECLARE
  _date_key INTEGER;
BEGIN
  _date_key := TO_CHAR(p_date, 'YYYYMMDD')::INTEGER;

  INSERT INTO analytics.fact_platform_daily (
    date_key,
    total_users, new_users, active_users,
    buyers_active, suppliers_active,
    total_products, new_products,
    total_rfqs, new_rfqs, rfqs_awarded,
    total_deals, new_deals, deals_completed, total_gmv,
    total_quotations, new_quotations,
    total_page_views, total_sessions
  )
  SELECT
    _date_key,
    -- Users
    (SELECT COUNT(*) FROM public.profiles WHERE created_at::DATE <= p_date),
    (SELECT COUNT(*) FROM public.profiles WHERE created_at::DATE = p_date),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_sessions WHERE session_start::DATE = p_date),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_sessions us JOIN public.profiles p ON p.id = us.user_id WHERE us.session_start::DATE = p_date AND p.account_type = 'buyer'),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_sessions us JOIN public.profiles p ON p.id = us.user_id WHERE us.session_start::DATE = p_date AND p.account_type = 'supplier'),
    -- Products
    (SELECT COUNT(*) FROM public.products WHERE status = 'active' AND created_at::DATE <= p_date),
    (SELECT COUNT(*) FROM public.products WHERE created_at::DATE = p_date),
    -- RFQs
    (SELECT COUNT(*) FROM public.purchase_requests WHERE created_at::DATE <= p_date),
    (SELECT COUNT(*) FROM public.purchase_requests WHERE created_at::DATE = p_date),
    (SELECT COUNT(*) FROM public.purchase_requests WHERE status = 'awarded' AND updated_at::DATE = p_date),
    -- Deals
    (SELECT COUNT(*) FROM public.deals WHERE created_at::DATE <= p_date),
    (SELECT COUNT(*) FROM public.deals WHERE created_at::DATE = p_date),
    (SELECT COUNT(*) FROM public.deals WHERE stage = 'completed' AND updated_at::DATE = p_date),
    (SELECT COALESCE(SUM(total_value), 0) FROM public.deals WHERE created_at::DATE = p_date),
    -- Quotations
    (SELECT COUNT(*) FROM public.quotations WHERE created_at::DATE <= p_date),
    (SELECT COUNT(*) FROM public.quotations WHERE created_at::DATE = p_date),
    -- Engagement
    (SELECT COUNT(*) FROM public.page_views WHERE viewed_at::DATE = p_date),
    (SELECT COUNT(*) FROM public.user_sessions WHERE session_start::DATE = p_date)
  ON CONFLICT (date_key) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    buyers_active = EXCLUDED.buyers_active,
    suppliers_active = EXCLUDED.suppliers_active,
    total_products = EXCLUDED.total_products,
    new_products = EXCLUDED.new_products,
    total_rfqs = EXCLUDED.total_rfqs,
    new_rfqs = EXCLUDED.new_rfqs,
    rfqs_awarded = EXCLUDED.rfqs_awarded,
    total_deals = EXCLUDED.total_deals,
    new_deals = EXCLUDED.new_deals,
    deals_completed = EXCLUDED.deals_completed,
    total_gmv = EXCLUDED.total_gmv,
    total_quotations = EXCLUDED.total_quotations,
    new_quotations = EXCLUDED.new_quotations,
    total_page_views = EXCLUDED.total_page_views,
    total_sessions = EXCLUDED.total_sessions,
    snapshot_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- MASTER ETL RUNNER
-- ============================================================

CREATE OR REPLACE FUNCTION analytics.run_daily_etl(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS TABLE (
  step TEXT,
  records_affected INTEGER,
  duration_ms INTEGER
) AS $$
DECLARE
  _start TIMESTAMPTZ;
  _count INTEGER;
BEGIN
  -- Step 1: Sync dimensions
  _start := clock_timestamp();
  SELECT analytics.sync_dim_users() INTO _count;
  step := 'sync_dim_users'; records_affected := _count;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;

  _start := clock_timestamp();
  SELECT analytics.sync_dim_products() INTO _count;
  step := 'sync_dim_products'; records_affected := _count;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;

  _start := clock_timestamp();
  SELECT analytics.sync_dim_categories() INTO _count;
  step := 'sync_dim_categories'; records_affected := _count;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;

  -- Step 2: Load facts
  _start := clock_timestamp();
  SELECT analytics.load_fact_user_activity(p_date) INTO _count;
  step := 'load_fact_user_activity'; records_affected := _count;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;

  _start := clock_timestamp();
  PERFORM analytics.load_fact_platform_daily(p_date);
  step := 'load_fact_platform_daily'; records_affected := 1;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;

  -- Step 3: Refresh materialized views
  _start := clock_timestamp();
  PERFORM analytics.refresh_all_views();
  step := 'refresh_materialized_views'; records_affected := 5;
  duration_ms := EXTRACT(MILLISECOND FROM clock_timestamp() - _start)::INTEGER;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Schedule daily ETL via pg_cron (if available)
-- ============================================================
-- To enable, run in Supabase SQL Editor:
-- SELECT cron.schedule('daily-etl', '0 3 * * *', 'SELECT * FROM analytics.run_daily_etl()');
-- This runs at 3 AM daily
