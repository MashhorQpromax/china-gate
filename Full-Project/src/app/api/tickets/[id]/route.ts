import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiNotFound,
  apiServerError,
  apiForbidden,
  apiBadRequest,
  getRequestUser,
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getRequestUser(request);
    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return apiNotFound('Ticket not found');
    }

    // Check authorization
    if (!user.isAdmin && data.user_id !== user.id) {
      return apiForbidden('You do not have access to this ticket');
    }

    return apiSuccess(data);
  } catch (error) {
    console.error('GET /api/tickets/[id] error:', error);
    return apiServerError('Failed to fetch ticket');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getRequestUser(request);
    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const body = await request.json();

    // Get existing ticket
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !ticket) {
      return apiNotFound('Ticket not found');
    }

    // Check authorization
    if (!user.isAdmin && ticket.user_id !== user.id) {
      return apiForbidden('You do not have access to this ticket');
    }

    // Prepare update data based on role
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (user.isAdmin) {
      // Admin can update status, assigned_to, priority, resolution, internal_notes
      if (body.status !== undefined) updateData.status = body.status;
      if (body.assigned_to !== undefined) updateData.assigned_to = body.assigned_to;
      if (body.priority !== undefined) updateData.priority = body.priority;
      if (body.resolution !== undefined) updateData.resolution = body.resolution;
      if (body.internal_notes !== undefined) updateData.internal_notes = body.internal_notes;
    } else {
      // User can only update description if status is 'open'
      if (ticket.status !== 'open') {
        return apiBadRequest('Can only update description when ticket is open');
      }
      if (body.description !== undefined) updateData.description = body.description;
    }

    if (Object.keys(updateData).length === 1) {
      return apiBadRequest('No valid fields to update');
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    console.error('PATCH /api/tickets/[id] error:', error);
    return apiServerError('Failed to update ticket');
  }
}
