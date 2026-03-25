'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export default function ManufacturerDashboardPage() {
  const [userName] = useState('Zhejiang Heavy Industries');

  const statCards: StatCard[] = [
    {
      label: 'Active Partnerships',
      value: 12,
      change: '+2 this quarter',
      changeType: 'positive',
    },
    {
      label: 'Workers on Loan',
      value: 287,
      change: '+45 this month',
      changeType: 'positive',
    },
    {
      label: 'Training Programs',
      value: 6,
      change: '2 active now',
      changeType: 'positive',
    },
    {
      label: 'Capacity Usage',
      value: '78%',
      change: '+12% this month',
      changeType: 'positive',
    },
  ];

  return (
    <DashboardLayout
      user={{ name: 'Zhejiang Heavy', initials: 'ZH' }}
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
            Manage your partnerships and labor lending programs
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
          {/* Partnership Requests/Offers */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Partnership Requests & Offers</h2>
                <a href="#" className="text-[#c41e3a] hover:text-red-600 text-sm font-semibold">
                  View All →
                </a>
              </div>
              <div className="space-y-4">
                {[
                  { company: 'Saudi Manufacturing Group', type: 'Labor Lending', workers: 50, status: 'Pending', date: '2 days ago' },
                  { company: 'Riyadh Electronics Ltd', type: 'Training Program', workers: 30, status: 'Active', date: '5 days ago' },
                  { company: 'Dubai Industrial Corp', type: 'Labor Lending', workers: 75, status: 'Active', date: '1 week ago' },
                  { company: 'Emirates Manufacturing', type: 'Technology Transfer', workers: 20, status: 'In Negotiation', date: '1 week ago' },
                  { company: 'Kuwait Industrial Works', type: 'Labor Lending', workers: 60, status: 'Active', date: '2 weeks ago' },
                ].map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg hover:bg-[#1a1d23] transition-colors border border-transparent hover:border-[#242830]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">{req.company}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{req.type}</span>
                        <span>•</span>
                        <span>{req.workers} workers</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">{req.date}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
                        req.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : req.status === 'Pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {req.status}
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
                  + Post Partnership
                </button>
                <button className="w-full px-4 py-3 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold text-sm">
                  Browse Suppliers
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  My Partnerships
                </button>
                <button className="w-full px-4 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm">
                  Messages
                </button>
              </div>
            </div>

            {/* Latest Updates */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Latest Updates</h2>
              <div className="space-y-3">
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">✅ New Workers</p>
                  <p className="text-gray-400 text-xs mt-1">
                    45 workers registered for Dubai project
                  </p>
                  <p className="text-gray-600 text-xs mt-1">4h ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">📚 Training Started</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Advanced Manufacturing batch begun
                  </p>
                  <p className="text-gray-600 text-xs mt-1">1 day ago</p>
                </div>
                <div className="p-3 bg-[#0c0f14] rounded-lg border border-[#242830]">
                  <p className="text-white text-sm font-semibold">🤝 Partnership Confirmed</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Riyadh Electronics approved labor agreement
                  </p>
                  <p className="text-gray-600 text-xs mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Labor Lending Agreements */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Active Labor Lending Agreements</h2>
          <div className="space-y-4">
            {[
              { partner: 'Riyadh Electronics Ltd', workers: 30, role: 'Assembly Technicians', duration: '6 months', deployed: '2 months ago' },
              { partner: 'Dubai Industrial Corp', workers: 75, role: 'Production Workers', duration: '12 months', deployed: '3 months ago' },
              { partner: 'Kuwait Industrial Works', workers: 60, role: 'Maintenance Engineers', duration: '8 months', deployed: '5 months ago' },
              { partner: 'Emirates Manufacturing', workers: 45, role: 'QA Inspectors', duration: '4 months', deployed: '1 month ago' },
            ].map((agreement, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830] hover:border-[#d4a843] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">{agreement.partner}</p>
                    <p className="text-gray-400 text-sm mb-2">{agreement.workers} {agreement.role}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Duration: {agreement.duration}</span>
                      <span>•</span>
                      <span>Deployed: {agreement.deployed}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-2 border border-[#242830] text-white rounded text-xs hover:bg-[#242830] transition-colors">
                      Details
                    </button>
                    <button className="px-3 py-2 border border-[#242830] text-white rounded text-xs hover:bg-[#242830] transition-colors">
                      Reports
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[#0c0f14] rounded-full h-2 border border-[#242830]">
                  <div className="bg-[#d4a843] h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Programs */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Training Programs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-3 px-4">Program Name</th>
                  <th className="text-right py-3 px-4">Participants</th>
                  <th className="text-left py-3 px-4">Duration</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Progress</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Advanced Manufacturing', participants: 45, duration: '3 months', status: 'Active', progress: 60 },
                  { name: 'Quality Assurance Certification', participants: 32, duration: '2 months', status: 'Active', progress: 40 },
                  { name: 'Leadership Development', participants: 18, duration: '4 months', status: 'In Planning', progress: 0 },
                  { name: 'Technical Maintenance', participants: 50, duration: '3 months', status: 'Completed', progress: 100 },
                ].map((program, idx) => (
                  <tr key={idx} className="border-b border-[#242830] hover:bg-[#242830] transition-colors">
                    <td className="py-3 px-4 text-white font-semibold">{program.name}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{program.participants}</td>
                    <td className="py-3 px-4 text-gray-300">{program.duration}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          program.status === 'Active'
                            ? 'bg-green-500/20 text-green-400'
                            : program.status === 'Completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#0c0f14] rounded-full h-2 border border-[#242830]">
                          <div
                            className="bg-[#c41e3a] h-2 rounded-full"
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{program.progress}%</span>
                      </div>
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
