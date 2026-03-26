'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Deal {
  id: string;
  reference_number: string;
  product_name: string;
  buyer_name?: string;
  buyer_info?: string;
  total_value: number;
  stage: string;
  created_at: string;
}

interface RFQ {
  id: string;
  title: string;
  quantity: number;
  target_price: number | null;
  max_budget: number | null;
  required_delivery_date: string | null;
  currency: string;
}

interface Quotation {
  id: string;
  reference_number: string;
  rfq_reference?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  destination_port: string;
  status: string;
  estimated_arrival: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { total: number };
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

// Format currency helper
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

// Format relative date helper
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Get stage badge color
const getStageColor = (stage: string): string => {
  const lowerStage = stage.toLowerCase();
  if (
    lowerStage === 'negotiation' ||
    lowerStage === 'quotation_sent' ||
    lowerStage === 'quotation_review'
  ) {
    return 'bg-blue-500/20 text-blue-400';
  }
  if (
    lowerStage === 'production_start' ||
    lowerStage === 'production_inspection'
  ) {
    return 'bg-orange-500/20 text-orange-400';
  }
  if (
    lowerStage === 'goods_shipped' ||
    lowerStage === 'goods_in_transit'
  ) {
    return 'bg-purple-500/20 text-purple-400';
  }
  if (lowerStage === 'completed') {
    return 'bg-green-500/20 text-green-400';
  }
  if (lowerStage === 'cancelled' || lowerStage === 'disputed') {
    return 'bg-red-500/20 text-red-400';
  }
  return 'bg-gray-500/20 text-gray-400';
};

// Get quotation status color
const getQuotationStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending' || lowerStatus === 'sent') {
    return 'bg-blue-500/20 text-blue-400';
  }
  if (lowerStatus === 'viewed') {
    return 'bg-yellow-500/20 text-yellow-400';
  }
  if (lowerStatus === 'accepted') {
    return 'bg-green-500/20 text-green-400';
  }
  if (lowerStatus === 'rejected') {
    return 'bg-red-500/20 text-red-400';
  }
  if (lowerStatus === 'expired') {
    return 'bg-gray-500/20 text-gray-400';
  }
  return 'bg-gray-500/20 text-gray-400';
};

// Loading skeleton component
const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-12 bg-[#242830] rounded-lg animate-pulse" />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="h-32 bg-[#242830] rounded-lg animate-pulse" />
);

