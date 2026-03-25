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
      .from('letters_of_guarantee')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return apiNotFound('Letter of guarantee not found');
    }

    // Check authorization
    if (!user.isAdmin) {
      const isAuthorized =
        data.requester_id === user.id || data.beneficiary_id === user.id;

      if (!isAuthorized) {
        return apiForbidden('You do not have access to this letter of guarantee');
      }
    }

    return apiSuccess(data);
  } catch (error) {
    console.error('GET /api/lg/[id] error:', error);
    return apiServerError('Failed to fetch letter of guarantee');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getRequestUser(request);
    if (!user.isAdmin) {
      return apiForbidden('Only admins can update letters of guarantee');
    }

    const body = await request.json();

    // Get existing LG
    const { data: lg, error: fetchError } = await supabaseAdmin
      .from('letters_of_guarantee')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !lg) {
      return apiNotFound('Letter of guarantee not found');
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Admin can update status
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (Object.keys(updateData).length === 1) {
      return apiBadRequest('No valid fields to update');
    }

    const { data, error } = await supabaseAdmin
      .from('letters_of_guarantee')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    console.error('PATCH /api/lg/[id] error:', error);
    return apiServerError('Failed to update letter of guarantee');
  }
}
