import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/suppliers/[id] - Get supplier profile with their products
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const supplierId = params.id;
    const { searchParams } = new URL(request.url);

    // Product pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    const categoryId = searchParams.get('category_id');
    const sortBy = searchParams.get('sort_by') || 'created_at';

    // Fetch supplier profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name_en, full_name_ar, company_name, country, city, phone, avatar_url, account_type, created_at')
      .eq('id', supplierId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Fetch verification info
    const { data: verification } = await supabase
      .from('supplier_verifications')
      .select('verification_level, is_verified, verified_at, business_license_verified, quality_cert_verified')
      .eq('supplier_id', supplierId)
      .single();

    // Fetch supplier products with count
    let productsQuery = supabase
      .from('products')
      .select('id, name_en, name_ar, slug, price, currency, moq, unit, lead_time_days, origin_country, sample_available, main_image_url, rating_avg, rating_count, view_count, order_count, status, created_at, category_id', { count: 'exact' })
      .eq('supplier_id', supplierId)
      .eq('status', 'active');

    if (search) {
      productsQuery = productsQuery.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`);
    }
    if (categoryId) {
      productsQuery = productsQuery.eq('category_id', categoryId);
    }

    // Sort
    if (sortBy === 'price_asc') {
      productsQuery = productsQuery.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      productsQuery = productsQuery.order('price', { ascending: false });
    } else if (sortBy === 'rating') {
      productsQuery = productsQuery.order('rating_avg', { ascending: false });
    } else if (sortBy === 'popular') {
      productsQuery = productsQuery.order('order_count', { ascending: false });
    } else {
      productsQuery = productsQuery.order('created_at', { ascending: false });
    }

    productsQuery = productsQuery.range(offset, offset + limit - 1);

    const { data: products, error: productsError, count: productsCount } = await productsQuery;

    // Fetch categories for this supplier's products
    const { data: categories } = await supabase
      .from('products')
      .select('category_id')
      .eq('supplier_id', supplierId)
      .eq('status', 'active');

    const uniqueCategoryIds = [...new Set((categories || []).map((p: any) => p.category_id).filter(Boolean))];
    let supplierCategories: any[] = [];
    if (uniqueCategoryIds.length > 0) {
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name_en, name_ar, slug')
        .in('id', uniqueCategoryIds);
      supplierCategories = cats || [];
    }

    // Fetch supplier stats
    const { count: totalProducts } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('supplier_id', supplierId)
      .eq('status', 'active');

    const { count: totalDeals } = await supabase
      .from('deals')
      .select('id', { count: 'exact', head: true })
      .eq('supplier_id', supplierId)
      .eq('stage', 'completed');

    // Average rating across all products
    const { data: ratingData } = await supabase
      .from('products')
      .select('rating_avg, rating_count')
      .eq('supplier_id', supplierId)
      .eq('status', 'active')
      .gt('rating_count', 0);

    let avgRating = 0;
    let totalReviews = 0;
    if (ratingData && ratingData.length > 0) {
      const totalWeighted = ratingData.reduce((sum: number, p: any) => sum + (p.rating_avg * p.rating_count), 0);
      totalReviews = ratingData.reduce((sum: number, p: any) => sum + p.rating_count, 0);
      avgRating = totalReviews > 0 ? totalWeighted / totalReviews : 0;
    }

    return NextResponse.json({
      success: true,
      supplier: {
        ...profile,
        verification: verification || null,
        stats: {
          totalProducts: totalProducts || 0,
          completedDeals: totalDeals || 0,
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews,
        },
      },
      products: products || [],
      categories: supplierCategories,
      pagination: {
        page,
        limit,
        total: productsCount || 0,
        totalPages: Math.ceil((productsCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Supplier profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
