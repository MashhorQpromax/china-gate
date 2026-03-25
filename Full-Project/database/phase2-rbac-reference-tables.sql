-- ============================================================
-- CHINA GATE: RBAC + Reference Tables + Support Tickets
-- ============================================================
-- New tables for Role-Based Access Control, reference data,
-- platform settings, and support ticketing system
-- ============================================================

-- ============================================================
-- ORGANIZATIONS (company entity separate from user profile)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(300) NOT NULL,
  name_ar VARCHAR(300),
  organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN (
    'buyer_company', 'supplier_factory', 'manufacturer', 'logistics', 'customs_agent', 'bank', 'platform'
  )),
  registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  sector VARCHAR(200),
  employee_count INTEGER DEFAULT 0,
  founded_year INTEGER,
  description TEXT,
  logo_url TEXT,
  certifications JSONB DEFAULT '[]'::jsonb,
  bank_details JSONB DEFAULT '{}'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'inactive')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_type ON public.organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_org_country ON public.organizations(country);
CREATE INDEX IF NOT EXISTS idx_org_status ON public.organizations(status);

-- Link users to organizations
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_in_org VARCHAR(50) DEFAULT 'member' CHECK (role_in_org IN (
    'owner', 'admin', 'manager', 'member', 'viewer'
  )),
  department VARCHAR(100),
  job_title VARCHAR(200),
  is_primary BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Also add FK to profiles
ALTER TABLE public.organization_members
  ADD CONSTRAINT fk_org_member_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);

-- Add organization_id to profiles if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
  END IF;
END $$;

-- ============================================================
-- ROLES AND PERMISSIONS (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(200) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  display_name VARCHAR(300) NOT NULL,
  description TEXT,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage', 'approve', 'export')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Also FK to profiles
ALTER TABLE public.user_roles
  ADD CONSTRAINT fk_user_role_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);

