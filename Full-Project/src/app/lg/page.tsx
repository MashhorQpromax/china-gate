'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiLG {
  id: string;
  reference_number: string;
  deal_id: string;
  requester_id: string;
  beneficiary_id: string;
  issuing_bank: string;
  lg_type: string;
  amount: number;
  currency: string;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  beneficiary_name: string;
  claim_condition: string | null;
  description: string | null;
  created_at: string;
}

function getAuthHeaders(): Record<string, string> {
  // httpOnly cookies are sent automatically with fetch when credentials: 'include' is set
  return {};
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-300',
  requested: 'bg-yellow-500/20 text-yellow-300',
  bank_review: 'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-blue-500/20 text-blue-300',
  issued: 'bg-green-500/20 text-green-300',
  claimed: 'bg-orange-500/20 text-orange-300',
  released: 'bg-emerald-500/20 text-emerald-300',
  expired: 'bg-red-500/20 text-red-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

const typeLabels: Record<string, string> = {
  bid_bond: 'Bid Bond',
  performance_bond: 'Performance Bond',
  advance_payment_guarantee: 'Advance Payment',
  customs_guarantee: 'Customs Guarantee',
  retention_guarantee: 'Retention',
};

export default function LGPage() {
  const [lgs, setLgs] = useState<ApiLG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLGs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/lg?page=${page}&limit=20`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view letters of guarantee');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        let data = json.data || [];
        if (statusFilter !== 'all') {
          data = data.filter((lg: ApiLG) => lg.status === statusFilter);
        }
        if (typeFilter !== 'all') {
          data = data.filter((lg: ApiLG) => lg.lg_type === typeFilter);
        }
        setLgs(data);
        setTotal(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch LGs:', err);
      setError('Failed to load letters of guarantee');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchLGs();
  }, [fetchLGs]);

  const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
    if (!expiryDate) return null;
    return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  // Stats
  const activeCount = lgs.filter(lg => !['expired', 'cancelled', 'released'].includes(lg.status)).length;
  const totalValue = lgs.reduce((sum, lg) => sum + (lg.amount || 0), 0);
  const expiringSoon = lgs.filter(lg => {
    const days = getDaysUntilExpiry(lg.expiry_date);
    return days !== null && days <= 30 && days > 0;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Letter of Guarantee (LG) Management</h1>
            <p className="text-gray-400 mt-1">Manage and track your letters of guarantee</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total LGs', value: total, color: 'text-blue-400', icon: '📋' },
            { label: 'Active', value: activeCount, color: 'text-green-400', icon: '✅' },
            { label: 'Total Value', value: formatCurrency(totalValue), color: 'text-emerald-400', icon: '💰' },
          ].map((stat) => (
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
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="requested">Requested</option>
                <option value="bank_review">Bank Review</option>
                <option value="approved">Approved</option>
                <option value="issued">Issued</option>
                <option value="released">Released</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Types</option>
                <option value="bid_bond">Bid Bond</option>
                <option value="performance_bond">Performance Bond</option>
                <option value="advance_payment_guarantee">Advance Payment</option>
                <option value="customs_guarantee">Customs Guarantee</option>
                <option value="retention_guarantee">Retention</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchLGs} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading letters of guarantee...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-[#0c0f14]">
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Beneficiary</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Bank</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Expiry</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lgs.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No letters of guarantee found</td></tr>
                  )}
                  {lgs.map((lg, idx) => {
                    const daysToExpiry = getDaysUntilExpiry(lg.expiry_date);
                    const isExpirySoon = daysToExpiry !== null && daysToExpiry <= 30 && daysToExpiry > 0;
                    const isExpired = daysToExpiry !== null && daysToExpiry <= 0;

                    return (
                      <tr key={lg.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                        <td className="px-6 py-4 text-white font-semibold">
                          <a href={`/lg/${lg.id}`} className="text-[#d4a843] hover:text-yellow-300">{lg.reference_number}</a>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{typeLabels[lg.lg_type] || lg.lg_type}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{lg.beneficiary_name || '-'}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{lg.issuing_bank || '-'}</td>
                        <td className="px-6 py-4 text-white font-semibold">{formatCurrency(lg.amount, lg.currency)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lg.status] || 'bg-gray-500/20 text-gray-300'}`}>
                            {(lg.status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {daysToExpiry !== null ? (
                            <span className={`text-sm font-semibold ${isExpired ? 'text-red-400' : isExpirySoon ? 'text-yellow-400' : 'text-gray-400'}`}>
                              {isExpired ? 'Expired' : `${daysToExpiry} days`}
                            </span>
                          ) : <span className="text-gray-500">-</span>}
                        </td>
                        <td className="px-6 py-4">
                          <a href={`/lg/${lg.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">View →</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
