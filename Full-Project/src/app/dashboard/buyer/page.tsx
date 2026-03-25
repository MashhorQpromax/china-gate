'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

interface RecentDeal {
  id: string;
  referenceNo: string;
  supplier: string;
  amount: number;
  stage: string;
  date: string;
}

const recentDeals: RecentDeal[] = [
  {
    id: 'deal-001',
    referenceNo: '#2024-001',
    supplier: 'Zhejiang Steel Manufacturing',
    amount: 125000,
    stage: 'Quality Inspection',
    date: '2024-03-22',
  },
  {
    id: 'deal-002',
    referenceNo: '#2024-002',
    supplier: 'Shanghai Electronics Components',
    amount: 85000,
    stage: 'Payment Verified',
    date: '2024-03-20',
  },
  {
    id: 'deal-003',
    referenceNo: '#2024-003',
    supplier: 'Jiangsu Solar Panel Manufacturing',
    amount: 250000,
    stage: 'Completed',
    date: '2024-03-18',
  },
  {
    id: 'deal-004',
    referenceNo: '#2024-004',
    supplier: 'Zhejiang Steel Manufacturing',
    amount: 95000,
    stage: 'Quotation Received',
    date: '2024-03-15',
  },
  {
    id: 'deal-005',
    referenceNo: '#2024-005',
    supplier: 'Shanghai Electronics Components',
    amount: 55000,
    stage: 'Request Posted',
    date: '2024-03-12',
  },
];

const stageColors: Record<string, string> = {
  'Request Posted': 'bg-blue-500/20 text-blue-400',
  'Quotation Received': 'bg-purple-500/20 text-purple-400',
  'Payment Verified': 'bg-yellow-500/20 text-yellow-400',
  'Quality Inspection': 'bg-orange-500/20 text-orange-400',
  'Completed': 'bg-green-500/20 text-green-400',
};

export default function BuyerDashboardPage() {
  const [userName] = useState('Ahmed Al-Rashid');

  const statCards: StatCard[] = [
    {
      label: 'Active Deals',
      value: 8,
      change: '+2 this month',
      changeType: 'positive',
    },
    {
      label: 'Open Requests',
      value: 5,
      change: '3 awaiting quotes',
      changeType: 'positive',
    },
    {
      label: 'Pending Quotations',
      value: 12,
      change: '+4 this week',
      changeType: 'positive',
    },
    {
      label: 'Total Spend',
      value: '$610,000',
      change: '+$85,000 this month',
      changeType: 'positive',
    },
  ];

  return (
    <DashboardLayout
      user={{ name: userName, initials: 'AR' }}
      isAuthenticated={true}
      userRole="buyer"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your buying activities today
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
          {/* Recent Deals */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Deals</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </a>
              </div>
              <div className="space-y-4">
                {recentDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg hover:bg-[#1a1d23] transition-colors border border-transparent hover:border-[#242830]"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-white">{deal.referenceNo}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            stageColors[deal.stage] || 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {deal.stage}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{deal.supplier}</p>
                      <p className="text-gray-600 text-xs mt-1">{deal.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">${deal.amount.toLocaleString()}</p>
                    </div>
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
                  + Post Request
                </button>
                <button className="w-full px-4 py-3 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm">
                  Browse Products
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  View Deals
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  Messages
                </button>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <span className="bg-[#c41e3a] text-white text-xs rounded-full px-2 py-1">3</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#c41e3a]">
                  <p className="text-white text-sm font-semibold">📋 New Quotation</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Ahmed sent quotation for steel pipes
                  </p>
                  <p className="text-gray-600 text-xs mt-1">5m ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border-l-2 border-l-[#c41e3a]">
                  <p className="text-white text-sm font-semibold">📊 Deal Updated</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Deal #2024-001 moved to Quality Inspection
                  </p>
                  <p className="text-gray-600 text-xs mt-1">2h ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border-l-2 border-l-[#c41e3a]">
                  <p className="text-white text-sm font-semibold">💬 New Message</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Sarah Chen replied to your inquiry
                  </p>
                  <p className="text-gray-600 text-xs mt-1">4h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchase Requests */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Purchase Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Carbon Steel Sheets', qty: '5000 tons', status: 'Active', date: '2 days ago' },
              { name: 'Electronic Capacitors', qty: '50000 units', status: 'Quoting', date: '5 days ago' },
              { name: 'Solar Panels 400W', qty: '200 units', status: 'Completed', date: '1 week ago' },
              { name: 'Copper Wire (MM2)', qty: '1000 kg', status: 'Active', date: '1 week ago' },
            ].map((req, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#d4a843] transition-colors"
              >
                <p className="font-semibold text-white mb-2">{req.name}</p>
                <p className="text-gray-400 text-sm mb-3">{req.qty}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      req.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : req.status === 'Quoting'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {req.status}
                  </span>
                  <p className="text-gray-600 text-xs">{req.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Quotations Received</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-3 px-4">Supplier</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-right py-3 px-4">Unit Price</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { supplier: 'Zhejiang Steel', product: 'Steel Pipes', price: 125, qty: 5000, total: 625000 },
                  { supplier: 'Shanghai Electronics', product: 'Capacitors', price: 2.5, qty: 50000, total: 125000 },
                  { supplier: 'Jiangsu Solar', product: 'Solar Panels', price: 200, qty: 200, total: 40000 },
                ].map((quote, idx) => (
                  <tr key={idx} className="border-b border-[#242830] hover:bg-[#242830] transition-colors">
                    <td className="py-3 px-4 text-white font-semibold">{quote.supplier}</td>
                    <td className="py-3 px-4 text-gray-300">{quote.product}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${quote.price}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{quote.qty.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-white font-semibold">${quote.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[#c41e3a] hover:text-red-600 font-semibold">View</button>
                    </td>
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
