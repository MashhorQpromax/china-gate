'use client';

import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface DisputeProfile {
  id: string;
  username: string;
  email: string;
}

interface DealReference {
  id: string;
  reference_number: string;
}

interface Dispute {
  id: string;
  reference_number: string;
  deal_id: string;
  filed_by: string;
  filed_against: string;
  dispute_type: string;
  title: string;
  description: string;
  evidence: string[];
  claimed_amount: number;
  currency: string;
  resolution_method: string;
  resolution_description: string;
  resolved_amount: number;
  status: 'open' | 'investigating' | 'negotiating' | 'mediation' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  filed_by_user: DisputeProfile | null;
  filed_against_user: DisputeProfile | null;
  deal_reference: string | null;
}

interface ApiResponse {
  data: Dispute[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const statusColors: Record<string, string> = {
  open: 'bg-red-500/10 text-red-400 border-red-500/20',
  investigating: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  negotiating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  mediation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  escalated: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-300',
  high: 'bg-orange-500/20 text-orange-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  low: 'bg-gray-500/20 text-gray-300',
};

const disputeTypeLabels: Record<string, string> = {
  quality_issue: 'Quality Issue',
  delivery_delay: 'Delivery Delay',
  wrong_product: 'Wrong Product',
  quantity_mismatch: 'Quantity Mismatch',
  payment_dispute: 'Payment Dispute',
  damage: 'Damage',
  specification_mismatch: 'Specification Mismatch',
  fraud: 'Fraud',
  other: 'Other',
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter !== 'all') params.set('priority', priorityFilter);

      const response = await fetch(`/api/disputes?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to fetch disputes');
        }
        setLoading(false);
        return;
      }

      const apiResponse: ApiResponse = await response.json();
      setDisputes(apiResponse.data);
      setTotal(apiResponse.pagination.total);
    } catch (err) {
      setError('An error occurred while fetching disputes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const openCount = disputes.filter((d) => d.status === 'open' || d.status === 'escalated').length;
  const resolvedCount = disputes.filter((d) => d.status === 'resolved' || d.status === 'closed').length;

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Disputes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Total Disputes</div>
            <div className="text-3xl font-bold text-white">{total}</div>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Open/Escalated</div>
            <div className="text-3xl font-bold text-red-400">{openCount}</div>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Resolved/Closed</div>
            <div className="text-3xl font-bold text-green-400">{resolvedCount}</div>
          </div>
        </div>

        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="negotiating">Negotiating</option>
                <option value="mediation">Mediation</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Filter
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded p-4 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchDisputes()}
                className="text-sm px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading disputes...</div>
            </div>
          ) : disputes.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">No disputes found</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#242830]">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Reference</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Deal</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Filed By</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Against</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputes.map((dispute) => (
                      <tr key={dispute.id} className="border-b border-[#242830] hover:bg-[#0c0f14] transition-colors">
                        <td className="py-3 px-4 text-white font-mono text-xs">
                          {dispute.reference_number}
                        </td>
                        <td className="py-3 px-4 text-white font-mono text-xs">
                          {dispute.deal_reference || '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-xs">
                          {dispute.filed_by_user?.username || dispute.filed_by || '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-xs">
                          {dispute.filed_against_user?.username || dispute.filed_against || '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-xs">
                          {disputeTypeLabels[dispute.dispute_type] || dispute.dispute_type}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColors[dispute.status] || statusColors.open}`}>
                            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityColors[dispute.priority] || priorityColors.low}`}>
                            {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-xs">
                          {new Date(dispute.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/dashboard/admin/disputes/${dispute.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} disputes
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3a4350] transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-3 py-1 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded">
                    Page {page} of {totalPages}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3a4350] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
