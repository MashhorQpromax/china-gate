-- =============================================
-- CHINA GATE: Complete B2B Marketplace Schema
-- Inspired by Alibaba, Made in China, Global Sources
-- =============================================

-- =============================================
-- PART 1: CATEGORIES (Hierarchical like Alibaba)
-- =============================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_zh TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  icon_url TEXT,
  image_url TEXT,
  level INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  product_count INTEGER DEFAULT 0,
  hs_code_prefix TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = true;

-- =============================================
-- PART 2: PRODUCTS (Alibaba-level detail)
-- =============================================

-- Drop existing basic products table if it exists
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Basic Info
  sku TEXT UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_zh TEXT,
  slug TEXT UNIQUE,

  -- Category
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,

  -- Description (rich content)
  short_description_en TEXT,
  short_description_ar TEXT,
  full_description_en TEXT,
  full_description_ar TEXT,

  -- Pricing (Alibaba-style tiered pricing)
  base_price DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  price_type TEXT DEFAULT 'negotiable' CHECK (price_type IN ('fixed', 'negotiable', 'rfq_only', 'tiered')),

  -- Quantity & MOQ
  moq INTEGER DEFAULT 1,
  moq_unit TEXT DEFAULT 'pieces',
  max_order_quantity INTEGER,
  stock_quantity INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'pre_order', 'made_to_order')),

  -- Units & Measurement
  unit_of_measure TEXT DEFAULT 'piece' CHECK (unit_of_measure IN (
    'piece', 'set', 'pair', 'dozen', 'box', 'carton', 'pallet',
    'kg', 'ton', 'metric_ton', 'lb',
    'meter', 'yard', 'roll', 'sheet',
    'liter', 'gallon', 'barrel',
    'sqm', 'sqft', 'cbm'
  )),
  unit_weight DECIMAL(10,3),
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'g', 'lb', 'oz', 'ton')),

  -- Dimensions
  length DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  dimension_unit TEXT DEFAULT 'cm' CHECK (dimension_unit IN ('cm', 'mm', 'inch', 'm')),

  -- Packaging (Alibaba-level detail)
  packaging_type TEXT,
  packaging_detail TEXT,
  units_per_package INTEGER,
  packages_per_carton INTEGER,
  carton_dimensions TEXT,
  carton_gross_weight DECIMAL(10,3),
  carton_net_weight DECIMAL(10,3),
  units_per_container_20ft INTEGER,
  units_per_container_40ft INTEGER,
  units_per_container_40hq INTEGER,

  -- Production & Lead Time
  lead_time_min INTEGER,
  lead_time_max INTEGER,
  lead_time_unit TEXT DEFAULT 'days' CHECK (lead_time_unit IN ('days', 'weeks')),
  production_capacity INTEGER,
  production_capacity_unit TEXT,
  sample_available BOOLEAN DEFAULT false,
  sample_price DECIMAL(10,2),
  sample_lead_time INTEGER,
  customization_available BOOLEAN DEFAULT false,
  customization_details TEXT,

  -- Trade Terms
  payment_terms TEXT[],
  incoterms TEXT[],
  supply_ability TEXT,
  port_of_loading TEXT,

  -- Compliance & Certifications
  certifications TEXT[],
  hs_code TEXT,
  origin_country TEXT DEFAULT 'China',
  brand_name TEXT,
  model_number TEXT,

  -- Media
  main_image_url TEXT,
  images TEXT[],
  video_url TEXT,
  documents TEXT[],

  -- Specifications (flexible key-value)
  specifications JSONB DEFAULT '[]'::jsonb,

  -- SEO & Search
  keywords TEXT[],
  tags TEXT[],
  search_text TSVECTOR,

  -- Ratings & Stats
  avg_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'inactive', 'rejected', 'archived')),
  rejection_reason TEXT,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product pricing tiers (Alibaba volume pricing)
