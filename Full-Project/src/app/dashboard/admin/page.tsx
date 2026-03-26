'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface AdminStats {
  total_users: number;
  total_buyers: number;
  total_suppliers: number;
  total_manufacturers: number;
  total_deals: number;
  active_deals: number;
  total_trade_value: number;
  total_shipments: number;
  active_shipments: number;
  total_rfqs: number;
  open_rfqs: number;
  total_tickets: number;
  open_tickets: number;
  recent_deals: RecentDeal[];
  recent_users: RecentUser[];
}

interface RecentDeal {
  id: string;
  title: string;
  total_value: number;
  stage: string;
  buyer_name: string;
  supplier_name: string;
  created_at: string;
}

interface RecentUser {
  id: string;
  full_name_en: string;
  email: string;
  company_name: string;
  account_type: string;
  created_at: string;
}

// Helper function to format currency values
function formatCurrency(value: number): string {
  if (value < 1000) {
    return `$${value}`;
  } else if (value < 1000000) {
    return `$${(value / 1000).toFixed(1)}k`;
  } else {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
}

// Loading skeleton for stat cards
function StatCardSkeleton() {
  return (
    <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-[#242830] rounded w-24 mb-4"></div>
      <div className="h-8 bg-[#242830] rounded w-32 mb-2"></div>
      <div className="h-3 bg-[#242830] rounded w-28"></div>
    </div>
  );
}

// Loading skeleton for chart
function ChartSkeleton() {
  return (
    <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-[#242830] rounded w-40 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-4 bg-[#242830] rounded w-full mb-2"></div>
            <div className="h-2 bg-[#242830] rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quickLinks = [
    { label: 'User Management', href: '/dashboard/admin/users', icon: '👥' },
    { label: 'Product Approvals', href: '/dashboard/admin/products', icon: '📦' },
    { label: 'Deal Monitoring', href: '/dashboard/admin/deals', icon: '📊' },
    { label: 'Dispute Resolution', href: '/dashboard/admin/disputes', icon: '⚖️' },
    { label: 'Shipping Management', href: '/dashboard/admin/shipping', icon: '🚢' },
    { label: 'Platform Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch stats');
        }

        setStats(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate percentages for users by type
  const totalUsers = stats?.total_users || 1;
  const buyersPercentage = stats ? (stats.total_buyers / totalUsers) * 100 : 0;
  const suppliersPercentage = stats ? (stats.total_suppliers / totalUsers) * 100 : 0;
  const manufacturersPercentage = stats ? (stats.total_manufacturers / totalUsers) * 100 : 0;

  // Calculate SVG circle dasharray for users by type chart
  const circumference = 2 * Math.PI * 45; // r=45
  const buyersDasharray = (buyersPercentage / 100) * circumference;
  const suppliersDasharray = (suppliersPercentage / 100) * circumference;
  const manufacturersDasharray = (manufacturersPercentage / 100) * circumference;
  let offset = 0;

  // Stage colors for deals
  const stageColors: Record<string, string> = {
    'Request Posted': 'bg-blue-500',
    'Quotation Received': 'bg-purple-500',
    'Payment Verified': 'bg-green-500',
    'Quality Inspection': 'bg-yellow-500',
    'Completed': 'bg-emerald-500',
  };

  return (
    <DashboardLayout
      user={{ name: 'Admin', initials: 'AD' }}
      isAuthenticated={true}
      userRole="admin"
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Platform overview and management controls</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">Failed to load dashboard: {error}</p>
          </div>
        )}

        {/* Key Metrics Grid - First Row */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <StatCardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {/* Total Users */}
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                  <p className="text-gray-400 text-sm mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats?.total_users?.toLocaleString()}</p>
                </div>

                {/* Active Deals */}
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                  <p className="text-gray-400 text-sm mb-2">Active Deals</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats?.active_deals?.toLocaleString()}</p>
                </div>

                {/* Total RFQs */}
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                  <p className="text-gray-400 text-sm mb-2">Total RFQs</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats?.total_rfqs?.toLocaleString()}</p>
                </div>

                {/* Total Trade Value */}
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                  <p className="text-gray-400 text-sm mb-2">Total Trade Value</p>
                  <p className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.total_trade_value || 0)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Key Metrics Grid - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {/* Active Shipments */}
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                <p className="text-gray-400 text-sm mb-2">Active Shipments</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.active_shipments?.toLocaleString()}</p>
              </div>

              {/* Open Tickets */}
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                <p className="text-gray-400 text-sm mb-2">Open Tickets</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.open_tickets?.toLocaleString()}</p>
              </div>

              {/* Total Suppliers */}
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                <p className="text-gray-400 text-sm mb-2">Total Suppliers</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.total_suppliers?.toLocaleString()}</p>
              </div>

              {/* Total Buyers */}
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors">
                <p className="text-gray-400 text-sm mb-2">Total Buyers</p>
                <p className="text-3xl font-bold text-white mb-2">{stats?.total_buyers?.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Type */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Users by Type</h2>
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#c41e3a"
                      strokeWidth="10"
                      strokeDasharray={`${buyersDasharray} ${circumference}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#d4a843"
                      strokeWidth="10"
                      strokeDasharray={`${suppliersDasharray} ${circumference}`}
                      strokeDashoffset={`-${buyersDasharray}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="10"
                      strokeDasharray={`${manufacturersDasharray} ${circumference}`}
                      strokeDashoffset={`-${buyersDasharray + suppliersDasharray}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{(totalUsers / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-400">users</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#c41e3a] rounded-full" />
                    <span className="text-gray-300 text-sm">
                      Buyers: {buyersPercentage.toFixed(1)}% ({stats?.total_buyers?.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#d4a843] rounded-full" />
                    <span className="text-gray-300 text-sm">
                      Suppliers: {suppliersPercentage.toFixed(1)}% ({stats?.total_suppliers?.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-gray-300 text-sm">
                      Manufacturers: {manufacturersPercentage.toFixed(1)}% ({stats?.total_manufacturers?.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Deals Summary */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Deals</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {stats?.recent_deals && stats.recent_deals.length > 0 ? (
                  stats.recent_deals.slice(0, 5).map((deal) => (
                    <div key={deal.id} className="p-3 bg-[#0c0f14] rounded border border-[#242830]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{deal.title}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded text-white ${stageColors[deal.stage] || 'bg-gray-600'}`}>
                          {deal.stage}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <p>Buyer: {deal.buyer_name}</p>
                        <p>Supplier: {deal.supplier_name}</p>
                      </div>
                      <p className="text-[#d4a843] font-semibold text-sm mt-2">{formatCurrency(deal.total_value)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent deals</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Management Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#c41e3a] transition-colors text-center group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <p className="text-sm font-semibold text-white group-hover:text-[#c41e3a] transition-colors">
                  {link.label}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#242830]">
                    <th className="text-left text-gray-400 font-semibold py-3 px-4">Name</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-4">Email</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-4">Type</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_users && stats.recent_users.length > 0 ? (
                    stats.recent_users.map((user) => (
                      <tr key={user.id} className="border-b border-[#242830] hover:bg-[#242830]/50 transition-colors">
                        <td className="text-white py-3 px-4">{user.full_name_en || user.company_name || 'N/A'}</td>
                        <td className="text-gray-400 py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-[#c41e3a]/20 text-[#c41e3a]">
                            {user.account_type}
                          </span>
                        </td>
                        <td className="text-gray-400 py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-gray-400 text-center py-4">
                        No recent users
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
