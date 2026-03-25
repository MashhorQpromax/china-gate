'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export default function SupplierDashboardPage() {
  const [userName] = useState('Shanghai Electronics Ltd');

  const statCards: StatCard[] = [
    {
      label: 'Products Listed',
      value: 24,
      change: '+3 this month',
      changeType: 'positive',
    },
    {
      label: 'Quotations Sent',
      value: 47,
      change: '+12 this week',
      changeType: 'positive',
    },
    {
      label: 'Active Deals',
      value: 6,
      change: '2 awaiting shipment',
      changeType: 'positive',
    },
    {
      label: 'Revenue',
      value: '$480,000',
      change: '+$125,000 this month',
      changeType: 'positive',
    },
  ];

  return (
    <DashboardLayout
      user={{ name: 'Shanghai Electronics', initials: 'SE' }}
      isAuthenticated={true}
      userRole="seller"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-400">
            Here's an overview of your sales activities
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
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              {stat.change && (
                <p
                  className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {stat.change}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Product Views */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Product Views</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </a>
              </div>
              <div className="space-y-4">
                {[
                  { product: 'Electronic Capacitors', views: 145, buyers: 23, status: 'High Interest' },
                  { product: 'LED Components', views: 98, buyers: 15, status: 'Medium Interest' },
                  { product: 'Power Supplies', views: 67, buyers: 8, status: 'Medium Interest' },
                  { product: 'Circuit Boards', views: 234, buyers: 31, status: 'High Interest' },
                  { product: 'Connectors & Cables', views: 45, buyers: 5, status: 'Low Interest' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg hover:bg-[#1a1d23] transition-colors border border-transparent hover:border-[#242830]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-2">{item.product}</p>
                      <p className="text-gray-400 text-sm">{item.views} views • {item.buyers} unique buyers</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        item.status === 'High Interest'
                          ? 'bg-green-500/20 text-green-400'
                          : item.status === 'Medium Interest'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
                  + Add Product
                </button>
                <button className="w-full px-4 py-3 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm">
                  View Requests
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  My Deals
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  Messages
                </button>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">👁️ 12 New Views</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Electronic Capacitors was viewed 12 times
                  </p>
                  <p className="text-gray-600 text-xs mt-1">1h ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">💬 New Request</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Buyer interested in LED Components
                  </p>
                  <p className="text-gray-600 text-xs mt-1">3h ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">📊 Quote Accepted</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Your quotation for Power Supplies accepted
                  </p>
                  <p className="text-gray-600 text-xs mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Purchase Requests */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">New Requests Matching Your Products</h2>
          <div className="space-y-4">
            {[
              { product: 'Electronic Capacitors', qty: '50000 units', buyer: 'Ahmed Al-Rashid', posted: '2h ago' },
              { product: 'LED Components', qty: '10000 units', buyer: 'Riyadh Manufacturing', posted: '5h ago' },
              { product: 'Power Supplies', qty: '500 units', buyer: 'Dubai Electronics', posted: '1 day ago' },
              { product: 'Circuit Boards', qty: '2000 units', buyer: 'Saudi Tech Solutions', posted: '2 days ago' },
            ].map((req, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#d4a843] transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">{req.product}</p>
                  <p className="text-gray-400 text-sm">{req.qty} • From: {req.buyer}</p>
                  <p className="text-gray-600 text-xs mt-1">Posted {req.posted}</p>
                </div>
                <button className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm whitespace-nowrap ml-4">
                  Send Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quotations */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Active Quotations Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-3 px-4">Buyer</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Sent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { buyer: 'Ahmed Al-Rashid', product: 'Capacitors', qty: 50000, status: 'Pending', sent: '3h ago' },
                  { buyer: 'Riyadh Mfg', product: 'LED Components', qty: 10000, status: 'Viewed', sent: '1 day ago' },
                  { buyer: 'Dubai Electronics', product: 'Power Supplies', qty: 500, status: 'Accepted', sent: '2 days ago' },
                  { buyer: 'Saudi Tech', product: 'Circuit Boards', qty: 2000, status: 'Pending', sent: '3 days ago' },
                ].map((quote, idx) => (
                  <tr key={idx} className="border-b border-[#242830] hover:bg-[#242830] transition-colors">
                    <td className="py-3 px-4 text-white font-semibold">{quote.buyer}</td>
                    <td className="py-3 px-4 text-gray-300">{quote.product}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{quote.qty.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          quote.status === 'Accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : quote.status === 'Viewed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 text-xs">{quote.sent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