CREATE TABLE IF NOT EXISTS public.product_pricing_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (Color, Size, Material, etc.)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_name TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  sku_suffix TEXT,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images with ordering
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product favorites/wishlist
CREATE TABLE IF NOT EXISTS public.product_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Product reviews & ratings
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deal_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  supplier_response TEXT,
  supplier_responded_at TIMESTAMPTZ,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 3: RFQ (Request for Quotation) System
-- =============================================

CREATE TABLE IF NOT EXISTS public.purchase_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- What they need
  title TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,

  -- Quantity
  quantity INTEGER NOT NULL,
  unit_of_measure TEXT DEFAULT 'piece',

  -- Budget
  target_price DECIMAL(15,2),
  max_budget DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',

  -- Requirements
  required_certifications TEXT[],
  preferred_incoterm TEXT,
  preferred_payment_terms TEXT,
  preferred_origin TEXT,

  -- Delivery
  delivery_address TEXT,
  destination_port TEXT,
  required_delivery_date DATE,

  -- Media
  reference_images TEXT[],
  reference_documents TEXT[],

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'receiving_quotes', 'evaluating', 'awarded', 'closed', 'cancelled', 'expired')),
  quotation_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  awarded_to UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations from suppliers
DROP TABLE IF EXISTS public.quotations CASCADE;

CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  purchase_request_id UUID REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,

  -- Parties
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Pricing
  unit_price DECIMAL(15,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Pricing tiers in this quote
  pricing_tiers JSONB DEFAULT '[]'::jsonb,

  -- Terms
  incoterm TEXT,
  payment_terms TEXT,
  lead_time INTEGER,
  lead_time_unit TEXT DEFAULT 'days',
  valid_until DATE NOT NULL,

  -- Shipping
  port_of_loading TEXT,
  estimated_shipping_cost DECIMAL(10,2),
  shipping_method TEXT,

  -- Details
  notes TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  attachments TEXT[],

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'sent', 'viewed', 'accepted', 'rejected', 'counter_offer', 'expired', 'withdrawn')),
  rejection_reason TEXT,

  -- Counter offers
  counter_offer_price DECIMAL(15,2),
  counter_offer_quantity INTEGER,
  counter_offer_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 4: ORDERS & DEALS (Enhanced)
-- =============================================

DROP TABLE IF EXISTS public.deals CASCADE;

CREATE TABLE IF NOT EXISTS public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id),

  -- Parties
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Product
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,

  -- Quantity & Pricing
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Terms
  incoterm TEXT,
  payment_terms TEXT,

  -- Shipping
  shipping_port TEXT,
  destination_port TEXT,
  shipping_method TEXT,
  expected_delivery_date DATE,
  actual_delivery_date DATE,

  -- Stage tracking
  stage TEXT DEFAULT 'negotiation' CHECK (stage IN (
    'negotiation', 'quotation_sent', 'quotation_review', 'quotation_accepted',
    'po_issued', 'po_confirmed', 'production_start', 'production_inspection',
    'ready_for_shipment', 'lc_issued', 'goods_shipped', 'goods_in_transit',
    'port_arrived', 'customs_clearance', 'delivery', 'completed', 'cancelled', 'disputed'
  )),
  stage_history JSONB DEFAULT '[]'::jsonb,

  -- Documents
  purchase_order_url TEXT,
  invoice_url TEXT,
  packing_list_url TEXT,
  documents JSONB DEFAULT '[]'::jsonb,

  -- Financial
  amount_paid DECIMAL(15,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),

  -- Internal
  buyer_notes TEXT,
  supplier_notes TEXT,
  admin_notes TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Rating (after completion)
  buyer_rating INTEGER CHECK (buyer_rating >= 1 AND buyer_rating <= 5),
  supplier_rating INTEGER CHECK (supplier_rating >= 1 AND supplier_rating <= 5),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal timeline/activity log
CREATE TABLE IF NOT EXISTS public.deal_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT,
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 5: SHIPMENTS (Enhanced)
-- =============================================

