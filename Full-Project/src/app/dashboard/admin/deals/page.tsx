'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiDeal {
  id: string;
  reference_number: string;
  buyer_id: string;
  supplier_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  stage: string;
  created_at: string;
  buyer_name?: string;
  supplier_name?: string;
}

function getAuthHeaders(): Record<string, string> {
  // httpOnly cookies are sent automatically with fetch when credentials: 'include' is set
  return {};
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

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

const stageColors: Record<string, string> = {
  negotiation: 'bg-blue-500/20 text-blue-400',
  quotation_sent: 'bg-purple-500/20 text-purple-400',
  quotation_review: 'bg-purple-500/20 text-purple-400',
  quotation_accepted: 'bg-indigo-500/20 text-indigo-400',
  po_issued: 'bg-yellow-500/20 text-yellow-400',
  po_confirmed: 'bg-yellow-500/20 text-yellow-400',
  production_start: 'bg-orange-500/20 text-orange-400',
  production_inspection: 'bg-orange-500/20 text-orange-400',
  ready_for_shipment: 'bg-cyan-500/20 text-cyan-400',
  lc_issued: 'bg-teal-500/20 text-teal-400',
  goods_shipped: 'bg-blue-500/20 text-blue-400',
  goods_in_transit: 'bg-blue-500/20 text-blue-400',
  port_arrived: 'bg-emerald-500/20 text-emerald-400',
  customs_clearance: 'bg-amber-500/20 text-amber-400',
  delivery: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/20 text-green-400',
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<ApiDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filterStage !== 'all') params.set('stage', filterStage);

      const res = await fetch(`/api/deals?${params}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in as admin to view deals');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        let data = json.data || [];
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          data = data.filter((d: ApiDeal) =>
            (d.reference_number || '').toLowerCase().includes(term) ||
            (d.buyer_name || '').toLowerCase().includes(term) ||
            (d.supplier_name || '').toLowerCase().includes(term) ||
            (d.product_name || '').toLowerCase().includes(term)
          );
        }
        setDeals(data);
        setTotal(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, [page, filterStage, searchTerm]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const totalValue = deals.reduce((sum, d) => sum + (d.total_value || 0), 0);
  const stages = ['all', ...Object.keys(stageLabels)];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deal Monitoring</h1>
          <p className="text-gray-400">Monitor and manage all active deals on the platform</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Deals</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Deal Value</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Average Deal Value</p>
            <p className="text-3xl font-bold text-white">
              {deals.length > 0 ? formatCurrency(totalValue / deals.length) : '$0'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by reference, buyer, supplier, or product..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
            />
            <select
              value={filterStage}
              onChange={(e) => { setFilterStage(e.target.value); setPage(1); }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stageLabels[stage] || stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchDeals} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading deals...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0c0f14] border-b border-[#242830]">
                  <tr className="text-gray-400">
                    <th className="text-left py-4 px-6">Reference</th>
                    <th className="text-left py-4 px-6">Buyer</th>
                    <th className="text-left py-4 px-6">Supplier</th>
                    <th className="text-left py-4 px-6">Product</th>
                    <th className="text-right py-4 px-6">Amount</th>
                    <th className="text-left py-4 px-6">Stage</th>
                    <th className="text-left py-4 px-6">Date</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No deals found</td></tr>
                  )}
                  {deals.map((deal, idx) => (
                    <tr key={deal.id} className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${idx % 2 === 0 ? 'bg-[#0c0f14]' : ''}`}>
                      <td className="py-4 px-6 text-white font-semibold">
                        <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300">{deal.reference_number || '-'}</a>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{deal.buyer_name || 'Unknown'}</td>
                      <td className="py-4 px-6 text-gray-300">{deal.supplier_name || 'Unknown'}</td>
                      <td className="py-4 px-6 text-gray-300 text-xs">{deal.product_name || '-'}</td>
                      <td className="py-4 px-6 text-right text-white font-semibold">{formatCurrency(deal.total_value, deal.currency)}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded ${stageColors[deal.stage] || 'bg-gray-500/20 text-gray-400'}`}>
                          {stageLabels[deal.stage] || deal.stage}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs">{new Date(deal.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right">
                        <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300 text-xs font-semibold">View →</a>
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
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
