import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/products/[id] - Get single product with all details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    // Fetch product
    const { data: product, error } = await supabase
      .from('products')
      .select('*, categories!category_id(id, name_en, name_ar, slug)')
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch related data in parallel
    const [pricingTiers, variants, images, reviews] = await Promise.all([
      supabase
        .from('product_pricing_tiers')
        .select('*')
        .eq('product_id', id)
        .order('sort_order'),
      supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('sort_order'),
      supabase
        .from('product_reviews')
        .select('*, profiles!reviewer_id(full_name_en, full_name_ar, avatar_url)')
        .eq('product_id', id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Fetch supplier info
    const { data: supplier } = await supabase
      .from('profiles')
      .select('id, full_name_en, full_name_ar, company_name, avatar_url, country, city')
      .eq('id', product.supplier_id)
      .single();

    // Fetch supplier verification
    const { data: verification } = await supabase
      .from('supplier_verifications')
      .select('verification_level, avg_rating, success_rate, total_deals, response_rate')
      .eq('supplier_id', product.supplier_id)
      .single();

    // Increment view count
    await supabase
      .from('products')
      .update({ view_count: (product.view_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({
      product: {
        ...product,
        pricing_tiers: pricingTiers.data || [],
        variants: variants.data || [],
        images: images.data || [],
        reviews: reviews.data || [],
        supplier: supplier || null,
        verification: verification
          ? { ...verification, is_verified: verification.verification_level !== 'unverified' }
          : null,
      },
    });
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/products/[id] - Update a product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
    const body = await request.json();

    // Convert camelCase to snake_case for database
    const updateData: Record<string, unknown> = {};
    const fieldMap: Record<string, string> = {
      nameEn: 'name_en',
      nameAr: 'name_ar',
      nameZh: 'name_zh',
      shortDescriptionEn: 'short_description_en',
      shortDescriptionAr: 'short_description_ar',
      fullDescriptionEn: 'full_description_en',
      fullDescriptionAr: 'full_description_ar',
      basePrice: 'base_price',
      priceType: 'price_type',
      moq: 'moq',
      moqUnit: 'moq_unit',
      stockQuantity: 'stock_quantity',
      stockStatus: 'stock_status',
      mainImageUrl: 'main_image_url',
      status: 'status',
      featured: 'featured',
      categoryId: 'category_id',
      subcategoryId: 'subcategory_id',
      leadTimeMin: 'lead_time_min',
      leadTimeMax: 'lead_time_max',
      sampleAvailable: 'sample_available',
      samplePrice: 'sample_price',
      customizationAvailable: 'customization_available',
      customizationDetails: 'customization_details',
      brandName: 'brand_name',
      modelNumber: 'model_number',
      originCountry: 'origin_country',
      hsCode: 'hs_code',
      portOfLoading: 'port_of_loading',
    };

    for (const [key, value] of Object.entries(body)) {
      const dbField = fieldMap[key] || key;
      if (value !== undefined) {
        updateData[dbField] = value;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Product update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product (soft delete by archiving)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { data, error } = await supabase
      .from('products')
      .update({ status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Product archived', product: data });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