DROP TABLE IF EXISTS public.shipments CASCADE;

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,

  -- Parties
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Shipping details
  shipping_type TEXT DEFAULT 'sea' CHECK (shipping_type IN ('air', 'sea', 'land', 'rail', 'multimodal', 'express')),
  carrier_name TEXT,
  carrier_contact TEXT,
  tracking_number TEXT,
  tracking_url TEXT,

  -- Ports
  origin_port TEXT,
  destination_port TEXT,
  transit_ports TEXT[],

  -- Dates
  booking_date DATE,
  departure_date DATE,
  estimated_arrival DATE,
  actual_arrival DATE,

  -- Container / Cargo
  container_type TEXT,
  container_number TEXT,
  bl_number TEXT,
  packages_count INTEGER,
  total_weight DECIMAL(12,3),
  total_volume DECIMAL(12,3),
  weight_unit TEXT DEFAULT 'kg',
  volume_unit TEXT DEFAULT 'cbm',

  -- Insurance
  insured BOOLEAN DEFAULT false,
  insurance_value DECIMAL(15,2),
  insurance_provider TEXT,
  insurance_policy_number TEXT,

  -- Costs
  freight_cost DECIMAL(15,2),
  insurance_cost DECIMAL(15,2),
  other_costs DECIMAL(15,2),
  total_shipping_cost DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'booked', 'packed', 'in_warehouse', 'shipped',
    'in_transit', 'port_arrived', 'customs_clearance',
    'out_for_delivery', 'delivered', 'returned', 'damaged', 'lost'
  )),

  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment tracking events
CREATE TABLE IF NOT EXISTS public.shipment_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  event_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 6: BANKING (LC & LG)
-- =============================================

CREATE TABLE IF NOT EXISTS public.letters_of_credit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,

  -- Parties
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  issuing_bank TEXT NOT NULL,
  advising_bank TEXT,
  beneficiary_bank TEXT,

  -- Type & Amount
  lc_type TEXT DEFAULT 'irrevocable' CHECK (lc_type IN ('irrevocable', 'revocable', 'standby', 'revolving', 'back_to_back', 'transferable')),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  amount_used DECIMAL(15,2) DEFAULT 0,

  -- Dates
  issue_date DATE,
  expiry_date DATE NOT NULL,
  latest_shipment_date DATE,

  -- Terms
  description TEXT,
  documents_required TEXT[],
  special_conditions TEXT,
  partial_shipment_allowed BOOLEAN DEFAULT false,
  transshipment_allowed BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'requested', 'bank_received', 'under_review',
    'approved', 'issued', 'amendment_requested', 'amended',
    'negotiation', 'accepted', 'payment_made', 'expired', 'cancelled'
  )),

  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.letters_of_guarantee (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,

  -- Parties
  requester_id UUID REFERENCES auth.users(id) NOT NULL,
  beneficiary_id UUID REFERENCES auth.users(id),
  issuing_bank TEXT NOT NULL,

  -- Type & Amount
  lg_type TEXT DEFAULT 'performance_bond' CHECK (lg_type IN ('bid_bond', 'performance_bond', 'advance_payment', 'customs', 'retention')),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Dates
  issue_date DATE,
  expiry_date DATE NOT NULL,

  -- Details
  beneficiary_name TEXT,
  claim_condition TEXT,
  description TEXT,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'requested', 'bank_review', 'approved', 'issued',
    'claimed', 'released', 'expired', 'cancelled'
  )),
  amount_claimed DECIMAL(15,2) DEFAULT 0,
  claim_date DATE,

  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 7: QUALITY INSPECTION
-- =============================================

