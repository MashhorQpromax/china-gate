'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Deal {
  id: string;
  reference_number: string;
  product_name: string;
  supplier_id: string;
  total_value: number;
  currency: string;
  stage: string;
  created_at: string;
}

interface RFQ {
  id: string;
  title: string;
  product_name: string;
  quantity: number;
  unit_of_measure: string;
  status: string;
  created_at: string;
}

interface Quotation {
  id: string;
  supplier_id: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  currency: string;
  status: string;
  purchase_requests: {
    product_name: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  action_url?: string;
  created_at: string;
  read: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    [key: string]: any;
  };
}

// Utility functions
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toLocaleString()}`;
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const getStageColor = (stage: string): string => {
  const stageLower = stage.toLowerCase();

  if (['negotiation', 'quotation_sent', 'quotation_review'].includes(stageLower)) {
    return 'bg-blue-500/20 text-blue-400';
  }
  if (['production_start', 'production_inspection'].includes(stageLower)) {
    return 'bg-orange-500/20 text-orange-400';
  }
  if (['goods_shipped', 'goods_in_transit'].includes(stageLower)) {
    return 'bg-purple-500/20 text-purple-400';
  }
  if (stageLower === 'completed') {
    return 'bg-green-500/20 text-green-400';
  }
  if (['cancelled', 'disputed'].includes(stageLower)) {
    return 'bg-red-500/20 text-red-400';
  }
  return 'bg-gray-500/20 text-gray-400';
};

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-[#242830] rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-[#242830] rounded w-full"></div>
      <div className="h-4 bg-[#242830] rounded w-5/6"></div>
      <div className="h-4 bg-[#242830] rounded w-4/5"></div>
    </div>
  </div>
);

export default function BuyerDashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [dealsTotal, setDealsTotal] = useState(0);
  const [rfqsTotal, setRfqsTotal] = useState(0);
  const [quotationsTotal, setQuotationsTotal] = useState(0);

  const [loadingDeals, setLoadingDeals] = useState(true);
  const [loadingRfqs, setLoadingRfqs] = useState(true);
  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [errorDeals, setErrorDeals] = useState<string | null>(null);
  const [errorRfqs, setErrorRfqs] = useState<string | null>(null);
  const [errorQuotations, setErrorQuotations] = useState<string | null>(null);
  const [errorNotifications, setErrorNotifications] = useState<string | null>(null);

  // Fetch deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoadingDeals(true);
        setErrorDeals(null);
        const response = await fetch('/api/deals?limit=5', {
          credentials: 'include',
        });
        const json: ApiResponse<Deal[]> = await response.json();
        if (json.success) {
          setDeals(json.data);
          setDealsTotal(json.meta?.total || 0);
        }
      } catch (err) {
        setErrorDeals(err instanceof Error ? err.message : 'Failed to fetch deals');
      } finally {
        setLoadingDeals(false);
      }
    };

    fetchDeals();
  }, []);

  // Fetch RFQs
  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        setLoadingRfqs(true);
        setErrorRfqs(null);
        const response = await fetch('/api/rfq?limit=4', {
          credentials: 'include',
        });
        const json: ApiResponse<RFQ[]> = await response.json();
        if (json.success) {
          setRfqs(json.data);
          setRfqsTotal(json.meta?.total || 0);
        }
      } catch (err) {
        setErrorRfqs(err instanceof Error ? err.message : 'Failed to fetch RFQs');
      } finally {
        setLoadingRfqs(false);
      }
    };

    fetchRfqs();
  }, []);

  // Fetch quotations
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoadingQuotations(true);
        setErrorQuotations(null);
        const response = await fetch('/api/quotations?limit=3', {
          credentials: 'include',
        });
        const json: ApiResponse<Quotation[]> = await response.json();
        if (json.success) {
          setQuotations(json.data);
          setQuotationsTotal(json.meta?.total || 0);
        }
      } catch (err) {
        setErrorQuotations(err instanceof Error ? err.message : 'Failed to fetch quotations');
      } finally {
        setLoadingQuotations(false);
      }
    };

    fetchQuotations();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        setErrorNotifications(null);
        const response = await fetch('/api/notifications?limit=3&unread=true', {
          credentials: 'include',
        });
        const json = await response.json();
        if (json.success) {
          setNotifications(json.data.notifications);
          setUnreadCount(json.data.unreadCount);
        }
      } catch (err) {
        setErrorNotifications(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  // Calculate stats
  const totalSpend = deals.reduce((sum, deal) => sum + deal.total_value, 0);
  const pendingQuotations = quotations.filter(q =>
    q.status.toLowerCase() === 'pending' || q.status.toLowerCase() === 'sent'
  ).length;

  return (
    <DashboardLayout
      user={{ name: 'Buyer', initials: 'B' }}
      isAuthenticated={true}
      userRole="buyer"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your buying activities today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Deals */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
            <p className="text-gray-400 text-sm mb-2">Active Deals</p>
            {loadingDeals ? (
              <SkeletonLoader />
            ) : (
              <>
                <p className="text-3xl font-bold text-white mb-2">{dealsTotal}</p>
                <p className="text-sm text-green-400">
                  {deals.length} recent
                </p>
              </>
            )}
          </div>

          {/* Open Requests */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
            <p className="text-gray-400 text-sm mb-2">Open Requests</p>
            {loadingRfqs ? (
              <SkeletonLoader />
            ) : (
              <>
                <p className="text-3xl font-bold text-white mb-2">{rfqsTotal}</p>
                <p className="text-sm text-green-400">
                  {rfqs.length} recent
                </p>
              </>
            )}
          </div>

          {/* Pending Quotations */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
            <p className="text-gray-400 text-sm mb-2">Pending Quotations</p>
            {loadingQuotations ? (
              <SkeletonLoader />
            ) : (
              <>
                <p className="text-3xl font-bold text-white mb-2">{quotationsTotal}</p>
                <p className="text-sm text-green-400">
                  {pendingQuotations} pending
                </p>
              </>
            )}
          </div>

          {/* Total Spend */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
            <p className="text-gray-400 text-sm mb-2">Total Spend</p>
            {loadingDeals ? (
              <SkeletonLoader />
            ) : (
              <>
                <p className="text-3xl font-bold text-white mb-2">{formatCurrency(totalSpend)}</p>
                <p className="text-sm text-green-400">
                  across {deals.length} deals
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deals */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Deals</h2>
                <Link href="/deals" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {loadingDeals ? (
                  <>
                    <SkeletonLoader />
                    <SkeletonLoader />
                    <SkeletonLoader />
                  </>
                ) : errorDeals ? (
                  <p className="text-red-400 text-sm">{errorDeals}</p>
                ) : deals.length === 0 ? (
                  <p className="text-gray-400 text-sm">No recent deals found</p>
                ) : (
                  deals.map(deal => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg hover:bg-[#1a1d23] transition-colors border border-transparent hover:border-[#242830]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-white">{deal.reference_number}</p>
                          <span className={`text-xs px-2 py-1 rounded ${getStageColor(deal.stage)}`}>
                            {deal.stage}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{deal.product_name}</p>
                        <p className="text-gray-600 text-xs mt-1">{formatRelativeDate(deal.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          {formatCurrency(deal.total_value)} {deal.currency}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/marketplace/requests/new"
                  className="block w-full px-4 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm text-center"
                >
                  + Post Request
                </Link>
                <Link
                  href="/marketplace/products"
                  className="block w-full px-4 py-3 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm text-center"
                >
                  Browse Products
                </Link>
                <Link
                  href="/deals"
                  className="block w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm text-center"
                >
                  View Deals
                </Link>
                <Link
                  href="/messages"
                  className="block w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm text-center"
                >
                  Messages
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-[#c41e3a] text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {loadingNotifications ? (
                  <>
                    <SkeletonLoader />
                    <SkeletonLoader />
                  </>
                ) : errorNotifications ? (
                  <p className="text-red-400 text-sm">{errorNotifications}</p>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No unread notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 bg-[#0c0f14] rounded-lg border-l-2 transition-colors ${
                        notif.read ? 'border-l-[#242830]' : 'border-l-[#c41e3a]'
                      }`}
                    >
                      <p className="text-white text-sm font-semibold">{notif.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                      <p className="text-gray-600 text-xs mt-1">{formatRelativeDate(notif.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchase Requests */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Purchase Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingRfqs ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : errorRfqs ? (
              <p className="text-red-400 text-sm">{errorRfqs}</p>
            ) : rfqs.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent purchase requests</p>
            ) : (
              rfqs.map(rfq => (
                <Link
                  key={rfq.id}
                  href={`/marketplace/requests/${rfq.id}`}
                  className="block p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#d4a843] transition-colors"
                >
                  <p className="font-semibold text-white mb-2">{rfq.product_name || rfq.title}</p>
                  <p className="text-gray-400 text-sm mb-3">
                    {rfq.quantity} {rfq.unit_of_measure}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        ['open', 'active'].includes(rfq.status.toLowerCase())
                          ? 'bg-green-500/20 text-green-400'
                          : ['receiving_quotes', 'quoting', 'pending'].includes(rfq.status.toLowerCase())
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {rfq.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-gray-600 text-xs">{formatRelativeDate(rfq.created_at)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Quotations Received</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-right py-3 px-4">Unit Price</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingQuotations ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4">
                      <SkeletonLoader />
                    </td>
                  </tr>
                ) : errorQuotations ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-red-400 text-sm">
                      {errorQuotations}
                    </td>
                  </tr>
                ) : quotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-gray-400 text-sm">
                      No recent quotations
                    </td>
                  </tr>
                ) : (
                  quotations.map(quote => (
                    <tr key={quote.id} className="border-b border-[#242830] hover:bg-[#242830] transition-colors">
                      <td className="py-3 px-4 text-white font-semibold">
                        {quote.purchase_requests.product_name}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {formatCurrency(quote.unit_price)} {quote.currency}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {quote.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-white font-semibold">
                        {formatCurrency(quote.total_price)} {quote.currency}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span
                          className={`text-xs px-2 py-1 rounded inline-block ${
                            quote.status.toLowerCase() === 'pending'
                              ? 'bg-blue-500/20 text-blue-400'
                              : quote.status.toLowerCase() === 'accepted'
                              ? 'bg-green-500/20 text-green-400'
                              : quote.status.toLowerCase() === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-[#c41e3a] hover:text-red-600 font-semibold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
