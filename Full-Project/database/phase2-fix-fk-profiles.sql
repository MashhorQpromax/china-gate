-- ============================================================
-- Phase 2 Fix: Add FK constraints to profiles table
-- ============================================================
-- The original schema has all user FKs pointing to auth.users(id)
-- but Supabase PostgREST needs direct FKs to profiles table
-- for the join syntax like: profiles!buyer_id(full_name_en, ...)
-- ============================================================

-- First ensure profiles table has the right columns
-- (profiles was created in Phase 1, just verify key columns exist)
DO $$
BEGIN
  -- Add company_name if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
  END IF;

  -- Add full_name_ar if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name_ar'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name_ar TEXT;
  END IF;

  -- Add city if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;

  -- Add phone if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
END $$;

-- ============================================================
-- Add additional FK constraints from tables to profiles
-- These run alongside existing auth.users FKs
-- ============================================================

-- Products: supplier_id -> profiles
ALTER TABLE public.products
  ADD CONSTRAINT fk_products_supplier_profile
  FOREIGN KEY (supplier_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Purchase Requests: buyer_id -> profiles
ALTER TABLE public.purchase_requests
  ADD CONSTRAINT fk_purchase_requests_buyer_profile
  FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Quotations: supplier_id, buyer_id -> profiles
ALTER TABLE public.quotations
  ADD CONSTRAINT fk_quotations_supplier_profile
  FOREIGN KEY (supplier_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.quotations
  ADD CONSTRAINT fk_quotations_buyer_profile
  FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Deals: buyer_id, supplier_id -> profiles
ALTER TABLE public.deals
  ADD CONSTRAINT fk_deals_buyer_profile
  FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.deals
  ADD CONSTRAINT fk_deals_supplier_profile
  FOREIGN KEY (supplier_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Deal Timeline: user_id -> profiles
ALTER TABLE public.deal_timeline
  ADD CONSTRAINT fk_deal_timeline_user_profile
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Product Reviews: reviewer_id -> profiles
ALTER TABLE public.product_reviews
  ADD CONSTRAINT fk_product_reviews_reviewer_profile
  FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Shipments: supplier_id, buyer_id -> profiles
ALTER TABLE public.shipments
  ADD CONSTRAINT fk_shipments_supplier_profile
  FOREIGN KEY (supplier_id) REFERENCES public.profiles(id);

ALTER TABLE public.shipments
  ADD CONSTRAINT fk_shipments_buyer_profile
  FOREIGN KEY (buyer_id) REFERENCES public.profiles(id);

-- Conversations: sender_id -> profiles
ALTER TABLE public.messages
  ADD CONSTRAINT fk_messages_sender_profile
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Supplier Verifications: supplier_id -> profiles
ALTER TABLE public.supplier_verifications
  ADD CONSTRAINT fk_supplier_verifications_profile
  FOREIGN KEY (supplier_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Notifications: recipient_id -> profiles
ALTER TABLE public.notifications
  ADD CONSTRAINT fk_notifications_recipient_profile
  FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ============================================================
-- Done! Now PostgREST can resolve profiles!column_name joins
-- ============================================================
