import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiNotFound,
  apiForbidden,
  apiBadRequest,
  apiServerError,
  getRequestUser,
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(request);
    const { id } = await params;

    // Check admin access
    if (!user.isAuthenticated || !user.isAdmin) {
      return apiForbidden('Only admins can access this endpoint');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return apiNotFound('User not found');
    }

    // Get organization membership
    const { data: orgMembership, error: orgError } = await supabaseAdmin
      .from('organization_members')
      .select('*')
      .eq('user_id', id)
      .single();

    // Get deals count (as buyer and supplier)
    const { count: buyerDealsCount, error: buyerError } = await supabaseAdmin
      .from('deals')
      .select('id', { count: 'exact' })
      .eq('buyer_id', id);

    const { count: supplierDealsCount, error: supplierError } = await supabaseAdmin
      .from('deals')
      .select('id', { count: 'exact' })
      .eq('supplier_id', id);

    const totalDealsCount = (buyerDealsCount || 0) + (supplierDealsCount || 0);

    // Get recent activity (last 10 deals)
    const { data: recentActivity, error: activityError } = await supabaseAdmin
      .from('deals')
      .select('id, title, stage, created_at, updated_at')
      .or(`buyer_id.eq.${id},supplier_id.eq.${id}`)
      .order('updated_at', { ascending: false })
      .limit(10);

    return apiSuccess(
      {
        profile,
        organization: orgMembership || null,
        deals_count: totalDealsCount,
        recent_activity: recentActivity || [],
      },
      'User details retrieved successfully'
    );
  } catch (error) {
    console.error('Admin user detail route error:', error);
    return apiServerError('Internal server error');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(request);
    const { id } = await params;

    // Check admin access
    if (!user.isAuthenticated || !user.isAdmin) {
      return apiForbidden('Only admins can update users');
    }

    // Get request body
    const body = await request.json();
    const { account_type, is_suspended, suspension_reason } = body;

    // Validate that at least one field is being updated
    if (
      account_type === undefined &&
      is_suspended === undefined &&
      suspension_reason === undefined
    ) {
      return apiBadRequest('No valid fields to update');
    }

    // Build update object
    const updateData: any = {};

    if (account_type !== undefined) {
      const validTypes = ['gulf_buyer', 'chinese_supplier', 'gulf_manufacturer'];
      if (!validTypes.includes(account_type)) {
        return apiBadRequest('Invalid account_type');
      }
      updateData.account_type = account_type;
    }

    if (is_suspended !== undefined) {
      if (typeof is_suspended !== 'boolean') {
        return apiBadRequest('is_suspended must be a boolean');
      }
      updateData.is_suspended = is_suspended;
    }

    if (suspension_reason !== undefined) {
      updateData.suspension_reason = suspension_reason;
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return apiServerError('Failed to update user');
    }

    if (!updatedUser) {
      return apiNotFound('User not found');
    }

    return apiSuccess(updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Admin user update route error:', error);
    return apiServerError('Internal server error');
  }
}