export default function SupplierDashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [loadingDeals, setLoadingDeals] = useState(true);
  const [loadingRfqs, setLoadingRfqs] = useState(true);
  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingShipments, setLoadingShipments] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch deals
        const dealsRes = await fetch('/api/deals?limit=5', {
          credentials: 'include',
        });
        if (dealsRes.ok) {
          const dealsData: ApiResponse<Deal[]> = await dealsRes.json();
          setDeals(dealsData.data || []);
        }
        setLoadingDeals(false);

        // Fetch RFQs
        const rfqRes = await fetch('/api/rfq?limit=5', {
          credentials: 'include',
        });
        if (rfqRes.ok) {
          const rfqData: ApiResponse<RFQ[]> = await rfqRes.json();
          setRfqs(rfqData.data || []);
        }
        setLoadingRfqs(false);

        // Fetch quotations
        const quotationsRes = await fetch('/api/quotations?limit=5', {
          credentials: 'include',
        });
        if (quotationsRes.ok) {
          const quotationsData: ApiResponse<Quotation[]> =
            await quotationsRes.json();
          setQuotations(quotationsData.data || []);
        }
        setLoadingQuotations(false);

        // Fetch notifications
        const notificationsRes = await fetch('/api/notifications?limit=3&unread=true', {
          credentials: 'include',
        });
        if (notificationsRes.ok) {
          const notificationsData: NotificationResponse =
            await notificationsRes.json();
          setNotifications(notificationsData.data.notifications || []);
          setUnreadCount(notificationsData.data.unreadCount || 0);
        }
        setLoadingNotifications(false);

        // Fetch shipments
        const shipmentsRes = await fetch('/api/shipments?limit=3', {
          credentials: 'include',
        });
        if (shipmentsRes.ok) {
          const shipmentsData: ApiResponse<Shipment[]> =
            await shipmentsRes.json();
          setShipments(shipmentsData.data || []);
        }
        setLoadingShipments(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoadingDeals(false);
        setLoadingRfqs(false);
        setLoadingQuotations(false);
        setLoadingNotifications(false);
        setLoadingShipments(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalDeals = deals.length;
  const totalQuotations = quotations.length;
  const totalShipments = shipments.length;
  const totalRevenue = deals.reduce((sum, deal) => sum + deal.total_value, 0);

  const statCards = [
    {
      label: 'Active Deals',
      value: totalDeals,
    },
    {
      label: 'Quotations Sent',
      value: totalQuotations,
    },
    {
      label: 'Active Shipments',
      value: totalShipments,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
    },
  ];

  return (
    <DashboardLayout
      user={{ name: 'Supplier', initials: 'SP' }}
      isAuthenticated={true}
      userRole="seller"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Supplier Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your deals, quotations, and shipments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors"
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Deals and RFQs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Deals Table */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Active Deals</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </a>
              </div>
              {loadingDeals ? (
                <SkeletonLoader count={3} />
              ) : deals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[#242830]">
                      <tr className="text-gray-400">
                        <th className="text-left py-3 px-4">Reference</th>
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Buyer</th>
                        <th className="text-right py-3 px-4">Value</th>
                        <th className="text-left py-3 px-4">Stage</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.map((deal) => (
                        <tr
                          key={deal.id}
                          className="border-b border-[#242830] hover:bg-[#242830] transition-colors"
                        >
                          <td className="py-3 px-4 text-white font-semibold">
                            {deal.reference_number}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {deal.product_name}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {deal.buyer_name || deal.buyer_info || '-'}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-300">
                            {formatCurrency(deal.total_value)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded ${getStageColor(
                                deal.stage
                              )}`}
                            >
                              {deal.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-xs">
                            {formatRelativeDate(deal.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No active deals</p>
              )}
            </div>

            {/* Available RFQs */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Available RFQs</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </a>
              </div>
              {loadingRfqs ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : rfqs.length > 0 ? (
                <div className="space-y-4">
                  {rfqs.map((rfq) => (
                    <div
                      key={rfq.id}
                      className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#d4a843] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-2">
                            {rfq.title}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Qty: {rfq.quantity.toLocaleString()}</span>
                            <span>Budget: {rfq.max_budget ? formatCurrency(rfq.max_budget) : rfq.target_price ? formatCurrency(rfq.target_price) : 'N/A'}</span>
                            <span>Due: {rfq.required_delivery_date ? new Date(rfq.required_delivery_date).toLocaleDateString() : 'No deadline'}</span>
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm whitespace-nowrap">
                          Bid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No available RFQs</p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
                  Submit Quotation
                </button>
                <button className="w-full px-4 py-3 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm">
                  My Products
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  Active Shipments
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  Messages
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-[#c41e3a] text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {loadingNotifications ? (
                <SkeletonLoader count={2} />
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border ${
                        notif.read
                          ? 'bg-[#0c0f14] border-[#242830]'
                          : 'bg-[#0c0f14] border-[#d4a843]'
                      }`}
                    >
                      <p className="text-white text-sm font-semibold">
                        {notif.title}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {notif.message}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatRelativeDate(notif.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm">
                  No notifications
                </p>
              )}
            </div>

            {/* Active Shipments */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Active Shipments</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-xs font-semibold">
                  View All →
                </a>
              </div>
              {loadingShipments ? (
                <SkeletonLoader count={2} />
              ) : shipments.length > 0 ? (
                <div className="space-y-3">
                  {shipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]"
                    >
                      <p className="text-white text-sm font-semibold">
                        {shipment.tracking_number}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        To: {shipment.destination_port}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStageColor(
                            shipment.status
                          )}`}
                        >
                          {shipment.status}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {formatRelativeDate(shipment.estimated_arrival)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm">
                  No active shipments
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Quotations Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Quotations</h2>
            <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
              View All →
            </a>
          </div>
          {loadingQuotations ? (
            <SkeletonLoader count={4} />
          ) : quotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#242830]">
                  <tr className="text-gray-400">
                    <th className="text-left py-3 px-4">Reference</th>
                    <th className="text-right py-3 px-4">Unit Price</th>
                    <th className="text-right py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Total Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quote) => (
                    <tr
                      key={quote.id}
                      className="border-b border-[#242830] hover:bg-[#242830] transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-semibold">
                        {quote.reference_number}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {formatCurrency(quote.unit_price)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {quote.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {formatCurrency(quote.total_price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getQuotationStatusColor(
                            quote.status
                          )}`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs">
                        {formatRelativeDate(quote.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No quotations yet
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
