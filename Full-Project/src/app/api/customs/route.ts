import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiPaginated,
  apiServerError,
  apiForbidden,
  getRequestUser,
  getSortParams,
  getPaginationParams,
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const { page, limit, offset } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request, ['created_at', 'status', 'declared_value', 'reference_number']);

    const searchUrl = new URL(request.url);
    const statusFilter = searchUrl.searchParams.get('status') || '';

    let query = supabaseAdmin
      .from('customs_clearances')
      .select('*', { count: 'exact' });

    // Role-based filtering
    if (!user.isAdmin) {
      query = query.or(`importer_id.eq.${user.id},customs_agent_id.eq.${user.id}`);
    }

    // Apply status filter
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error, count } = await query
      .order(sortBy || 'created_at', { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching customs clearances:', error);
      return apiServerError('Failed to fetch customs clearances');
    }

    return apiPaginated(data || [], {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('GET /api/customs error:', error);
    return apiServerError('Failed to fetch customs clearances');
  }
}
