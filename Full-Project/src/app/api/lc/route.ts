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
import { validateBody } from '@/lib/validations';

const createLCSchema = {
  deal_id: { type: 'string', required: true },
  buyer_id: { type: 'string', required: true },
  supplier_id: { type: 'string', required: true },
  issuing_bank: { type: 'string', required: true },
  advising_bank: { type: 'string', required: false },
  lc_type: { type: 'string', required: true },
  amount: { type: 'number', required: true },
  currency: { type: 'string', required: true },
  issue_date: { type: 'string', required: true },
  expiry_date: { type: 'string', required: true },
  latest_shipment_date: { type: 'string', required: true },
  description: { type: 'string', required: false },
  partial_shipment_allowed: { type: 'boolean', required: false },
  transshipment_allowed: { type: 'boolean', required: false },
};

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user.isAuthenticated) {
      return apiForbidden('Authentication required');
    }

    const { page, limit, offset } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request);

    let query = supabaseAdmin
      .from('letters_of_credit')
      .select('*', { count: 'exact' });

    // Role-based filtering
    if (!user.isAdmin) {
      if (user.isBuyer) {
        query = query.eq('buyer_id', user.id);
      } else if (user.isSupplier) {
        query = query.eq('supplier_id', user.id);
      } else {
        return apiForbidden('Insufficient permissions to view letters of credit');
      }
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
    console.error('GET /api/lc error:', error);
    return apiServerError('Failed to fetch letters of credit');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user.isAdmin) {
      return apiForbidden('Only admins can create letters of credit');
    }

    const body = await request.json();
    const validation = validateBody(body, createLCSchema);
    if (!validation.isValid) {
      return apiBadRequest(validation.error);
    }

    // Generate reference number: LC-YYMMDD-NNNN
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const referenceNumber = `LC-${year}${month}${day}-${randomNum}`;

    const lcData = {
      reference_number: referenceNumber,
      deal_id: validation.data.deal_id,
      buyer_id: validation.data.buyer_id,
      supplier_id: validation.data.supplier_id,
      issuing_bank: validation.data.issuing_bank,
      advising_bank: validation.data.advising_bank || null,
      lc_type: validation.data.lc_type,
      amount: validation.data.amount,
      currency: validation.data.currency,
      issue_date: validation.data.issue_date,
      expiry_date: validation.data.expiry_date,
      latest_shipment_date: validation.data.latest_shipment_date,
      description: validation.data.description || null,
      partial_shipment_allowed: validation.data.partial_shipment_allowed || false,
      transshipment_allowed: validation.data.transshipment_allowed || false,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('letters_of_credit')
      .insert([lcData])
      .select('*')
      .single();

    if (error) throw error;

    return apiCreated(data);
  } catch (error) {
    console.error('POST /api/lc error:', error);
    return apiServerError('Failed to create letter of credit');
  }
}
