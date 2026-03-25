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
      .from('letters_of_credit')
      .select(
        `
        *,
        deals (
          id,
          reference_number,
          buyer_id,
          supplier_id,
          product,
          quantity,
          unit_price,
          total_value,
          currency,
          status
        )
        `
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      return apiNotFound('Letter of credit not found');
    }

    // Check authorization
    if (!user.isAdmin) {
      const isAuthorized =
        (user.isBuyer && data.buyer_id === user.id) ||
        (user.isSupplier && data.supplier_id === user.id);

      if (!isAuthorized) {
        return apiForbidden('You do not have access to this letter of credit');
      }
    }

    return apiSuccess(data);
  } catch (error) {
    console.error('GET /api/lc/[id] error:', error);
    return apiServerError('Failed to fetch letter of credit');
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
      return apiForbidden('Only admins can update letters of credit');
    }

    const body = await request.json();

    // Get existing LC
    const { data: lc, error: fetchError } = await supabaseAdmin
      .from('letters_of_credit')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !lc) {
      return apiNotFound('Letter of credit not found');
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
      .from('letters_of_credit')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        deals (
          id,
          reference_number,
          buyer_id,
          supplier_id,
          product,
          quantity,
          unit_price,
          total_value,
          currency,
          status
        )
        `
      )
      .single();

    if (error) throw error;

    return apiSuccess(data);
  } catch (error) {
    console.error('PATCH /api/lc/[id] error:', error);
    return apiServerError('Failed to update letter of credit');
  }
}
