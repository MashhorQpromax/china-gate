import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/deals/[id] - Get deal details with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { data: deal, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Fetch related data in parallel
    const [timeline, shipments, lcs, inspections, buyer, supplier] = await Promise.all([
      supabase.from('deal_timeline').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
      supabase.from('shipments').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
      supabase.from('letters_of_credit').select('*').eq('deal_id', id),
      supabase.from('quality_inspections').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('full_name_en, full_name_ar, company_name, avatar_url, country, city, phone, email').eq('id', deal.buyer_id).single(),
      supabase.from('profiles').select('full_name_en, full_name_ar, company_name, avatar_url, country, city, phone, email').eq('id', deal.supplier_id).single(),
    ]);

    return NextResponse.json({
      deal: {
        ...deal,
        timeline: timeline.data || [],
        shipments: shipments.data || [],
        letters_of_credit: lcs.data || [],
        quality_inspections: inspections.data || [],
        buyer: buyer.data,
        supplier: supplier.data,
      },
    });
  } catch (error) {
    console.error('Deal detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/deals/[id] - Update deal (stage change, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
    const body = await request.json();

    const { stage, userId, note, ...otherUpdates } = body;

    // Get current deal
    const { data: currentDeal } = await supabase
      .from('deals')
      .select('stage, stage_history')
      .eq('id', id)
      .single();

    if (!currentDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...otherUpdates };

    // Handle stage change
    if (stage && stage !== currentDeal.stage) {
      const stageHistory = Array.isArray(currentDeal.stage_history) ? currentDeal.stage_history : [];
      stageHistory.push({
        from: currentDeal.stage,
        to: stage,
        timestamp: new Date().toISOString(),
        note: note || null,
      });

      updateData.stage = stage;
      updateData.stage_history = stageHistory;

      // Log timeline entry
      await supabase.from('deal_timeline').insert({
        deal_id: id,
        user_id: userId || null,
        action: 'stage_changed',
        description: note || `Stage changed from ${currentDeal.stage} to ${stage}`,
        old_value: currentDeal.stage,
        new_value: stage,
      });
    }

    const { data, error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deal: data });
  } catch (error) {
    console.error('Deal update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
