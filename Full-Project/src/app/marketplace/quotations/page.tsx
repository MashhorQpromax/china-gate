'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Quotation {
  id: string;
  reference_number: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  currency: string;
  status: string;
  lead_time: number;
  lead_time_unit: string;
  valid_until: string;
  created_at: string;
  purchase_requests: { title: string; product_name: string } | null;
  // supplier profile
  profiles: { full_name_en: string; company_name: string } | null;
}

type SortOption = 'date' | 'price' | 'status';
type StatusFilter = '' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'negotiating';

const statusColors: Record<string, { bg: string; text: string }> = {
  sent: { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-400' },
  viewed: { bg: 'bg-blue-600 bg-opacity-20', text: 'text-blue-400' },
  accepted: { bg: 'bg-green-600 bg-opacity-20', text: 'text-green-400' },
  negotiating: { bg: 'bg-yellow-600 bg-opacity-20', text: 'text-yellow-400' },
  rejected: { bg: 'bg-red-600 bg-opacity-20', text: 'text-red-400' },
  expired: { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-500' },
  withdrawn: { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-500' },
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotations, setTotalQuotations] = useState(0);

  const itemsPerPage = 20;

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedStatus) params.set('status', selectedStatus);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/quotations?${params}`);
      const data = await res.json();

      if (data.quotations) {
        setQuotations(data.quotations);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalQuotations(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load quotations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  // Client-side sorting
  const sorted = [...quotations].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (b.total_price || 0) - (a.total_price || 0);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Count by status
  const statusCounts: Record<string, number> = {};
  quotations.forEach(q => {
    statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
  });

  const getStatusStyle = (status: string) => {
    return statusColors[status] || statusColors.sent;
  };

  return (
    <DashboardLayout
      user={{ name: 'Company', initials: 'CO' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quotations</h1>
          <p className="text-gray-400">
            {totalQuotations > 0
              ? `Track and manage ${totalQuotations} quotations`
              : 'Track and manage your submitted and received quotations'}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['sent', 'accepted', 'negotiating', 'rejected'].map(status => (
            <div
              key={status}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedStatus === status
                  ? 'bg-[#c41e3a] border-[#c41e3a]'
                  : 'bg-[#1a1d23] border-[#242830] hover:border-[#d4a843]'
              }`}
              onClick={() => {
                setSelectedStatus(selectedStatus === status ? '' : status as StatusFilter);
                setCurrentPage(1);
              }}
            >
              <p className={`text-sm font-semibold capitalize ${selectedStatus === status ? 'text-white' : 'text-gray-400'}`}>
                {status}
              </p>
              <p className={`text-2xl font-bold mt-1 text-white`}>
                {statusCounts[status] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search by reference number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors min-w-[150px]"
          >
            <option value="date">Newest First</option>
            <option value="price">Highest Price</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Quotations Table */}
        {loading ? (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-[#242830] rounded" />
              ))}
            </div>
          </div>
        ) : sorted.length > 0 ? (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0c0f14] border-b border-[#242830]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Request</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Supplier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242830]">
                  {sorted.map((quote) => {
                    const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();
                    const style = getStatusStyle(quote.status);
                    return (
                      <tr key={quote.id} className="hover:bg-[#242830] transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold text-sm">
                            {quote.reference_number || quote.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300 text-sm">
                            {quote.purchase_requests?.title || quote.purchase_requests?.product_name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {quote.profiles?.company_name || quote.profiles?.full_name_en || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold text-sm">
                            ${quote.total_price?.toLocaleString()} {quote.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded text-xs font-semibold capitalize ${style.bg} ${style.text}`}>
                              {quote.status}
                            </span>
                            {isExpired && quote.status !== 'expired' && (
                              <span className="text-xs text-red-400">Expired</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded text-xs hover:bg-opacity-30 transition-colors">
                              View
                            </button>
                            {quote.status === 'sent' && (
                              <button className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded text-xs hover:bg-opacity-30 transition-colors">
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No quotations found</p>
            <p className="text-gray-500 text-sm">Quotations will appear here when suppliers respond to RFQs</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-[#c41e3a] text-white'
                    : 'border border-[#242830] text-white hover:bg-[#242830]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
