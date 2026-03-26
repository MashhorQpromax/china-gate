import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/products - List products with filtering, pagination, and search
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Filters
    const categoryId = searchParams.get('category_id');
    const supplierId = searchParams.get('supplier_id');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    const featured = searchParams.get('featured');
    const originCountry = searchParams.get('origin_country');
    const sampleAvailable = searchParams.get('sample_available');
    const leadTimeMax = searchParams.get('lead_time_max');
    const certification = searchParams.get('certification');

    let query = supabase
      .from('products')
      .select('*, categories!category_id(name_en, name_ar, slug)', { count: 'exact' });

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.or(`category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`);
    }

    if (supplierId) {
      // 'me' resolves to the current authenticated user
      const resolvedSupplierId = supplierId === 'me'
        ? request.headers.get('x-user-id')
        : supplierId;
      if (resolvedSupplierId) {
        query = query.eq('supplier_id', resolvedSupplierId);
      }
    }

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%,brand_name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (minPrice) {
      query = query.gte('base_price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('base_price', parseFloat(maxPrice));
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (originCountry) {
      query = query.eq('origin_country', originCountry);
    }

    if (sampleAvailable === 'true') {
      query = query.eq('sample_available', true);
    }

    if (leadTimeMax) {
      query = query.lte('lead_time_max', parseInt(leadTimeMax));
    }

    if (certification) {
      query = query.contains('certifications', [certification]);
    }

    // Sorting
    const ascending = sortOrder === 'asc';
    switch (sortBy) {
      case 'price':
        query = query.order('base_price', { ascending });
        break;
      case 'rating':
        query = query.order('avg_rating', { ascending: false });
        break;
      case 'popular':
        query = query.order('order_count', { ascending: false });
        break;
      case 'views':
        query = query.order('view_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch supplier verification data for all returned products
    let productsWithVerification = data || [];
    if (productsWithVerification.length > 0) {
      const supplierIds = [...new Set(productsWithVerification.map((p: Record<string, unknown>) => p.supplier_id))];
      const { data: verifications } = await supabase
        .from('supplier_verifications')
        .select('supplier_id, verification_level')
        .in('supplier_id', supplierIds);

      if (verifications && verifications.length > 0) {
        const verificationMap = new Map(
          verifications.map((v: { supplier_id: string; verification_level: string }) => [v.supplier_id, v.verification_level])
        );
        productsWithVerification = productsWithVerification.map((p: Record<string, unknown>) => ({
          ...p,
          supplier_verified: verificationMap.get(p.supplier_id as string) !== 'unverified' && verificationMap.has(p.supplier_id as string),
        }));
      }
    }

    return NextResponse.json({
      products: productsWithVerification,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      supplierId,
      nameEn,
      nameAr,
      nameZh,
      slug,
      categoryId,
      subcategoryId,
      shortDescriptionEn,
      shortDescriptionAr,
      fullDescriptionEn,
      fullDescriptionAr,
      basePrice,
      currency,
      priceType,
      moq,
      moqUnit,
      maxOrderQuantity,
      stockQuantity,
      stockStatus,
      unitOfMeasure,
      unitWeight,
      weightUnit,
      length: prodLength,
      width: prodWidth,
      height: prodHeight,
      dimensionUnit,
      packagingType,
      packagingDetail,
      leadTimeMin,
      leadTimeMax,
      leadTimeUnit,
      productionCapacity,
      productionCapacityUnit,
      sampleAvailable,
      samplePrice,
      customizationAvailable,
      customizationDetails,
      paymentTerms,
      incoterms,
      supplyAbility,
      portOfLoading,
      certifications,
      hsCode,
      originCountry,
      brandName,
      modelNumber,
      mainImageUrl,
      images,
      videoUrl,
      specifications,
      keywords,
      tags,
      pricingTiers,
      variants,
    } = body;

    // Resolve supplier ID: use body value or fall back to authenticated user
    const resolvedSupplierId = supplierId || request.headers.get('x-user-id');

    if (!resolvedSupplierId || !nameEn) {
      return NextResponse.json(
        { error: 'Missing required fields: nameEn (and authentication required)' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const productSlug = slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Generate SKU
    const sku = `CG-${Date.now().toString(36).toUpperCase()}`;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        supplier_id: resolvedSupplierId,
        sku,
        name_en: nameEn,
        name_ar: nameAr || null,
        name_zh: nameZh || null,
        slug: productSlug,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        short_description_en: shortDescriptionEn || null,
        short_description_ar: shortDescriptionAr || null,
        full_description_en: fullDescriptionEn || null,
        full_description_ar: fullDescriptionAr || null,
        base_price: basePrice || null,
        currency: currency || 'USD',
        price_type: priceType || 'negotiable',
        moq: moq || 1,
        moq_unit: moqUnit || 'pieces',
        max_order_quantity: maxOrderQuantity || null,
        stock_quantity: stockQuantity || 0,
        stock_status: stockStatus || 'in_stock',
        unit_of_measure: unitOfMeasure || 'piece',
        unit_weight: unitWeight || null,
        weight_unit: weightUnit || 'kg',
        length: prodLength || null,
        width: prodWidth || null,
        height: prodHeight || null,
        dimension_unit: dimensionUnit || 'cm',
        packaging_type: packagingType || null,
        packaging_detail: packagingDetail || null,
        lead_time_min: leadTimeMin || null,
        lead_time_max: leadTimeMax || null,
        lead_time_unit: leadTimeUnit || 'days',
        production_capacity: productionCapacity || null,
        production_capacity_unit: productionCapacityUnit || null,
        sample_available: sampleAvailable || false,
        sample_price: samplePrice || null,
        customization_available: customizationAvailable || false,
        customization_details: customizationDetails || null,
        payment_terms: paymentTerms || null,
        incoterms: incoterms || null,
        supply_ability: supplyAbility || null,
        port_of_loading: portOfLoading || null,
        certifications: certifications || null,
        hs_code: hsCode || null,
        origin_country: originCountry || 'China',
        brand_name: brandName || null,
        model_number: modelNumber || null,
        main_image_url: mainImageUrl || null,
        images: images || null,
        video_url: videoUrl || null,
        specifications: specifications || [],
        keywords: keywords || null,
        tags: tags || null,
        status: 'draft',
      })
      .select()
      .single();

    if (productError) {
      console.error('Product create error:', productError);
      return NextResponse.json({ error: productError.message }, { status: 400 });
    }

    // Insert pricing tiers if provided
    if (pricingTiers && pricingTiers.length > 0 && product) {
      const tiersData = pricingTiers.map((tier: { minQuantity: number; maxQuantity?: number; price: number }, index: number) => ({
        product_id: product.id,
        min_quantity: tier.minQuantity,
        max_quantity: tier.maxQuantity || null,
        price: tier.price,
        sort_order: index,
      }));

      await supabase.from('product_pricing_tiers').insert(tiersData);
    }

    // Insert variants if provided
    if (variants && variants.length > 0 && product) {
      const variantsData = variants.map((v: { name: string; value: string; skuSuffix?: string; priceAdjustment?: number; imageUrl?: string }, index: number) => ({
        product_id: product.id,
        variant_name: v.name,
        variant_value: v.value,
        sku_suffix: v.skuSuffix || null,
        price_adjustment: v.priceAdjustment || 0,
        image_url: v.imageUrl || null,
        sort_order: index,
      }));

      await supabase.from('product_variants').insert(variantsData);
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