CREATE TABLE IF NOT EXISTS public.quality_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  inspector_id UUID REFERENCES auth.users(id),

  -- Inspection details
  stage TEXT NOT NULL CHECK (stage IN (
    'pre_production', 'material_check', 'first_article',
    'production_process', 'in_process', 'final_inspection',
    'packaging', 'load_check', 'transit_monitoring', 'post_delivery'
  )),

  -- Results
  result TEXT DEFAULT 'pending' CHECK (result IN ('pass', 'conditional_pass', 'fail', 'pending')),
  defect_rate DECIMAL(5,2) DEFAULT 0,
  sample_size INTEGER,
  defective_count INTEGER DEFAULT 0,

  -- Details
  notes TEXT,
  findings TEXT,
  corrective_actions TEXT,

  -- Media
  photos TEXT[],
  report_url TEXT,
  certificates TEXT[],

  -- Dates
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 8: MESSAGING SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_ids UUID[] NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  is_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS public.messages CASCADE;

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,

  -- Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'quotation', 'order_update')),
  attachments JSONB DEFAULT '[]'::jsonb,

  -- Status
  read_by UUID[] DEFAULT '{}',
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 9: CUSTOMS CLEARANCE
-- =============================================

CREATE TABLE IF NOT EXISTS public.customs_clearances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,

  -- Parties
  importer_id UUID REFERENCES auth.users(id) NOT NULL,
  customs_agent_id UUID REFERENCES auth.users(id),

  -- Details
  import_country TEXT NOT NULL,
  hs_code TEXT NOT NULL,
  declared_value DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Duties & Taxes
  duty_rate DECIMAL(5,2),
  estimated_duty DECIMAL(15,2),
  actual_duty DECIMAL(15,2),
  vat_rate DECIMAL(5,2),
  estimated_vat DECIMAL(15,2),
  actual_vat DECIMAL(15,2),
  other_fees DECIMAL(15,2) DEFAULT 0,
  total_charges DECIMAL(15,2),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'documents_submitted', 'under_review',
    'inspection_required', 'duties_assessed', 'payment_pending',
    'cleared', 'released', 'held', 'rejected'
  )),

  -- Documents
  documents_submitted TEXT[],
  documents JSONB DEFAULT '[]'::jsonb,

  -- Dates
  submitted_at TIMESTAMPTZ,
  cleared_at TIMESTAMPTZ,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 10: DISPUTES & PARTNERSHIPS
-- =============================================

CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,

  -- Parties
  filed_by UUID REFERENCES auth.users(id) NOT NULL,
  filed_against UUID REFERENCES auth.users(id) NOT NULL,

  -- Details
  dispute_type TEXT NOT NULL CHECK (dispute_type IN (
    'quality_issue', 'delivery_delay', 'wrong_product',
    'quantity_mismatch', 'payment_dispute', 'damage',
    'specification_mismatch', 'fraud', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT[],
  claimed_amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',

  -- Resolution
  resolution_method TEXT CHECK (resolution_method IN ('negotiation', 'mediation', 'arbitration', 'litigation')),
  resolution_description TEXT,
  resolved_amount DECIMAL(15,2),

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'negotiating', 'mediation', 'resolved', 'closed', 'escalated')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),

  -- Dates
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partnerships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,

  -- Parties
  initiator_id UUID REFERENCES auth.users(id) NOT NULL,
  partner_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Details
  partnership_type TEXT NOT NULL CHECK (partnership_type IN ('manufacturing', 'labor_lending', 'distribution', 'joint_venture', 'oem', 'odm')),
  title TEXT NOT NULL,
  description TEXT,
  terms TEXT,

  -- Agreement
  agreement_document_url TEXT,
  start_date DATE,
  end_date DATE,

  -- Status
  status TEXT DEFAULT 'inquiry' CHECK (status IN (
    'inquiry', 'under_discussion', 'agreement_sent',
    'agreement_signed', 'active', 'suspended', 'terminated'
  )),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 11: SUPPLIER VERIFICATION
-- =============================================

