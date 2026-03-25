import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiNotFound,
  apiServerError,
  apiForbidden,
  getRequestUser,
} from '@/lib/api-response';

const VALID_STATUSES = [
  'pending',
  'booked',
  'packed',
  'in_warehouse',
  'shipped',
  'in_transit',
  'port_arrived',
  'customs_clearance',
  'out_for_delivery',
  'delivered',
  'returned',
  'damaged',
  'lost',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiForbidden('Unauthorized');
    }

    const { id } = await params;

    let query = supabaseAdmin
      .from('shipments')
      .select(
        `
        *,
        deals:deal_id (
          id,
          reference_number,
          supplier_id,
          buyer_id,
          product_details,
          quantity,
          unit_price,
          total_amount,
          currency,
          status
        )
      `
      )
      .eq('id', id)
      .single();

    const { data: shipment, error } = await query;

    if (error || !shipment) {
      return apiNotFound('Shipment not found');
    }

    // Check permissions: admin, supplier, or buyer can view
    if (
      !user.isAdmin &&
      shipment.supplier_id !== user.id &&
      shipment.buyer_id !== user.id
    ) {
      return apiForbidden('You do not have permission to view this shipment');
    }

    return apiSuccess(shipment);
  } catch (error) {
    console.error('Unexpected error in GET /api/shipments/[id]:', error);
    return apiServerError('An unexpected error occurred');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiForbidden('Unauthorized');
    }

    const { id } = await params;

    // Fetch the shipment first to check permissions and current state
    const { data: shipment, error: fetchError } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !shipment) {
      return apiNotFound('Shipment not found');
    }

    // Check permissions: only admin or the supplier of this shipment can update
    if (!user.isAdmin && shipment.supplier_id !== user.id) {
      return apiForbidden(
        'Only admins and the shipment supplier can update shipment status'
      );
    }

    const body = await request.json();
    const { status, tracking_number, tracking_url, notes } = body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return apiServerError(
        `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
        400
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number;
    }

    if (tracking_url !== undefined) {
      updateData.tracking_url = tracking_url;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (Object.keys(updateData).length === 0) {
      return apiServerError('No valid fields provided for update', 400);
    }

    // Update the shipment
    const { data: updatedShipment, error: updateError } = await supabaseAdmin
      .from('shipments')
      .update(updateData)
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Error updating shipment:', updateError);
      return apiServerError('Failed to update shipment');
    }

    return apiSuccess(updatedShipment[0]);
  } catch (error) {
    console.error('Unexpected error in PATCH /api/shipments/[id]:', error);
    return apiServerError('An unexpected error occurred');
  }
}
