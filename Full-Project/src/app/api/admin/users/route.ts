import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiPaginated,
  apiForbidden,
  apiBadRequest,
  apiServerError,
  getRequestUser,
  getPaginationParams,
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    // Check admin access
    if (!user.isAuthenticated || !user.isAdmin) {
      return apiForbidden('Only admins can access this endpoint');
    }

    // Get pagination params
    const { page, limit } = getPaginationParams(request);
    const offset = (page - 1) * limit;

    // Get query parameters
    const searchUrl = new URL(request.url);
    const search = searchUrl.searchParams.get('search') || '';
    const accountType = searchUrl.searchParams.get('account_type') || '';
    const isSuspended = searchUrl.searchParams.get('is_suspended');

    // Build query
    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`full_name_en.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply account_type filter
    if (accountType) {
      query = query.eq('account_type', accountType);
    }

    // Apply is_suspended filter
    if (isSuspended !== null && isSuspended !== undefined && isSuspended !== '') {
      const suspended = isSuspended === 'true';
      query = query.eq('is_suspended', suspended);
    }

    // Sort by created_at descending
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error: usersError, count } = await query;

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return apiServerError('Failed to fetch users');
    }

    // If account_type is chinese_supplier, join with supplier_verifications
    let enrichedUsers = users || [];

    if (accountType === 'chinese_supplier' && enrichedUsers.length > 0) {
      const userIds = enrichedUsers.map((u) => u.id);
      const { data: verifications, error: verError } = await supabaseAdmin
        .from('supplier_verifications')
        .select('*')
        .in('user_id', userIds);

      if (!verError && verifications) {
        const verMap = new Map(verifications.map((v) => [v.user_id, v]));
        enrichedUsers = enrichedUsers.map((u) => ({
          ...u,
          verification: verMap.get(u.id) || null,
        }));
      }
    }

    return apiPaginated(enrichedUsers, { page, limit, total: count || 0 });
  } catch (error) {
    console.error('Admin users route error:', error);
    return apiServerError('Internal server error');
  }
}
