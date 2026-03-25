import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/categories - List all categories (hierarchical)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const parentId = searchParams.get('parent_id');
    const level = searchParams.get('level');
    const activeOnly = searchParams.get('active') !== 'false';

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name_en', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else if (parentId === null && !level) {
      // Get root categories by default
      query = query.is('parent_id', null);
    }

    if (level) {
      query = query.eq('level', parseInt(level));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      nameEn,
      nameAr,
      nameZh,
      slug,
      descriptionEn,
      descriptionAr,
      parentId,
      iconUrl,
      imageUrl,
      level,
      sortOrder,
      hsCodePrefix,
    } = body;

    if (!nameEn || !nameAr || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: nameEn, nameAr, slug' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name_en: nameEn,
        name_ar: nameAr,
        name_zh: nameZh || null,
        slug,
        description_en: descriptionEn || null,
        description_ar: descriptionAr || null,
        parent_id: parentId || null,
        icon_url: iconUrl || null,
        image_url: imageUrl || null,
        level: level || 0,
        sort_order: sortOrder || 0,
        hs_code_prefix: hsCodePrefix || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Category create error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
