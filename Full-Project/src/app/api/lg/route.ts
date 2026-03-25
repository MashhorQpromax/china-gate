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

const createLGSchema = {
  deal_id: { type: 'string', required: true },
  requester_id: { type: 'string', required: true },
  beneficiary_id: { type: 'string', required: true },
  issuing_bank: { type: 'string', required: true },
  lg_type: { type: 'string', required: true },
  amount: { type: 'number', required: true },
  currency: { type: 'string', required: true },
  issue_date: { type: 'string', required: true },
  expiry_date: { type: 'string', required: true },
  beneficiary_name: { type: 'string', required: true },
  claim_condition: { type: 'string', required: false },
  description: { type: 'string', required: false },
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
      .from('letters_of_guarantee')
      .select('*', { count: 'exact' });

    // Role-based filtering
    if (!user.isAdmin) {
      query = query.or(`requester_id.eq.${user.id},beneficiary_id.eq.${user.id}`);
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
    console.error('GET /api/lg error:', error);
    return apiServerError('Failed to fetch letters of guarantee');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestUser(request);
    if (!user.isAdmin) {
      return apiForbidden('Only admins can create letters of guarantee');
    }

    const body = await request.json();
    const validation = validateBody(body, createLGSchema);
    if (!validation.isValid) {
      return apiBadRequest(validation.error);
    }

    // Generate reference number: LG-YYMMDD-NNNN
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const referenceNumber = `LG-${year}${month}${day}-${randomNum}`;

    const lgData = {
      reference_number: referenceNumber,
      deal_id: validation.data.deal_id,
      requester_id: validation.data.requester_id,
      beneficiary_id: validation.data.beneficiary_id,
      issuing_bank: validation.data.issuing_bank,
      lg_type: validation.data.lg_type,
      amount: validation.data.amount,
      currency: validation.data.currency,
      issue_date: validation.data.issue_date,
      expiry_date: validation.data.expiry_date,
      beneficiary_name: validation.data.beneficiary_name,
      claim_condition: validation.data.claim_condition || null,
      description: validation.data.description || null,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('letters_of_guarantee')
      .insert([lgData])
      .select()
      .single();

    if (error) throw error;

    return apiCreated(data);
  } catch (error) {
    console.error('POST /api/lg error:', error);
    return apiServerError('Failed to create letter of guarantee');
  }
}
