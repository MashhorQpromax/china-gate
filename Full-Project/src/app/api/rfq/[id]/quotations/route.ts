import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/rfq/[id]/quotations - List quotations for an RFQ
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { data, error } = await supabase
      .from('quotations')
      .select('*, profiles!supplier_id(full_name_en, company_name, country, city)')
      .eq('purchase_request_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ quotations: data });
  } catch (error) {
    console.error('Quotations list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/rfq/[id]/quotations - Submit a quotation for an RFQ
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
    const body = await request.json();

    // Verify the RFQ exists and is open
    const { data: rfq, error: rfqError } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (rfqError || !rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    if (!['open', 'receiving_quotes'].includes(rfq.status)) {
      return NextResponse.json({ error: 'RFQ is no longer accepting quotations' }, { status: 400 });
    }

    const {
      supplierId, productId, unitPrice, quantity, totalPrice, currency,
      pricingTiers, incoterm, paymentTerms, leadTime, leadTimeUnit,
      validUntil, portOfLoading, estimatedShippingCost, shippingMethod,
      notes, specifications, attachments,
    } = body;

    // Resolve supplier ID from body or auth headers
    const resolvedSupplierId = supplierId || request.headers.get('x-user-id');

    if (!resolvedSupplierId || !unitPrice || !quantity || !totalPrice || !validUntil) {
      return NextResponse.json(
        { error: 'Missing required fields (authentication required)' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('quotations')
      .insert({
        reference_number: '', // Auto-generated
        purchase_request_id: id,
        product_id: productId || null,
        supplier_id: resolvedSupplierId,
        buyer_id: rfq.buyer_id,
        unit_price: unitPrice,
        quantity,
        total_price: totalPrice,
        currency: currency || 'USD',
        pricing_tiers: pricingTiers || [],
        incoterm: incoterm || null,
        payment_terms: paymentTerms || null,
        lead_time: leadTime || null,
        lead_time_unit: leadTimeUnit || 'days',
        valid_until: validUntil,
        port_of_loading: portOfLoading || null,
        estimated_shipping_cost: estimatedShippingCost || null,
        shipping_method: shippingMethod || null,
        notes: notes || null,
        specifications: specifications || [],
        attachments: attachments || null,
        status: 'sent',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update RFQ quotation count and status
    await supabase
      .from('purchase_requests')
      .update({
        quotation_count: (rfq.quotation_count || 0) + 1,
        status: 'receiving_quotes',
      })
      .eq('id', id);

    return NextResponse.json({ quotation: data }, { status: 201 });
  } catch (error) {
    console.error('Quotation create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