-- Insert default roles
INSERT INTO public.roles (name, display_name, description, is_system, priority) VALUES
  ('super_admin', 'Super Admin', 'Full platform access', true, 100),
  ('admin', 'Admin', 'Platform administration', true, 90),
  ('support', 'Support', 'Customer support team', true, 50),
  ('operations', 'Operations', 'Operations team', true, 50),
  ('finance', 'Finance', 'Finance and billing team', true, 50),
  ('compliance', 'Compliance', 'Compliance and verification team', true, 50),
  ('buyer', 'Buyer', 'Gulf buyer role', true, 10),
  ('supplier', 'Supplier', 'Chinese supplier role', true, 10),
  ('manufacturer', 'Manufacturer', 'Gulf manufacturer role', true, 10)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO public.permissions (name, display_name, module, action) VALUES
  -- Users module
  ('users.read', 'View Users', 'users', 'read'),
  ('users.create', 'Create Users', 'users', 'create'),
  ('users.update', 'Update Users', 'users', 'update'),
  ('users.delete', 'Delete Users', 'users', 'delete'),
  ('users.manage', 'Manage Users', 'users', 'manage'),
  -- Products module
  ('products.read', 'View Products', 'products', 'read'),
  ('products.create', 'Create Products', 'products', 'create'),
  ('products.update', 'Update Products', 'products', 'update'),
  ('products.delete', 'Delete Products', 'products', 'delete'),
  ('products.approve', 'Approve Products', 'products', 'approve'),
  -- Deals module
  ('deals.read', 'View Deals', 'deals', 'read'),
  ('deals.create', 'Create Deals', 'deals', 'create'),
  ('deals.update', 'Update Deals', 'deals', 'update'),
  ('deals.manage', 'Manage Deals', 'deals', 'manage'),
  -- RFQ module
  ('rfq.read', 'View RFQs', 'rfq', 'read'),
  ('rfq.create', 'Create RFQs', 'rfq', 'create'),
  ('rfq.manage', 'Manage RFQs', 'rfq', 'manage'),
  -- Quotations module
  ('quotations.read', 'View Quotations', 'quotations', 'read'),
  ('quotations.create', 'Create Quotations', 'quotations', 'create'),
  ('quotations.manage', 'Manage Quotations', 'quotations', 'manage'),
  -- Shipments module
  ('shipments.read', 'View Shipments', 'shipments', 'read'),
  ('shipments.create', 'Create Shipments', 'shipments', 'create'),
  ('shipments.manage', 'Manage Shipments', 'shipments', 'manage'),
  -- Quality module
  ('quality.read', 'View Inspections', 'quality', 'read'),
  ('quality.create', 'Create Inspections', 'quality', 'create'),
  ('quality.manage', 'Manage Inspections', 'quality', 'manage'),
  -- Finance module
  ('finance.read', 'View Finance', 'finance', 'read'),
  ('finance.manage', 'Manage Finance', 'finance', 'manage'),
  ('lc.read', 'View LCs', 'finance', 'read'),
  ('lc.manage', 'Manage LCs', 'finance', 'manage'),
  ('lg.read', 'View LGs', 'finance', 'read'),
  ('lg.manage', 'Manage LGs', 'finance', 'manage'),
  -- Messages module
  ('messages.read', 'View Messages', 'messages', 'read'),
  ('messages.create', 'Send Messages', 'messages', 'create'),
  ('messages.manage', 'Manage Messages (admin)', 'messages', 'manage'),
  -- Tickets module
  ('tickets.read', 'View Tickets', 'tickets', 'read'),
  ('tickets.create', 'Create Tickets', 'tickets', 'create'),
  ('tickets.manage', 'Manage Tickets', 'tickets', 'manage'),
  -- Analytics module
  ('analytics.read', 'View Analytics', 'analytics', 'read'),
  ('analytics.export', 'Export Analytics', 'analytics', 'export'),
  -- Audit module
  ('audit.read', 'View Audit Logs', 'audit', 'read'),
  -- Settings module
  ('settings.read', 'View Settings', 'settings', 'read'),
  ('settings.manage', 'Manage Settings', 'settings', 'manage'),
  -- Partnerships module
  ('partnerships.read', 'View Partnerships', 'partnerships', 'read'),
  ('partnerships.create', 'Create Partnerships', 'partnerships', 'create'),
  ('partnerships.manage', 'Manage Partnerships', 'partnerships', 'manage'),
  -- Customs module
  ('customs.read', 'View Customs', 'customs', 'read'),
  ('customs.manage', 'Manage Customs', 'customs', 'manage')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- COUNTRIES (reference table)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.countries (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) NOT NULL UNIQUE,
  name_en VARCHAR(200) NOT NULL,
  name_ar VARCHAR(200),
  phone_code VARCHAR(10),
  currency_code VARCHAR(3),
  region VARCHAR(100),
  is_gulf BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO public.countries (code, name_en, name_ar, phone_code, currency_code, region, is_gulf) VALUES
  ('SA', 'Saudi Arabia', 'المملكة العربية السعودية', '+966', 'SAR', 'Gulf', true),
  ('AE', 'United Arab Emirates', 'الإمارات العربية المتحدة', '+971', 'AED', 'Gulf', true),
  ('KW', 'Kuwait', 'الكويت', '+965', 'KWD', 'Gulf', true),
  ('QA', 'Qatar', 'قطر', '+974', 'QAR', 'Gulf', true),
  ('BH', 'Bahrain', 'البحرين', '+973', 'BHD', 'Gulf', true),
  ('OM', 'Oman', 'عمان', '+968', 'OMR', 'Gulf', true),
  ('CN', 'China', 'الصين', '+86', 'CNY', 'Asia', false),
  ('EG', 'Egypt', 'مصر', '+20', 'EGP', 'Africa', false),
  ('JO', 'Jordan', 'الأردن', '+962', 'JOD', 'Middle East', false),
  ('IQ', 'Iraq', 'العراق', '+964', 'IQD', 'Middle East', false),
  ('IN', 'India', 'الهند', '+91', 'INR', 'Asia', false),
  ('TR', 'Turkey', 'تركيا', '+90', 'TRY', 'Europe', false),
  ('US', 'United States', 'الولايات المتحدة', '+1', 'USD', 'North America', false),
  ('GB', 'United Kingdom', 'المملكة المتحدة', '+44', 'GBP', 'Europe', false),
  ('DE', 'Germany', 'ألمانيا', '+49', 'EUR', 'Europe', false)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- CURRENCIES (reference table)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.currencies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) NOT NULL UNIQUE,
  name_en VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  symbol VARCHAR(10) NOT NULL,
  exchange_rate_to_usd DECIMAL(12,6) DEFAULT 1.000000,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.currencies (code, name_en, name_ar, symbol, exchange_rate_to_usd) VALUES
  ('USD', 'US Dollar', 'دولار أمريكي', '$', 1.000000),
  ('SAR', 'Saudi Riyal', 'ريال سعودي', 'ر.س', 0.266667),
  ('AED', 'UAE Dirham', 'درهم إماراتي', 'د.إ', 0.272294),
  ('CNY', 'Chinese Yuan', 'يوان صيني', '¥', 0.137174),
  ('KWD', 'Kuwaiti Dinar', 'دينار كويتي', 'د.ك', 3.251497),
  ('QAR', 'Qatari Riyal', 'ريال قطري', 'ر.ق', 0.274725),
  ('BHD', 'Bahraini Dinar', 'دينار بحريني', 'د.ب', 2.659574),
  ('OMR', 'Omani Rial', 'ريال عماني', 'ر.ع', 2.597403),
  ('EUR', 'Euro', 'يورو', '€', 1.085000),
  ('GBP', 'British Pound', 'جنيه استرليني', '£', 1.265000)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(200) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.platform_settings (key, value, category, description, is_public) VALUES
  ('platform.name', '"China Gate"', 'general', 'Platform display name', true),
  ('platform.name_ar', '"بوابة الصين"', 'general', 'Platform Arabic name', true),
  ('platform.commission_rate', '2.5', 'finance', 'Platform commission percentage', false),
  ('platform.min_order_value', '500', 'finance', 'Minimum order value in USD', true),
  ('platform.supported_currencies', '["USD","SAR","AED","CNY","KWD","QAR","BHD","OMR"]', 'finance', 'Supported currencies', true),
  ('platform.supported_languages', '["en","ar","zh"]', 'general', 'Supported languages', true),
  ('platform.max_rfq_per_day', '10', 'limits', 'Max RFQs per buyer per day', false),
  ('platform.max_products_free', '50', 'limits', 'Max products for free suppliers', false),
  ('platform.auto_close_rfq_days', '30', 'rfq', 'Days before RFQ auto-closes', false),
  ('platform.quotation_validity_days', '30', 'rfq', 'Default quotation validity days', true),
  ('notifications.email_enabled', 'true', 'notifications', 'Email notifications enabled', false),
  ('notifications.sms_enabled', 'false', 'notifications', 'SMS notifications enabled', false),
  ('security.max_login_attempts', '5', 'security', 'Max login attempts before lockout', false),
  ('security.session_timeout_hours', '24', 'security', 'Session timeout in hours', false),
  ('feature.partnerships_enabled', 'true', 'features', 'Partnerships module enabled', false),
  ('feature.banking_enabled', 'false', 'features', 'Banking integration enabled', false),
  ('feature.customs_enabled', 'true', 'features', 'Customs module enabled', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number VARCHAR(20) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (category IN (
    'general', 'technical', 'billing', 'dispute', 'shipping', 'quality', 'account', 'verification', 'other'
  )),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN (
    'open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed', 'escalated'
  )),
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  sla_deadline TIMESTAMPTZ,
  escalation_level INTEGER DEFAULT 0,
  internal_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FK to profiles
