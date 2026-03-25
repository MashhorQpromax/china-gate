-- ============================================================
-- CHINA GATE: Data Warehouse / Analytics Layer
-- ============================================================
-- Layer 1 of 3: Analytical Data Architecture
-- Separate schema from operational DB (public)
-- Star Schema: Fact tables + Dimension tables
-- ============================================================

-- Create analytics schema (isolated from operational)
CREATE SCHEMA IF NOT EXISTS analytics;

-- ============================================================
-- DIMENSION TABLES (slowly changing)
-- ============================================================

-- dim_date: Pre-populated calendar dimension
CREATE TABLE IF NOT EXISTS analytics.dim_date (
  date_key INTEGER PRIMARY KEY,
  full_date DATE NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  month INTEGER NOT NULL,
  month_name TEXT NOT NULL,
  week INTEGER NOT NULL,
  day_of_month INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL,
  day_name TEXT NOT NULL,
  is_weekend BOOLEAN NOT NULL,
  is_holiday BOOLEAN DEFAULT false,
  fiscal_year INTEGER,
  fiscal_quarter INTEGER
);

-- dim_user: Snapshot of user profiles for analytics
CREATE TABLE IF NOT EXISTS analytics.dim_user (
  user_key SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name_en TEXT,
  full_name_ar TEXT,
  company_name TEXT,
  account_type TEXT,
  country TEXT,
  city TEXT,
  sector TEXT,
  is_verified BOOLEAN DEFAULT false,
  registration_date DATE,
  -- SCD Type 2 tracking
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ DEFAULT '9999-12-31'::TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_dim_user_id ON analytics.dim_user(user_id);
CREATE INDEX IF NOT EXISTS idx_dim_user_current ON analytics.dim_user(is_current) WHERE is_current = true;

-- dim_product: Snapshot of product data
CREATE TABLE IF NOT EXISTS analytics.dim_product (
  product_key SERIAL PRIMARY KEY,
  product_id UUID NOT NULL,
  sku TEXT,
  name_en TEXT,
  name_ar TEXT,
  category_name TEXT,
  subcategory_name TEXT,
  supplier_id UUID,
  supplier_name TEXT,
  base_price DECIMAL(15,2),
  currency TEXT,
  origin_country TEXT,
  brand_name TEXT,
  -- SCD Type 2
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ DEFAULT '9999-12-31'::TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_dim_product_id ON analytics.dim_product(product_id);
CREATE INDEX IF NOT EXISTS idx_dim_product_current ON analytics.dim_product(is_current) WHERE is_current = true;

-- dim_category: Category hierarchy flattened
CREATE TABLE IF NOT EXISTS analytics.dim_category (
  category_key SERIAL PRIMARY KEY,
  category_id UUID NOT NULL UNIQUE,
  name_en TEXT,
  name_ar TEXT,
  parent_name_en TEXT,
  level INTEGER,
  full_path TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dim_geography: Country/city dimension
CREATE TABLE IF NOT EXISTS analytics.dim_geography (
  geo_key SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  city TEXT,
  region TEXT,
  port_name TEXT,
  UNIQUE(country, city)
);

-- ============================================================
-- FACT TABLES (append-only, immutable events)
-- ============================================================

-- fact_deals: Every deal event with all measures
CREATE TABLE IF NOT EXISTS analytics.fact_deals (
  id BIGSERIAL PRIMARY KEY,
  deal_id UUID NOT NULL,
  date_key INTEGER REFERENCES analytics.dim_date(date_key),
  buyer_key INTEGER REFERENCES analytics.dim_user(user_key),
  supplier_key INTEGER REFERENCES analytics.dim_user(user_key),
  product_key INTEGER REFERENCES analytics.dim_product(product_key),
  -- Measures
  quantity INTEGER,
  unit_price DECIMAL(15,2),
  total_value DECIMAL(15,2),
  shipping_cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  -- Deal metadata
  stage TEXT,
  payment_status TEXT,
  incoterm TEXT,
  lead_time_days INTEGER,
  -- Timestamps
  deal_created_at TIMESTAMPTZ,
  deal_completed_at TIMESTAMPTZ,
  -- Snapshot timestamp
  snapshot_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fact_deals_date ON analytics.fact_deals(date_key);
CREATE INDEX IF NOT EXISTS idx_fact_deals_buyer ON analytics.fact_deals(buyer_key);
CREATE INDEX IF NOT EXISTS idx_fact_deals_supplier ON analytics.fact_deals(supplier_key);

-- fact_rfq: RFQ activity
CREATE TABLE IF NOT EXISTS analytics.fact_rfq (
  id BIGSERIAL PRIMARY KEY,
  rfq_id UUID NOT NULL,
  date_key INTEGER REFERENCES analytics.dim_date(date_key),
  buyer_key INTEGER REFERENCES analytics.dim_user(user_key),
  category_key INTEGER REFERENCES analytics.dim_category(category_key),
  -- Measures
  quantity INTEGER,
  target_price DECIMAL(15,2),
  max_budget DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  quotation_count INTEGER DEFAULT 0,
  -- Status
  status TEXT,
  days_to_expire INTEGER,
  days_to_award INTEGER,
  -- Timestamps
  rfq_created_at TIMESTAMPTZ,
  rfq_expires_at TIMESTAMPTZ,
  awarded_at TIMESTAMPTZ,
  snapshot_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fact_rfq_date ON analytics.fact_rfq(date_key);

-- fact_quotations: Quotation metrics
CREATE TABLE IF NOT EXISTS analytics.fact_quotations (
  id BIGSERIAL PRIMARY KEY,
  quotation_id UUID NOT NULL,
  rfq_id UUID,
  date_key INTEGER REFERENCES analytics.dim_date(date_key),
  supplier_key INTEGER REFERENCES analytics.dim_user(user_key),
  buyer_key INTEGER REFERENCES analytics.dim_user(user_key),
  -- Measures
  unit_price DECIMAL(15,2),
  total_price DECIMAL(15,2),
  quantity INTEGER,
  lead_time INTEGER,
  estimated_shipping_cost DECIMAL(10,2),
  -- Status
  status TEXT,
  response_time_hours DECIMAL(10,2),
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  snapshot_at TIMESTAMPTZ DEFAULT NOW()
);

-- fact_user_activity: Daily aggregated user activity
CREATE TABLE IF NOT EXISTS analytics.fact_user_activity (
  id BIGSERIAL PRIMARY KEY,
  date_key INTEGER REFERENCES analytics.dim_date(date_key),
  user_key INTEGER REFERENCES analytics.dim_user(user_key),
  -- Engagement measures
  page_views INTEGER DEFAULT 0,
  unique_pages INTEGER DEFAULT 0,
  session_count INTEGER DEFAULT 0,
  total_session_duration INTEGER DEFAULT 0,
  -- Actions
  products_viewed INTEGER DEFAULT 0,
  products_favorited INTEGER DEFAULT 0,
  rfqs_created INTEGER DEFAULT 0,
  quotations_sent INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  deals_initiated INTEGER DEFAULT 0,
  -- Computed
  avg_session_minutes DECIMAL(8,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  snapshot_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date_key, user_key)
);

CREATE INDEX IF NOT EXISTS idx_fact_activity_date ON analytics.fact_user_activity(date_key);
CREATE INDEX IF NOT EXISTS idx_fact_activity_user ON analytics.fact_user_activity(user_key);

-- fact_product_performance: Daily product metrics
CREATE TABLE IF NOT EXISTS analytics.fact_product_performance (
  id BIGSERIAL PRIMARY KEY,
  date_key INTEGER REFERENCES analytics.dim_date(date_key),
  product_key INTEGER REFERENCES analytics.dim_product(product_key),
  -- Measures
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  quotation_requests INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(15,2) DEFAULT 0,
  avg_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  -- Computed
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  snapshot_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date_key, product_key)
);

-- fact_platform_daily: Platform-wide daily KPIs
CREATE TABLE IF NOT EXISTS analytics.fact_platform_daily (
  id BIGSERIAL PRIMARY KEY,
  date_key INTEGER REFERENCES analytics.dim_date(date_key) UNIQUE,
  -- Users
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  returning_users INTEGER DEFAULT 0,
  buyers_active INTEGER DEFAULT 0,
  suppliers_active INTEGER DEFAULT 0,
  -- Products
  total_products INTEGER DEFAULT 0,
  new_products INTEGER DEFAULT 0,
  -- RFQs
  total_rfqs INTEGER DEFAULT 0,
  new_rfqs INTEGER DEFAULT 0,
  rfqs_awarded INTEGER DEFAULT 0,
  -- Deals
  total_deals INTEGER DEFAULT 0,
  new_deals INTEGER DEFAULT 0,
  deals_completed INTEGER DEFAULT 0,
  total_gmv DECIMAL(15,2) DEFAULT 0,
  -- Quotations
  total_quotations INTEGER DEFAULT 0,
  new_quotations INTEGER DEFAULT 0,
  avg_response_time_hours DECIMAL(10,2),
  -- Engagement
  total_page_views INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_minutes DECIMAL(8,2),
  -- Computed
  snapshot_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POPULATE dim_date (2024-2030)
-- ============================================================
INSERT INTO analytics.dim_date (date_key, full_date, year, quarter, month, month_name, week, day_of_month, day_of_week, day_name, is_weekend)
SELECT
  TO_CHAR(d, 'YYYYMMDD')::INTEGER AS date_key,
  d AS full_date,
  EXTRACT(YEAR FROM d)::INTEGER AS year,
  EXTRACT(QUARTER FROM d)::INTEGER AS quarter,
  EXTRACT(MONTH FROM d)::INTEGER AS month,
  TO_CHAR(d, 'Month') AS month_name,
  EXTRACT(WEEK FROM d)::INTEGER AS week,
  EXTRACT(DAY FROM d)::INTEGER AS day_of_month,
  EXTRACT(ISODOW FROM d)::INTEGER AS day_of_week,
  TO_CHAR(d, 'Day') AS day_name,
  EXTRACT(ISODOW FROM d) IN (6, 7) AS is_weekend
FROM generate_series('2024-01-01'::DATE, '2030-12-31'::DATE, '1 day'::INTERVAL) AS d
ON CONFLICT (date_key) DO NOTHING;

-- ============================================================
-- MATERIALIZED VIEWS for common analytics queries
-- ============================================================

-- Monthly revenue and deal summary
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_monthly_summary AS
SELECT
  TO_CHAR(d.created_at, 'YYYY-MM') AS month,
  EXTRACT(YEAR FROM d.created_at)::INTEGER AS year,
  EXTRACT(MONTH FROM d.created_at)::INTEGER AS month_num,
  COUNT(*) AS total_deals,
  COUNT(*) FILTER (WHERE d.stage = 'completed') AS completed_deals,
  SUM(d.total_value) AS total_gmv,
  SUM(d.total_value) FILTER (WHERE d.stage = 'completed') AS completed_gmv,
  AVG(d.total_value) AS avg_deal_value,
  COUNT(DISTINCT d.buyer_id) AS unique_buyers,
  COUNT(DISTINCT d.supplier_id) AS unique_suppliers
FROM public.deals d
GROUP BY TO_CHAR(d.created_at, 'YYYY-MM'),
         EXTRACT(YEAR FROM d.created_at),
         EXTRACT(MONTH FROM d.created_at)
ORDER BY month;

-- Supplier performance ranking
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_supplier_ranking AS
SELECT
  p.id AS supplier_id,
  p.company_name,
  p.full_name_en,
  p.country,
  COALESCE(sv.avg_rating, 0) AS avg_rating,
  COALESCE(sv.success_rate, 0) AS success_rate,
  COALESCE(sv.total_deals, 0) AS total_deals,
  COALESCE(sv.response_rate, 0) AS response_rate,
  COUNT(DISTINCT prod.id) AS product_count,
  COUNT(DISTINCT q.id) AS quotation_count,
  SUM(d.total_value) AS total_revenue,
  RANK() OVER (ORDER BY COALESCE(sv.avg_rating, 0) * 0.3 +
    COALESCE(sv.success_rate, 0) * 0.3 +
    COALESCE(sv.response_rate, 0) * 0.2 +
    LEAST(COALESCE(sv.total_deals, 0)::DECIMAL / 10, 1) * 0.2 DESC) AS overall_rank
FROM public.profiles p
LEFT JOIN public.supplier_verifications sv ON sv.supplier_id = p.id
LEFT JOIN public.products prod ON prod.supplier_id = p.id AND prod.status = 'active'
LEFT JOIN public.quotations q ON q.supplier_id = p.id
LEFT JOIN public.deals d ON d.supplier_id = p.id
WHERE p.account_type = 'supplier'
GROUP BY p.id, p.company_name, p.full_name_en, p.country,
         sv.avg_rating, sv.success_rate, sv.total_deals, sv.response_rate;

-- Category performance
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_category_performance AS
SELECT
  c.id AS category_id,
  c.name_en,
  c.name_ar,
  c.level,
  COUNT(DISTINCT p.id) AS product_count,
  COUNT(DISTINCT p.supplier_id) AS supplier_count,
  AVG(p.base_price) AS avg_price,
  SUM(p.view_count) AS total_views,
  SUM(p.order_count) AS total_orders,
  SUM(p.inquiry_count) AS total_inquiries,
  AVG(p.avg_rating) FILTER (WHERE p.avg_rating > 0) AS avg_rating
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id AND p.status = 'active'
GROUP BY c.id, c.name_en, c.name_ar, c.level;

-- Buyer engagement cohorts
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_buyer_cohorts AS
SELECT
  DATE_TRUNC('month', p.created_at)::DATE AS cohort_month,
  COUNT(DISTINCT p.id) AS cohort_size,
  COUNT(DISTINCT pr.buyer_id) AS buyers_with_rfq,
  COUNT(DISTINCT d.buyer_id) AS buyers_with_deal,
  COUNT(DISTINCT pr.id) AS total_rfqs,
  COUNT(DISTINCT d.id) AS total_deals,
  SUM(d.total_value) AS total_gmv,
  ROUND(COUNT(DISTINCT d.buyer_id)::DECIMAL / NULLIF(COUNT(DISTINCT p.id), 0) * 100, 2) AS conversion_rate
FROM public.profiles p
LEFT JOIN public.purchase_requests pr ON pr.buyer_id = p.id
LEFT JOIN public.deals d ON d.buyer_id = p.id
WHERE p.account_type = 'buyer'
GROUP BY DATE_TRUNC('month', p.created_at)
ORDER BY cohort_month;

-- RFQ funnel analysis
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_rfq_funnel AS
SELECT
  DATE_TRUNC('week', pr.created_at)::DATE AS week_start,
  COUNT(*) AS rfqs_created,
  COUNT(*) FILTER (WHERE pr.status IN ('receiving_quotes', 'evaluating', 'awarded', 'closed')) AS rfqs_with_quotes,
  COUNT(*) FILTER (WHERE pr.status IN ('evaluating', 'awarded')) AS rfqs_evaluating,
  COUNT(*) FILTER (WHERE pr.status = 'awarded') AS rfqs_awarded,
  COUNT(*) FILTER (WHERE pr.status IN ('cancelled', 'expired')) AS rfqs_lost,
  AVG(pr.quotation_count) AS avg_quotes_per_rfq,
  AVG(pr.max_budget) AS avg_budget,
  ROUND(COUNT(*) FILTER (WHERE pr.status = 'awarded')::DECIMAL /
    NULLIF(COUNT(*), 0) * 100, 2) AS award_rate
FROM public.purchase_requests pr
GROUP BY DATE_TRUNC('week', pr.created_at)
ORDER BY week_start;

-- ============================================================
-- REFRESH FUNCTION for materialized views
-- ============================================================
CREATE OR REPLACE FUNCTION analytics.refresh_all_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_monthly_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_supplier_ranking;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_category_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_buyer_cohorts;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_rfq_funnel;
END;
$$ LANGUAGE plpgsql;

-- Create unique indexes on MVs for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_monthly_month ON analytics.mv_monthly_summary(month);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_supplier_id ON analytics.mv_supplier_ranking(supplier_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_category_id ON analytics.mv_category_performance(category_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_cohort_month ON analytics.mv_buyer_cohorts(cohort_month);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_rfq_week ON analytics.mv_rfq_funnel(week_start);
