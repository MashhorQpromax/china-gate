'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RequestCard from '@/components/marketplace/RequestCard';
import Link from 'next/link';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

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
  categories: { name_en: string; name_ar: string } | null;
  profiles: { full_name_en: string; company_name: string; country: string } | null;
}

type SortOption = 'newest' | 'deadline' | 'budget' | 'quotes';

export default function PurchaseRequestsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRfqs, setTotalRfqs] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('access_token='));
  }, []);

  const itemsPerPage = 10;

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Fetch RFQs
  const fetchRfqs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedCategory) params.set('category_id', selectedCategory);
      if (selectedStatus) params.set('status', selectedStatus);

      const res = await fetch(`/api/rfq?${params}`);
      const data = await res.json();

      const rfqList = data.data || data.rfqs || [];
      setRfqs(rfqList);
      if (data.meta) {
        setTotalPages(data.meta.totalPages || 1);
        setTotalRfqs(data.meta.total || 0);
      } else if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalRfqs(data.pagination.total || 0);
      }
    } catch (err) {
      console.error('Failed to load RFQs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  // Debounced search reset
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Client-side filtering for search and sorting (API already handles category/status)
  const filtered = rfqs
    .filter(rfq => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        rfq.title?.toLowerCase().includes(term) ||
        rfq.product_name?.toLowerCase().includes(term) ||
        rfq.description?.toLowerCase().includes(term) ||
        rfq.profiles?.company_name?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        case 'budget':
          return (b.max_budget || 0) - (a.max_budget || 0);
        case 'quotes':
          return (b.quotation_count || 0) - (a.quotation_count || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const daysUntilDeadline = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return days > 0 ? days : 0;
  };

  const formatBudget = (budget: number | null, currency: string) => {
    if (!budget) return 'Open Budget';
    if (budget >= 1000000) return `$${(budget / 1000000).toFixed(1)}M ${currency}`;
    if (budget >= 1000) return `$${(budget / 1000).toFixed(0)}K ${currency}`;
    return `$${budget.toLocaleString()} ${currency}`;
  };

  const mapStatus = (status: string): 'Open' | 'Receiving Quotes' | 'Closed' | 'Awarded' => {
    switch (status) {
      case 'open': return 'Open';
      case 'receiving_quotes': return 'Receiving Quotes';
      case 'evaluating': return 'Receiving Quotes';
      case 'awarded': return 'Awarded';
      case 'closed': return 'Closed';
      case 'cancelled': return 'Closed';
      case 'expired': return 'Closed';
      default: return 'Open';
    }
  };

  return (
    <DashboardLayout
      user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }}
      isAuthenticated={isLoggedIn}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Purchase Requests</h1>
            <p className="text-gray-400">
              {totalRfqs > 0
                ? `Discover ${totalRfqs} buying opportunities from Gulf buyers`
                : 'Discover buying opportunities from Gulf buyers'}
            </p>
          </div>
          <Link
            href={isLoggedIn ? '/marketplace/requests/new' : '/login?redirect=/marketplace/requests/new'}
            className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold hidden sm:block"
          >
            + Post New Request
          </Link>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Category</h3>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <input
                  type="radio"
                  checked={selectedCategory === ''}
                  onChange={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 accent-[#c41e3a]"
                />
                <span className="text-gray-300">All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCategory === cat.id}
                    onChange={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{cat.name_en}</span>
                </label>
              ))}
            </div>

            {/* Status Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Status</h3>
              {[
                { value: '', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'receiving_quotes', label: 'Receiving Quotes' },
                { value: 'evaluating', label: 'Evaluating' },
                { value: 'awarded', label: 'Awarded' },
                { value: 'closed', label: 'Closed' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedStatus === opt.value}
                    onChange={() => {
                      setSelectedStatus(opt.value);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Requests */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-400">
                {loading ? 'Loading...' : `Showing ${filtered.length} requests`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline Soon</option>
                <option value="budget">Highest Budget</option>
                <option value="quotes">Most Quotes</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-[#242830] rounded w-3/4 mb-3" />
                    <div className="h-4 bg-[#242830] rounded w-1/2 mb-4" />
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="h-10 bg-[#242830] rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filtered.map(rfq => (
                  <Link key={rfq.id} href={`/marketplace/requests/${rfq.id}`}>
                    <RequestCard
                      request={{
                        id: rfq.id,
                        title: rfq.title,
                        description: rfq.description || rfq.product_name,
                        category: rfq.categories?.name_en || 'General',
                        quantity: `${rfq.quantity?.toLocaleString()} ${rfq.unit_of_measure || 'units'}`,
                        budget: formatBudget(rfq.max_budget, rfq.currency),
                        deadline: daysUntilDeadline(rfq.expires_at),
                        buyerCountry: rfq.profiles?.country || 'Unknown',
                        buyerName: rfq.profiles?.company_name || rfq.profiles?.full_name_en || 'Anonymous',
                        status: mapStatus(rfq.status),
                        quotationCount: rfq.quotation_count || 0,
                      }}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg mb-2">No requests found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
