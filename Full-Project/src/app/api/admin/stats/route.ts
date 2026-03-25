import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiForbidden,
  apiServerError,
  getRequestUser,
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);

    // Check admin access
    if (!user.isAuthenticated || !user.isAdmin) {
      return apiForbidden('Only admins can access this endpoint');
    }

    // Get total users count
    const { count: totalUsers, error: totalUsersError } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact' });

    // Get total buyers count
    const { count: totalBuyers, error: totalBuyersError } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('account_type', 'gulf_buyer');

    // Get total suppliers count
    const { count: totalSuppliers, error: totalSuppliersError } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('account_type', 'chinese_supplier');

    // Get total manufacturers count
    const { count: totalManufacturers, error: totalManufacturersError } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('account_type', 'gulf_manufacturer');

    // Get total deals count
    const { count: totalDeals, error: totalDealsError } = await supabaseAdmin
      .from('deals')
      .select('id', { count: 'exact' });

    // Get active deals count
    const { count: activeDeals, error: activeDealsError } = await supabaseAdmin
      .from('deals')
      .select('id', { count: 'exact' })
      .not('stage', 'in', '(completed,cancelled,disputed)');

    // Get total trade value (sum of deals.total_value)
    const { data: tradeValueData, error: tradeValueError } = await supabaseAdmin
      .from('deals')
      .select('total_value');

    const totalTradeValue = (tradeValueData || []).reduce((sum, deal) => sum + (deal.total_value || 0), 0);

    // Get total shipments count
    const { count: totalShipments, error: totalShipmentsError } = await supabaseAdmin
      .from('shipments')
      .select('id', { count: 'exact' });

    // Get active shipments count
    const { count: activeShipments, error: activeShipmentsError } = await supabaseAdmin
      .from('shipments')
      .select('id', { count: 'exact' })
      .in('status', ['shipped', 'in_transit', 'port_arrived', 'customs_clearance']);

    // Get total RFQs count
    const { count: totalRfqs, error: totalRfqsError } = await supabaseAdmin
      .from('purchase_requests')
      .select('id', { count: 'exact' });

    // Get open RFQs count
    const { count: openRfqs, error: openRfqsError } = await supabaseAdmin
      .from('purchase_requests')
      .select('id', { count: 'exact' })
      .eq('status', 'open');

    // Get total tickets count
    const { count: totalTickets, error: totalTicketsError } = await supabaseAdmin
      .from('support_tickets')
      .select('id', { count: 'exact' });

    // Get open tickets count
    const { count: openTickets, error: openTicketsError } = await supabaseAdmin
      .from('support_tickets')
      .select('id', { count: 'exact' })
      .in('status', ['open', 'in_progress', 'escalated']);

    // Get recent deals with buyer/supplier names
    const { data: recentDealsData, error: recentDealsError } = await supabaseAdmin
      .from('deals')
      .select('id, title, total_value, stage, buyer_id, supplier_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    let recentDeals = [];
    if (recentDealsData && recentDealsData.length > 0) {
      const buyerIds = recentDealsData
        .map((d) => d.buyer_id)
        .filter(Boolean);
      const supplierIds = recentDealsData
        .map((d) => d.supplier_id)
        .filter(Boolean);
      const allUserIds = [...new Set([...buyerIds, ...supplierIds])];

      if (allUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name_en, company_name')
          .in('id', allUserIds);

        const profileMap = new Map(
          (profiles || []).map((p) => [
            p.id,
            { name: p.full_name_en, company: p.company_name },
          ])
        );

        recentDeals = recentDealsData.map((deal) => {
          const buyer = profileMap.get(deal.buyer_id);
          const supplier = profileMap.get(deal.supplier_id);
          return {
            id: deal.id,
            title: deal.title,
            total_value: deal.total_value,
            stage: deal.stage,
            buyer_name: buyer?.name || buyer?.company || 'Unknown',
            supplier_name: supplier?.name || supplier?.company || 'Unknown',
            created_at: deal.created_at,
          };
        });
      }
    }

    // Get recent users
    const { data: recentUsers, error: recentUsersError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name_en, company_name, account_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const stats = {
      total_users: totalUsers || 0,
      total_buyers: totalBuyers || 0,
      total_suppliers: totalSuppliers || 0,
      total_manufacturers: totalManufacturers || 0,
      total_deals: totalDeals || 0,
      active_deals: activeDeals || 0,
      total_trade_value: totalTradeValue,
      total_shipments: totalShipments || 0,
      active_shipments: activeShipments || 0,
      total_rfqs: totalRfqs || 0,
      open_rfqs: openRfqs || 0,
      total_tickets: totalTickets || 0,
      open_tickets: openTickets || 0,
      recent_deals: recentDeals,
      recent_users: recentUsers || [],
    };

    return apiSuccess(stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    console.error('Admin stats route error:', error);
    return apiServerError('Internal server error');
  }
}
