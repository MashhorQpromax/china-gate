import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/rfq/[id] - Get RFQ details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { data: rfq, error } = await supabase
      .from('purchase_requests')
      .select('*, categories!category_id(name_en, name_ar, slug), profiles!buyer_id(full_name_en, full_name_ar, company_name, country, city, avatar_url, phone, email)')
      .eq('id', id)
      .single();

    if (error || !rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    // Fetch quotations for this RFQ
    const { data: quotations } = await supabase
      .from('quotations')
      .select('*, profiles!supplier_id(full_name_en, company_name, country, city)')
      .eq('purchase_request_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      rfq: {
        ...rfq,
        quotations: quotations || [],
      },
    });
  } catch (error) {
    console.error('RFQ detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/rfq/[id] - Update RFQ status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('purchase_requests')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ rfq: data });
  } catch (error) {
    console.error('RFQ update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
