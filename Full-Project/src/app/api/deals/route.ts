import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/deals - List deals for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Get userId from query param or header (header has priority from middleware)
    const userId = searchParams.get('user_id') || request.headers.get('x-user-id');
    // Get userRole from header
    const userRole = request.headers.get('x-user-role') || 'any';
    const stage = searchParams.get('stage');

    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // If userId is available, filter by role
    if (userId) {
      if (userRole === 'gulf_buyer') {
        query = query.eq('buyer_id', userId);
      } else if (userRole === 'chinese_supplier') {
        query = query.eq('supplier_id', userId);
      } else if (userRole !== 'admin') {
        query = query.or(`buyer_id.eq.${userId},supplier_id.eq.${userId}`);
      }
      // Admins see all deals (no filter)
    }
    // If no userId, return all deals (admin view)

    if (stage) {
      query = query.eq('stage', stage);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Fetch profiles for all buyer/supplier IDs
    const allUserIds = [
      ...new Set((data || []).flatMap((d: any) => [d.buyer_id, d.supplier_id].filter(Boolean))),
    ];

    const profileMap: Record<string, { full_name_en: string; company_name: string }> = {};
    if (allUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name_en, company_name')
        .in('id', allUserIds);
      if (profiles) {
        for (const p of profiles) {
          profileMap[p.id] = p;
        }
      }
    }

    // Attach buyer_name / supplier_name
    const flattenedData = (data || []).map((deal: any) => ({
      ...deal,
      buyer_name: profileMap[deal.buyer_id]?.full_name_en || profileMap[deal.buyer_id]?.company_name || 'Unknown',
      supplier_name: profileMap[deal.supplier_id]?.full_name_en || profileMap[deal.supplier_id]?.company_name || 'Unknown',
    }));

    return NextResponse.json({
      success: true,
      data: flattenedData,
      meta: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('Deals list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/deals - Create a new deal (usually from accepted quotation)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      quotationId, buyerId, supplierId, productId, productName, productSku,
      quantity, unitPrice, totalValue, currency, incoterm, paymentTerms,
      shippingPort, destinationPort, shippingMethod, expectedDeliveryDate,
    } = body;

    if (!buyerId || !supplierId || !productName || !quantity || !unitPrice || !totalValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('deals')
      .insert({
        reference_number: '', // Auto-generated
        quotation_id: quotationId || null,
        buyer_id: buyerId,
        supplier_id: supplierId,
        product_id: productId || null,
        product_name: productName,
        product_sku: productSku || null,
        quantity,
        unit_price: unitPrice,
        total_value: totalValue,
        currency: currency || 'USD',
        incoterm: incoterm || null,
        payment_terms: paymentTerms || null,
        shipping_port: shippingPort || null,
        destination_port: destinationPort || null,
        shipping_method: shippingMethod || null,
        expected_delivery_date: expectedDeliveryDate || null,
        stage: 'negotiation',
        stage_history: [{ stage: 'negotiation', timestamp: new Date().toISOString(), note: 'Deal created' }],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log timeline
    if (data) {
      await supabase.from('deal_timeline').insert({
        deal_id: data.id,
        user_id: buyerId,
        action: 'deal_created',
        description: 'Deal was created',
        new_value: 'negotiation',
      });
    }

    return NextResponse.json({ deal: data }, { status: 201 });
  } catch (error) {
    console.error('Deal create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
