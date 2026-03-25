import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiPaginated,
  apiCreated,
  apiServerError,
  apiForbidden,
  apiBadRequest,
  getRequestUser,
  getPaginationParams,
  getSortParams,
} from '@/lib/api-response';
import { validateBody, createTicketSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const { page, limit, offset } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request);

    const status = request.nextUrl.searchParams.get('status');
    const priority = request.nextUrl.searchParams.get('priority');

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*', { count: 'exact' });

    // Role-based filtering
    if (!user.isAdmin) {
      query = query.eq('user_id', user.id);
    }

    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data, error, count } = await query
      .order(sortBy || 'created_at', { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return apiPaginated(data || [], {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('GET /api/tickets error:', error);
    return apiServerError('Failed to fetch tickets');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const body = await request.json();
    const validation = validateBody(body, createTicketSchema);
    if (!validation.isValid) {
      return apiBadRequest(validation.error);
    }

    // Generate reference number: TK-YYMMDD-NNNN
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const referenceNumber = `TK-${year}${month}${day}-${randomNum}`;

    const ticketData = {
      reference_number: referenceNumber,
      user_id: user.id,
      subject: validation.data.subject,
      description: validation.data.description,
      category: validation.data.category || 'general',
      priority: validation.data.priority || 'medium',
      status: 'open',
      related_entity_type: validation.data.related_entity_type || null,
      related_entity_id: validation.data.related_entity_id || null,
      metadata: validation.data.metadata || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert([ticketData])
      .select()
      .single();

    if (error) throw error;

    return apiCreated(data);
  } catch (error) {
    console.error('POST /api/tickets error:', error);
    return apiServerError('Failed to create ticket');
  }
}
