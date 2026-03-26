import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/suppliers - List suppliers (featured/verified first)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const verified = searchParams.get('verified');

    // Fetch supplier profiles
    let query = supabase
      .from('profiles')
      .select('id, full_name_en, full_name_ar, company_name, country, city, avatar_url, created_at')
      .eq('account_type', 'chinese_supplier')
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data: suppliers, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!suppliers || suppliers.length === 0) {
      return NextResponse.json({ success: true, suppliers: [] });
    }

    const supplierIds = suppliers.map((s: any) => s.id);

    // Fetch verification status for all suppliers
    const { data: verifications } = await supabase
      .from('supplier_verifications')
      .select('supplier_id, verification_level, is_verified')
      .in('supplier_id', supplierIds);

    const verMap: Record<string, any> = {};
    (verifications || []).forEach((v: any) => { verMap[v.supplier_id] = v; });

    // Fetch product counts per supplier
    const { data: productCounts } = await supabase
      .from('products')
      .select('supplier_id')
      .in('supplier_id', supplierIds)
      .eq('status', 'active');

    const countMap: Record<string, number> = {};
    (productCounts || []).forEach((p: any) => {
      countMap[p.supplier_id] = (countMap[p.supplier_id] || 0) + 1;
    });

    // Build response, prioritize verified suppliers with more products
    let result = suppliers.map((s: any) => ({
      ...s,
      verification: verMap[s.id] || null,
      productCount: countMap[s.id] || 0,
    }));

    // Sort: verified first, then by product count
    result.sort((a: any, b: any) => {
      const aVerified = a.verification?.is_verified ? 1 : 0;
      const bVerified = b.verification?.is_verified ? 1 : 0;
      if (bVerified !== aVerified) return bVerified - aVerified;
      return b.productCount - a.productCount;
    });

    // Filter verified only if requested
    if (verified === 'true') {
      result = result.filter((s: any) => s.verification?.is_verified);
    }

    return NextResponse.json({ success: true, suppliers: result.slice(0, limit) });
  } catch (error) {
    console.error('Suppliers list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
