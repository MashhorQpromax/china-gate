'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface RFQ {
  id: string;
  title: string;
  description: string;
  product_name: string;
  quantity: number;
  unit_of_measure: string;
  target_price: number | null;
  max_budget: number | null;
  currency: string;
  status: string;
  quotation_count: number;
  expires_at: string;
  created_at: string;
  required_delivery_date: string | null;
  categories: { name_en: string; name_ar: string } | null;
  profiles: { full_name_en: string; company_name: string; country: string } | null;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open': return 'bg-green-500/20 text-green-400';
    case 'receiving_quotes': return 'bg-blue-500/20 text-blue-400';
    case 'evaluating': return 'bg-yellow-500/20 text-yellow-400';
    case 'awarded': return 'bg-purple-500/20 text-purple-400';
    case 'closed': return 'bg-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
};

export default function SupplierRfqsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchRfqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rfq?page=${currentPage}&limit=10`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRfqs(data.data || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages || 1);
          setTotal(data.meta.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch RFQs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const daysUntilExpiry = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout
      user={{ name: 'Supplier', initials: 'SP' }}
      isAuthenticated={true}
      userRole="seller"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Incoming RFQs</h1>
            <p className="text-gray-400 mt-1">
              {total} purchase requests from buyers
            </p>
          </div>
        </div>

        {/* RFQ List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#1a1d23] border border-[#242830] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rfqs.length > 0 ? (
          <div className="space-y-4">
            {rfqs.map(rfq => {
              const expired = rfq.expires_at ? isExpired(rfq.expires_at) : false;
              const daysLeft = rfq.expires_at ? daysUntilExpiry(rfq.expires_at) : null;

              return (
                <Link
                  key={rfq.id}
                  href={`/dashboard/supplier/rfqs/${rfq.id}`}
                  className="block bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#d4a843] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">
                          {rfq.title || rfq.product_name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(rfq.status)}`}>
                          {rfq.status.replace(/_/g, ' ')}
                        </span>
                        {expired && (
                          <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                            Expired
                          </span>
                        )}
                        {!expired && daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && (
                          <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">
                            {daysLeft}d left
                          </span>
                        )}
                      </div>

                      {rfq.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {rfq.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity: </span>
                          <span className="text-white">
                            {rfq.quantity?.toLocaleString()} {rfq.unit_of_measure || 'units'}
                          </span>
                        </div>
                        {(rfq.max_budget || rfq.target_price) && (
                          <div>
                            <span className="text-gray-500">Budget: </span>
                            <span className="text-[#d4a843] font-semibold">
                              {formatCurrency(rfq.max_budget || rfq.target_price || 0)} {rfq.currency}
                            </span>
                          </div>
                        )}
                        {rfq.required_delivery_date && (
                          <div>
                            <span className="text-gray-500">Delivery by: </span>
                            <span className="text-white">
                              {new Date(rfq.required_delivery_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {rfq.categories && (
                          <div>
                            <span className="text-gray-500">Category: </span>
                            <span className="text-white">{rfq.categories.name_en}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {rfq.profiles && (
                          <span>
                            By {rfq.profiles.company_name || rfq.profiles.full_name_en}
                            {rfq.profiles.country && ` (${rfq.profiles.country})`}
                          </span>
                        )}
                        <span>{rfq.quotation_count || 0} quotes received</span>
                        <span>{new Date(rfq.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {!expired && ['open', 'receiving_quotes'].includes(rfq.status) ? (
                        <span className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg font-semibold text-sm">
                          Submit Quote
                        </span>
                      ) : (
                        <span className="px-5 py-2.5 border border-[#242830] text-gray-400 rounded-lg text-sm">
                          View Details
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No available RFQs</p>
            <p className="text-gray-500 text-sm">
              Check back later for new purchase requests from buyers
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#242830] rounded-lg text-gray-400 hover:bg-[#242830] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#242830] rounded-lg text-gray-400 hover:bg-[#242830] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