ALTER TABLE public.support_tickets
  ADD CONSTRAINT fk_ticket_user_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON public.support_tickets(created_at DESC);

-- Ticket responses/comments
CREATE TABLE IF NOT EXISTS public.ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket ON public.ticket_responses(ticket_id);

-- Auto-generate ticket reference number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference_number := 'TK-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(nextval('public.ticket_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS public.ticket_seq START 1;

DROP TRIGGER IF EXISTS trg_ticket_number ON public.support_tickets;
CREATE TRIGGER trg_ticket_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL OR NEW.reference_number = '')
  EXECUTE FUNCTION public.generate_ticket_number();

-- Add audit triggers to new tables
DROP TRIGGER IF EXISTS trg_audit_organizations ON public.organizations;
CREATE TRIGGER trg_audit_organizations
  AFTER INSERT OR UPDATE OR DELETE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

DROP TRIGGER IF EXISTS trg_audit_support_tickets ON public.support_tickets;
CREATE TRIGGER trg_audit_support_tickets
  AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Register migration
SELECT migrations.apply_migration(
  '008',
  'phase2-rbac-reference-tables',
  'RBAC (roles, permissions, organizations), reference tables (countries, currencies), platform settings, support tickets',
  '-- Phase 2: RBAC + Reference + Tickets',
  'DROP TABLE IF EXISTS public.ticket_responses CASCADE; DROP TABLE IF EXISTS public.support_tickets CASCADE; DROP TABLE IF EXISTS public.platform_settings CASCADE; DROP TABLE IF EXISTS public.currencies CASCADE; DROP TABLE IF EXISTS public.countries CASCADE; DROP TABLE IF EXISTS public.user_roles CASCADE; DROP TABLE IF EXISTS public.role_permissions CASCADE; DROP TABLE IF EXISTS public.permissions CASCADE; DROP TABLE IF EXISTS public.roles CASCADE; DROP TABLE IF EXISTS public.organization_members CASCADE; DROP TABLE IF EXISTS public.organizations CASCADE;'
);
