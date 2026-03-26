import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiPaginated, apiServerError, apiForbidden, getRequestUser, getSortParams } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    if (!user) {
      return apiForbidden('Unauthorized');
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');

    let query = supabaseAdmin
      .from('disputes')
      .select('*', { count: 'exact' });

    if (user.role !== 'admin') {
      query = query.or(`filed_by.eq.${user.id},filed_against.eq.${user.id}`);
    }

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }

    const { data: disputes, error: disputesError, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (disputesError) {
      return apiServerError('Failed to fetch disputes');
    }

    const userIds = new Set<string>();
    const dealIds = new Set<string>();

    disputes?.forEach((dispute) => {
      if (dispute.filed_by) userIds.add(dispute.filed_by);
      if (dispute.filed_against) userIds.add(dispute.filed_against);
      if (dispute.deal_id) dealIds.add(dispute.deal_id);
    });

    const profiles: Record<string, any> = {};
    if (userIds.size > 0) {
      const { data: profilesData } = await supabaseAdmin
        .from('profiles')
        .select('id, username, email')
        .in('id', Array.from(userIds));

      profilesData?.forEach((profile) => {
        profiles[profile.id] = profile;
      });
    }

    const deals: Record<string, any> = {};
    if (dealIds.size > 0) {
      const { data: dealsData } = await supabaseAdmin
        .from('deals')
        .select('id, reference_number')
        .in('id', Array.from(dealIds));

      dealsData?.forEach((deal) => {
        deals[deal.id] = deal;
      });
    }

    const enrichedDisputes = disputes?.map((dispute) => ({
      ...dispute,
      filed_by_user: profiles[dispute.filed_by] || null,
      filed_against_user: profiles[dispute.filed_against] || null,
      deal_reference: deals[dispute.deal_id]?.reference_number || null,
    })) || [];

    return apiPaginated(enrichedDisputes, {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    return apiServerError('An unexpected error occurred');
  }
}
