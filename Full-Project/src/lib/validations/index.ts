import { z } from 'zod';
import { NextRequest } from 'next/server';
import { apiBadRequest } from '@/lib/api-response';

// Reusable field schemas
export const uuid = z.string().uuid();
export const email = z.string().email();
export const phone = z.string().min(7).max(20);
export const positiveInt = z.number().int().positive();
export const positiveDecimal = z.number().positive();
export const dateString = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
export const currency = z.enum(['USD', 'CNY', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR']);
export const accountType = z.enum(['gulf_buyer', 'chinese_supplier', 'gulf_manufacturer', 'admin']);

// Pagination query schema
export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

// ============================================================
// AUTH
// ============================================================
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  clientInfo: z.object({}).passthrough().optional(),
});

export const registerSchema = z.object({
  email: email,
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/\d/, 'Must contain number'),
  accountType: accountType,
  fullNameEn: z.string().min(2).max(100),
  fullNameAr: z.string().min(2).max(100).optional(),
  companyName: z.string().min(2).max(200),
  phone: phone.optional(),
  country: z.string().min(2).max(50).optional(),
  commercialRegistration: z.string().optional(),
});

// ============================================================
// PRODUCTS
// ============================================================
export const createProductSchema = z.object({
  name_en: z.string().min(2).max(500),
  name_ar: z.string().min(2).max(500).optional(),
  description_en: z.string().min(10).optional(),
  category_id: uuid,
  base_price: positiveDecimal,
  currency: currency.default('USD'),
  min_order_quantity: positiveInt.default(1),
  origin_country: z.string().max(100).optional(),
  brand_name: z.string().max(200).optional(),
  sku: z.string().max(100).optional(),
  specifications: z.record(z.unknown()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).optional(),
  pricing_tiers: z.array(z.object({
    min_quantity: positiveInt,
    max_quantity: positiveInt.optional(),
    unit_price: positiveDecimal,
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// ============================================================
// RFQ (Purchase Requests)
// ============================================================
export const createRfqSchema = z.object({
  title: z.string().min(5).max(500),
  product_name: z.string().min(2).max(500),
  category_id: uuid.optional(),
  description: z.string().min(10).optional(),
  quantity: positiveInt,
  unit: z.string().max(50).default('pieces'),
  max_budget: positiveDecimal.optional(),
  currency: currency.default('USD'),
  deadline: dateString.optional(),
  specifications: z.record(z.unknown()).optional(),
  delivery_terms: z.string().max(50).optional(),
  payment_terms: z.string().max(50).optional(),
});

// ============================================================
// QUOTATIONS
// ============================================================
export const createQuotationSchema = z.object({
  purchase_request_id: uuid,
  unit_price: positiveDecimal,
  total_price: positiveDecimal,
  quantity: positiveInt,
  currency: currency.default('USD'),
  lead_time_days: positiveInt.optional(),
  validity_days: positiveInt.default(30),
  payment_terms: z.string().max(100).optional(),
  delivery_terms: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  specifications: z.record(z.unknown()).optional(),
});

// ============================================================
// DEALS
// ============================================================
export const createDealSchema = z.object({
  quotation_id: uuid,
  buyer_id: uuid,
  supplier_id: uuid,
  product_id: uuid.optional(),
  title: z.string().min(2).max(500),
  quantity: positiveInt,
  unit_price: positiveDecimal,
  total_value: positiveDecimal,
  currency: currency.default('USD'),
  incoterm: z.string().max(10).optional(),
  payment_terms: z.string().max(100).optional(),
  expected_delivery: dateString.optional(),
  notes: z.string().max(2000).optional(),
});

export const updateDealSchema = z.object({
  stage: z.string().optional(),
  payment_status: z.string().optional(),
  amount_paid: positiveDecimal.optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================
// SHIPMENTS
// ============================================================
export const createShipmentSchema = z.object({
  deal_id: uuid,
  shipment_type: z.enum(['sea', 'air', 'land', 'multimodal']).default('sea'),
  carrier_name: z.string().max(200).optional(),
  origin_port: z.string().max(200),
  destination_port: z.string().max(200),
  container_number: z.string().max(100).optional(),
  bl_number: z.string().max(100).optional(),
  estimated_departure: dateString.optional(),
  estimated_arrival: dateString.optional(),
  total_weight_kg: positiveDecimal.optional(),
  total_volume_cbm: positiveDecimal.optional(),
  packages_count: positiveInt.optional(),
  insurance_value: positiveDecimal.optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================
// SUPPORT TICKETS
// ============================================================
export const createTicketSchema = z.object({
  subject: z.string().min(5).max(500),
  description: z.string().min(10).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['general', 'technical', 'billing', 'dispute', 'shipping', 'quality', 'account']).default('general'),
  related_entity_type: z.string().optional(),
  related_entity_id: uuid.optional(),
});

// ============================================================
// MESSAGES
// ============================================================
export const sendMessageSchema = z.object({
  conversation_id: uuid.optional(),
  recipient_id: uuid.optional(),
  content: z.string().min(1).max(5000),
  deal_id: uuid.optional(),
});

// ============================================================
// VALIDATION HELPER
// ============================================================
export async function validateBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: ReturnType<typeof apiBadRequest> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return {
        data: null,
        error: apiBadRequest('Validation failed', fieldErrors),
      };
    }

    return { data: result.data, error: null };
  } catch {
    return {
      data: null,
      error: apiBadRequest('Invalid JSON body'),
    };
  }
}
