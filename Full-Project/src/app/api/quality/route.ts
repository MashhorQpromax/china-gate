import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiPaginated, apiServerError, apiForbidden, getRequestUser, getSortParams } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    if (!user) {
      return apiForbidden('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const resultFilter = searchParams.get('result');
    const stageFilter = searchParams.get('stage');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('quality_inspections')
      .select('*', { count: 'exact' });

    if (resultFilter && resultFilter !== 'all') {
      query = query.eq('result', resultFilter);
    }

    if (stageFilter && stageFilter !== 'all') {
      query = query.eq('stage', stageFilter);
    }

    if (user.role !== 'admin') {
      const { data: deals, error: dealsError } = await supabaseAdmin
        .from('deals')
        .select('id')
        .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`);

      if (dealsError) {
        return apiServerError('Failed to fetch user deals');
      }

      const dealIds = deals?.map((d) => d.id) || [];

      if (dealIds.length === 0) {
        return apiPaginated([], { page, limit, total: 0 });
      }

      query = query.in('deal_id', dealIds);
    }

    const { data: inspections, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return apiServerError('Failed to fetch quality inspections');
    }

    const total = count || 0;

    const dealIds = [...new Set(inspections?.map((i) => i.deal_id) || [])];

    let deals: Record<string, any> = {};
    if (dealIds.length > 0) {
      const { data: dealsData, error: dealsError } = await supabaseAdmin
        .from('deals')
        .select('id, reference_number, product_name, buyer_id, supplier_id')
        .in('id', dealIds);

      if (dealsData) {
        deals = Object.fromEntries(dealsData.map((d) => [d.id, d]));
      }
    }

    const profileIds = new Set<string>();
    Object.values(deals).forEach((deal: any) => {
      profileIds.add(deal.buyer_id);
      profileIds.add(deal.supplier_id);
    });

    let profiles: Record<string, any> = {};
    if (profileIds.size > 0) {
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(profileIds));

      if (profilesData) {
        profiles = Object.fromEntries(profilesData.map((p) => [p.id, p]));
      }
    }

    const enrichedInspections = inspections?.map((inspection) => {
      const deal = deals[inspection.deal_id];
      const buyerProfile = deal ? profiles[deal.buyer_id] : null;
      const supplierProfile = deal ? profiles[deal.supplier_id] : null;

      return {
        ...inspection,
        deal: deal
          ? {
              id: deal.id,
              reference_number: deal.reference_number,
              product_name: deal.product_name,
              buyer_name: buyerProfile?.full_name || 'Unknown',
              supplier_name: supplierProfile?.full_name || 'Unknown',
            }
          : null,
      };
    }) || [];

    return NextResponse.json(
      apiPaginated(enrichedInspections, { page, limit, total })
    );
  } catch (error) {
    return apiServerError('Internal server error');
  }
}