CREATE TABLE IF NOT EXISTS public.supplier_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Business verification
  business_license_verified BOOLEAN DEFAULT false,
  business_license_url TEXT,
  business_license_number TEXT,

  -- On-site inspection
  onsite_inspection_done BOOLEAN DEFAULT false,
  onsite_inspection_date DATE,
  onsite_inspection_report TEXT,

  -- Third-party audit
  third_party_audit BOOLEAN DEFAULT false,
  audit_company TEXT,
  audit_date DATE,
  audit_report_url TEXT,

  -- Certifications
  iso_9001 BOOLEAN DEFAULT false,
  iso_14001 BOOLEAN DEFAULT false,
  iso_45001 BOOLEAN DEFAULT false,
  ce_certified BOOLEAN DEFAULT false,
  saso_certified BOOLEAN DEFAULT false,
  other_certifications JSONB DEFAULT '[]'::jsonb,

  -- Badge
  verification_level TEXT DEFAULT 'unverified' CHECK (verification_level IN (
    'unverified', 'basic', 'verified', 'gold', 'premium'
  )),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  expires_at DATE,

  -- Stats
  total_deals INTEGER DEFAULT 0,
  successful_deals INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 12: NOTIFICATIONS (Enhanced)
-- =============================================

DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Content
  type TEXT NOT NULL CHECK (type IN (
    'deal_update', 'lc_issued', 'shipment_alert', 'quality_report',
    'payment_received', 'message', 'system', 'workflow_action',
    'customs_clearance', 'partnership_update', 'rfq_received',
    'quotation_received', 'review_received', 'product_inquiry',
    'dispute_update', 'verification_update', 'price_alert'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Related entity
  entity_type TEXT,
  entity_id UUID,
  action_url TEXT,

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Delivery
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);

-- Pricing tiers
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_product ON public.product_pricing_tiers(product_id);

-- Variants
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.product_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON public.product_favorites(product_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON public.product_reviews(reviewer_id);

-- Purchase requests
CREATE INDEX IF NOT EXISTS idx_rfq_buyer ON public.purchase_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_rfq_status ON public.purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_rfq_created ON public.purchase_requests(created_at DESC);

-- Quotations
CREATE INDEX IF NOT EXISTS idx_quotes_supplier ON public.quotations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_buyer ON public.quotations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_rfq ON public.quotations(purchase_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotations(status);

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_buyer ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_supplier ON public.deals(supplier_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_created ON public.deals(created_at DESC);

-- Shipments
CREATE INDEX IF NOT EXISTS idx_shipments_deal ON public.shipments(deal_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- LC & LG
CREATE INDEX IF NOT EXISTS idx_lc_deal ON public.letters_of_credit(deal_id);
CREATE INDEX IF NOT EXISTS idx_lg_deal ON public.letters_of_guarantee(deal_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Disputes
CREATE INDEX IF NOT EXISTS idx_disputes_deal ON public.disputes(deal_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

-- Supplier verification
CREATE INDEX IF NOT EXISTS idx_verification_supplier ON public.supplier_verifications(supplier_id);
CREATE INDEX IF NOT EXISTS idx_verification_level ON public.supplier_verifications(verification_level);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters_of_credit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters_of_guarantee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customs_clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read for categories and active products
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view product pricing" ON public.product_pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Anyone can view visible reviews" ON public.product_reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Anyone can view supplier verification" ON public.supplier_verifications FOR SELECT USING (true);

-- Authenticated users
CREATE POLICY "Users can manage own favorites" ON public.product_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can write reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- Deals: both parties can view
CREATE POLICY "Deal parties can view deals" ON public.deals FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);
CREATE POLICY "Deal parties can view timeline" ON public.deal_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = deal_timeline.deal_id AND (deals.buyer_id = auth.uid() OR deals.supplier_id = auth.uid()))
);

-- Quotations: both parties can view
CREATE POLICY "Quote parties can view quotes" ON public.quotations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- Purchase requests: public for suppliers, own for buyers
CREATE POLICY "Anyone can view open RFQs" ON public.purchase_requests FOR SELECT USING (status = 'open' OR auth.uid() = buyer_id);

-- Shipments: both parties can view
CREATE POLICY "Shipment parties can view" ON public.shipments FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);
CREATE POLICY "Anyone can view tracking" ON public.shipment_tracking FOR SELECT USING (true);

-- Banking: both parties
CREATE POLICY "LC parties can view" ON public.letters_of_credit FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);
CREATE POLICY "LG parties can view" ON public.letters_of_guarantee FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = beneficiary_id);

-- Quality
CREATE POLICY "Quality visible to deal parties" ON public.quality_inspections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.deals WHERE deals.id = quality_inspections.deal_id AND (deals.buyer_id = auth.uid() OR deals.supplier_id = auth.uid()))
);

