import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiPaginated,
  apiCreated,
  apiServerError,
  apiForbidden,
  getRequestUser,
  getPaginationParams,
  getSortParams,
} from '@/lib/api-response';
import { validateBody, createShipmentSchema } from '@/lib/validations';

const ALLOWED_SORT_FIELDS = ['created_at', 'estimated_arrival', 'status', 'total_shipping_cost'];

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiForbidden('Unauthorized');
    }

    const { page, limit, offset } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request, ALLOWED_SORT_FIELDS, 'created_at');

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
      `,
        { count: 'exact' }
      );

    // Filter based on user role
    if (!user.isAdmin) {
      if (user.isSupplier) {
        query = query.eq('supplier_id', user.id);
      } else if (user.isBuyer) {
        query = query.eq('buyer_id', user.id);
      } else {
        return apiForbidden('Insufficient permissions');
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: shipments, error, count } = await query;

    if (error) {
      console.error('Error fetching shipments:', error);
      return apiServerError('Failed to fetch shipments');
    }

    return apiPaginated(shipments, {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/shipments:', error);
    return apiServerError('An unexpected error occurred');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiForbidden('Unauthorized');
    }

    if (!user.isAdmin && !user.isSupplier) {
      return apiForbidden('Only admins and suppliers can create shipments');
    }

    const body = await request.json();

    // Validate request body
    const validation = validateBody(body, createShipmentSchema);
    if (!validation.isValid) {
      return apiServerError(validation.errors.join(', '), 400);
    }

    const {
      reference_number,
      deal_id,
      supplier_id,
      buyer_id,
      shipping_type,
      carrier_name,
      carrier_contact,
      tracking_number,
      tracking_url,
      origin_port,
      destination_port,
      transit_ports,
      booking_date,
      departure_date,
      estimated_arrival,
      container_type,
      container_number,
      bl_number,
      packages_count,
      total_weight,
      total_volume,
      weight_unit,
      volume_unit,
      insured,
      insurance_value,
      insurance_provider,
      insurance_policy_number,
      freight_cost,
      insurance_cost,
      other_costs,
      total_shipping_cost,
      currency,
      status = 'pending',
      documents,
      notes,
    } = body;

    // Non-admin suppliers can only create shipments for themselves
    if (!user.isAdmin && supplier_id !== user.id) {
      return apiForbidden('Suppliers can only create shipments for themselves');
    }

    // Insert shipment
    const { data: shipment, error } = await supabaseAdmin
      .from('shipments')
      .insert([
        {
          reference_number,
          deal_id,
          supplier_id,
          buyer_id,
          shipping_type,
          carrier_name,
          carrier_contact,
          tracking_number,
          tracking_url,
          origin_port,
          destination_port,
          transit_ports,
          booking_date,
          departure_date,
          estimated_arrival,
          container_type,
          container_number,
          bl_number,
          packages_count,
          total_weight,
          total_volume,
          weight_unit,
          volume_unit,
          insured,
          insurance_value,
          insurance_provider,
          insurance_policy_number,
          freight_cost,
          insurance_cost,
          other_costs,
          total_shipping_cost,
          currency,
          status,
          documents,
          notes,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating shipment:', error);
      return apiServerError('Failed to create shipment');
    }

    return apiCreated(shipment[0]);
  } catch (error) {
    console.error('Unexpected error in POST /api/shipments:', error);
    return apiServerError('An unexpected error occurred');
  }
}
