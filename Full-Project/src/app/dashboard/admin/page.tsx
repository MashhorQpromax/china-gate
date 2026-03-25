'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export default function AdminDashboardPage() {
  const statCards: StatCard[] = [
    {
      label: 'Total Users',
      value: 1247,
      change: '+85 new this month',
      changeType: 'positive',
    },
    {
      label: 'Active Deals',
      value: 342,
      change: '+28 this week',
      changeType: 'positive',
    },
    {
      label: 'Products Listed',
      value: 5821,
      change: '+234 this month',
      changeType: 'positive',
    },
    {
      label: 'Total Deal Value',
      value: '$8.5M',
      change: '+$1.2M this month',
      changeType: 'positive',
    },
    {
      label: 'Active LCs/LGs',
      value: 156,
      change: '+12 this week',
      changeType: 'positive',
    },
    {
      label: 'Quality Pass Rate',
      value: '96.8%',
      change: '+0.5% this month',
      changeType: 'positive',
    },
    {
      label: 'Active Partnerships',
      value: 89,
      change: '+15 this quarter',
      changeType: 'positive',
    },
    {
      label: 'Platform Revenue',
      value: '$425k',
      change: '+$85k this month',
      changeType: 'positive',
    },
  ];

  const quickLinks = [
    { label: 'User Management', href: '/dashboard/admin/users', icon: '👥' },
    { label: 'Product Approvals', href: '/dashboard/admin/products', icon: '📦' },
    { label: 'Deal Monitoring', href: '/dashboard/admin/deals', icon: '📊' },
    { label: 'Dispute Resolution', href: '/dashboard/admin/disputes', icon: '⚖️' },
    { label: 'Shipping Management', href: '/dashboard/admin/shipping', icon: '🚢' },
    { label: 'Platform Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];

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

        {/* Key Metrics Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
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
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Type */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Users by Type</h2>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#c41e3a" strokeWidth="10" strokeDasharray="84.8 141.4" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#d4a843" strokeWidth="10" strokeDasharray="42.3 141.4" strokeDashoffset="-84.8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray="14.3 141.4" strokeDashoffset="-127.1" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">1.2K</p>
                    <p className="text-xs text-gray-400">users</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#c41e3a] rounded-full" />
                  <span className="text-gray-300 text-sm">Buyers: 60% (720)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#d4a843] rounded-full" />
                  <span className="text-gray-300 text-sm">Suppliers: 30% (360)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                  <span className="text-gray-300 text-sm">Manufacturers: 10% (120)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deals by Stage */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Deals by Stage</h2>
            <div className="space-y-4">
              {[
                { stage: 'Request Posted', count: 45, percentage: 13.2 },
                { stage: 'Quotation Received', count: 78, percentage: 22.8 },
                { stage: 'Payment Verified', count: 95, percentage: 27.7 },
                { stage: 'Quality Inspection', count: 68, percentage: 19.9 },
                { stage: 'Completed', count: 56, percentage: 16.4 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.stage}</span>
                    <span className="text-white font-semibold text-sm">{item.count}</span>
                  </div>
                  <div className="w-full bg-[#0c0f14] rounded-full h-2 border border-[#242830]">
                    <div
                      className="bg-[#c41e3a] h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Deal Volume */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Deal Volume</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                const heights = [45, 52, 48, 67, 71, 75, 68, 82, 78, 85, 92, 88];
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#c41e3a] to-[#d4a843] rounded-t-lg transition-all hover:from-red-600 hover:to-yellow-500"
                      style={{ height: `${heights[idx]}%` }}
                      title={`${heights[idx]} deals`}
                    ></div>
                    <span className="text-gray-500 text-xs">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue by Sector */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Revenue by Sector</h2>
            <div className="space-y-4">
              {[
                { sector: 'Steel & Metals', revenue: '$3.2M', percentage: 37.6 },
                { sector: 'Electronics', revenue: '$2.1M', percentage: 24.7 },
                { sector: 'Solar & Renewable', revenue: '$1.8M', percentage: 21.2 },
                { sector: 'Machinery', revenue: '$0.9M', percentage: 10.6 },
                { sector: 'Other', revenue: '$0.5M', percentage: 5.9 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.sector}</span>
                    <span className="text-white font-semibold text-sm">{item.revenue}</span>
                  </div>
                  <div className="w-full bg-[#0c0f14] rounded-full h-2 border border-[#242830]">
                    <div
                      className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

        {/* Recent Activity */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New User Registration', detail: 'John Smith (john.smith@example.com) registered as Buyer', time: '5 min ago', type: 'info' },
              { action: 'Product Approved', detail: 'Electronic Capacitors from Shanghai Electronics approved', time: '15 min ago', type: 'success' },
              { action: 'Payment Confirmed', detail: 'Deal #2024-045 payment verified by Rajhi Bank', time: '1h ago', type: 'success' },
              { action: 'Quality Alert', detail: 'Inspection failed on shipment from Zhejiang (96% pass)', time: '2h ago', type: 'warning' },
              { action: 'Dispute Opened', detail: 'Dispute #D-2024-012 opened for Deal #2024-038', time: '3h ago', type: 'alert' },
            ].map((activity, idx) => {
              const colors: Record<string, string> = {
                info: 'border-l-blue-500 bg-blue-500/5',
                success: 'border-l-green-500 bg-green-500/5',
                warning: 'border-l-yellow-500 bg-yellow-500/5',
                alert: 'border-l-red-500 bg-red-500/5',
              };
              return (
                <div
                  key={idx}
                  className={`p-4 border-l-4 rounded bg-[#0c0f14] border-[#242830] ${colors[activity.type]}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">{activity.action}</p>
                      <p className="text-gray-400 text-sm">{activity.detail}</p>
                    </div>
                    <span className="text-gray-600 text-xs whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Alerts</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-500/10 border-l-4 border-l-blue-500 rounded">
              <p className="font-semibold text-blue-400 mb-1">ℹ️ Scheduled Maintenance</p>
              <p className="text-gray-400 text-sm">Database maintenance scheduled for March 28, 2:00 AM - 4:00 AM UTC</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border-l-4 border-l-yellow-500 rounded">
              <p className="font-semibold text-yellow-400 mb-1">⚠️ High System Load</p>
              <p className="text-gray-400 text-sm">Platform is experiencing 78% CPU usage. Consider scaling infrastructure.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
