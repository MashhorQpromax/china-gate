import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/quotations - List quotations for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Get userId from query param or x-user-id header
    const userId = searchParams.get('user_id') || request.headers.get('x-user-id');

    // Get role from query param or x-user-role header
    const role = searchParams.get('role') || request.headers.get('x-user-role') || 'any';

    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
      .from('quotations')
      .select('*, purchase_requests!purchase_request_id(title, product_name), profiles!supplier_id(full_name_en, company_name), profiles!buyer_id(full_name_en, company_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      if (role === 'gulf_buyer') {
        query = query.eq('buyer_id', userId);
      } else if (role === 'chinese_supplier') {
        query = query.eq('supplier_id', userId);
      } else {
        query = query.or(`supplier_id.eq.${userId},buyer_id.eq.${userId}`);
      }
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`reference_number.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      meta: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('Quotations list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