-- Messages: participants only
CREATE POLICY "Conversation participants" ON public.conversations FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "Message participants" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND auth.uid() = ANY(conversations.participant_ids))
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Customs
CREATE POLICY "Customs parties can view" ON public.customs_clearances FOR SELECT USING (auth.uid() = importer_id OR auth.uid() = customs_agent_id);

-- Disputes: both parties
CREATE POLICY "Dispute parties can view" ON public.disputes FOR SELECT USING (auth.uid() = filed_by OR auth.uid() = filed_against);

-- Partnerships: both parties
CREATE POLICY "Partnership parties can view" ON public.partnerships FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = partner_id);

-- Service role full access for all tables
CREATE POLICY "Service full access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access pricing" ON public.product_pricing_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access reviews" ON public.product_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access rfq" ON public.purchase_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access quotes" ON public.quotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access deals" ON public.deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access timeline" ON public.deal_timeline FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access shipments" ON public.shipments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access tracking" ON public.shipment_tracking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access lc" ON public.letters_of_credit FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access lg" ON public.letters_of_guarantee FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access quality" ON public.quality_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access customs" ON public.customs_clearances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access disputes" ON public.disputes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access partnerships" ON public.partnerships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access verifications" ON public.supplier_verifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- AUTO-UPDATE TIMESTAMPS
-- =============================================

CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'categories', 'products', 'product_reviews',
      'purchase_requests', 'quotations', 'deals',
      'shipments', 'letters_of_credit', 'letters_of_guarantee',
      'quality_inspections', 'conversations',
      'customs_clearances', 'disputes', 'partnerships',
      'supplier_verifications'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_timestamp ON public.%I;
      CREATE TRIGGER update_%I_timestamp
        BEFORE UPDATE ON public.%I
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_timestamp();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

-- =============================================
-- AUTO-GENERATE REFERENCE NUMBERS
-- =============================================

CREATE OR REPLACE FUNCTION generate_reference_number(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
BEGIN
  ref := prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto reference numbers on deals
CREATE OR REPLACE FUNCTION auto_deal_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := generate_reference_number('DL');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_deal_ref BEFORE INSERT ON public.deals
  FOR EACH ROW EXECUTE FUNCTION auto_deal_reference();

-- Trigger for auto reference on shipments
CREATE OR REPLACE FUNCTION auto_shipment_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := generate_reference_number('SH');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_shipment_ref BEFORE INSERT ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION auto_shipment_reference();

-- Auto reference for RFQs
CREATE OR REPLACE FUNCTION auto_rfq_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := generate_reference_number('RFQ');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_rfq_ref BEFORE INSERT ON public.purchase_requests
  FOR EACH ROW EXECUTE FUNCTION auto_rfq_reference();

-- Auto reference for quotations
CREATE OR REPLACE FUNCTION auto_quote_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := generate_reference_number('QT');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_quote_ref BEFORE INSERT ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION auto_quote_reference();

-- Update product stats on review
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET
    avg_rating = (SELECT AVG(rating) FROM public.product_reviews WHERE product_id = NEW.product_id AND is_visible = true),
    review_count = (SELECT COUNT(*) FROM public.product_reviews WHERE product_id = NEW.product_id AND is_visible = true)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_update_product
  AFTER INSERT OR UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();
