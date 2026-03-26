'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiDeal {
  id: string;
  reference_number: string;
  buyer_id: string;
  supplier_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  stage: string;
  incoterm: string | null;
  payment_terms: string | null;
  shipping_port: string | null;
  destination_port: string | null;
  shipping_method: string | null;
  expected_delivery_date: string | null;
  created_at: string;
  updated_at: string;
  buyer_name: string;
  supplier_name: string;
}



// Stage display config
const stageOrder = [
  'negotiation', 'quotation_sent', 'quotation_review', 'quotation_accepted',
  'po_issued', 'po_confirmed', 'production_start', 'production_inspection',
  'ready_for_shipment', 'lc_issued', 'goods_shipped', 'goods_in_transit',
  'port_arrived', 'customs_clearance', 'delivery', 'completed',
];

const stageLabels: Record<string, string> = {
  negotiation: 'Negotiation',
  quotation_sent: 'Quote Sent',
  quotation_review: 'Quote Review',
  quotation_accepted: 'Quote Accepted',
  po_issued: 'PO Issued',
  po_confirmed: 'PO Confirmed',
  production_start: 'Production',
  production_inspection: 'Quality Check',
  ready_for_shipment: 'Ready to Ship',
  lc_issued: 'LC Issued',
  goods_shipped: 'Shipped',
  goods_in_transit: 'In Transit',
  port_arrived: 'Port Arrived',
  customs_clearance: 'Customs',
  delivery: 'Delivery',
  completed: 'Completed',
};

function getStageProgress(stage: string): number {
  const idx = stageOrder.indexOf(stage);
  if (idx === -1) return 0;
  return ((idx + 1) / stageOrder.length) * 100;
}

function getStageColor(stage: string): string {
  const idx = stageOrder.indexOf(stage);
  if (idx <= 3) return 'bg-orange-500/20 text-orange-300';
  if (idx <= 6) return 'bg-yellow-500/20 text-yellow-300';
  if (idx <= 10) return 'bg-blue-500/20 text-blue-300';
  if (idx <= 14) return 'bg-purple-500/20 text-purple-300';
  return 'bg-green-500/20 text-green-300';
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function DealsPage() {
  const [deals, setDeals] = useState<ApiDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (stageFilter !== 'all') params.set('stage', stageFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/deals?${params}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Please log in to view deals');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        setDeals(json.data || []);
        setTotal(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, [page, stageFilter, searchQuery]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Compute stats from loaded deals
  const activeDealCount = deals.filter(d => d.stage !== 'completed').length;
  const completedCount = deals.filter(d => d.stage === 'completed').length;
  const totalValue = deals.reduce((sum, d) => sum + (d.total_value || 0), 0);

  const stats = [
    { label: 'Total Deals', value: total, color: 'text-blue-400', icon: '📊' },
    { label: 'Active', value: activeDealCount, color: 'text-green-400', icon: '📈' },
    { label: 'Completed', value: completedCount, color: 'text-emerald-400', icon: '✅' },
    { label: 'Total Value', value: formatCurrency(totalValue), color: 'text-[#d4a843]', icon: '💰' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Deal Management</h1>
            <p className="text-gray-400 mt-1">Track and manage your trading deals</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by product, reference, or company..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Deal Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="all">All Stages</option>
                {stageOrder.map(stage => (
                  <option key={stage} value={stage}>{stageLabels[stage] || stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchDeals} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading deals...</p>
          </div>
        )}

        {/* Deals Table */}
        {!loading && !error && (
          <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-[#0c0f14]">
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Product</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Buyer / Supplier</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Stage</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Progress</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No deals found
                      </td>
                    </tr>
                  )}
                  {deals.map((deal, idx) => (
                    <tr key={deal.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                      <td className="px-6 py-4 text-white font-semibold">
                        <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300">
                          {deal.reference_number || `#${deal.id.slice(0, 8)}`}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {deal.product_name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="text-sm">{deal.buyer_name}</div>
                        <div className="text-xs text-gray-500">→ {deal.supplier_name}</div>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {formatCurrency(deal.total_value, deal.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(deal.stage)}`}>
                          {stageLabels[deal.stage] || deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#c41e3a] h-2 rounded-full transition-all"
                            style={{ width: `${getStageProgress(deal.stage)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{Math.round(getStageProgress(deal.stage))}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-300">{deal.created_at ? new Date(deal.created_at).toLocaleDateString() : '-'}</div>
                        {deal.updated_at && deal.updated_at !== deal.created_at && (
                          <div className="text-xs text-gray-500">Updated {new Date(deal.updated_at).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
