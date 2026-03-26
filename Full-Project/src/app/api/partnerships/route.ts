import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiPaginated, apiServerError, apiForbidden, getRequestUser, getSortParams } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    const typeFilter = searchParams.get('type');
    const statusFilter = searchParams.get('status');

    if (!user.isAuthenticated && !user.isAdmin) {
      return apiForbidden('Authentication required');
    }

    let query = supabaseAdmin
      .from('partnerships')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!user.isAdmin) {
      query = query.or(`initiator_id.eq.${user.id},partner_id.eq.${user.id}`);
    }

    if (typeFilter) {
      const types = searchParams.getAll('type');
      if (types.length > 0) {
        query = query.in('partnership_type', types);
      }
    }

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Partnerships fetch error:', error);
      return apiServerError('Failed to fetch partnerships', 500);
    }

    const allUserIds = [
      ...new Set((data || []).flatMap((p: any) => [p.initiator_id, p.partner_id].filter(Boolean))),
    ];

    const profileMap: Record<string, { full_name_en: string; company_name: string }> = {};
    if (allUserIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name_en, company_name')
        .in('id', allUserIds);

      if (profiles) {
        for (const p of profiles) {
          profileMap[p.id] = p;
        }
      }
    }

    const enrichedData = (data || []).map((partnership: any) => ({
      ...partnership,
      initiator_name: profileMap[partnership.initiator_id]?.full_name_en || profileMap[partnership.initiator_id]?.company_name || 'Unknown',
      partner_name: profileMap[partnership.partner_id]?.full_name_en || profileMap[partnership.partner_id]?.company_name || 'Unknown',
    }));

    return apiPaginated(enrichedData, { page, limit, total: count || 0 });
  } catch (error) {
    console.error('Partnerships API error:', error);
    return apiServerError('Internal server error', 500);
  }
}
