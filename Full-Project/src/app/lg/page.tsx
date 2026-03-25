'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_LGS, DEMO_COMPANIES, DEMO_DEALS } from '@/lib/demo-data';
import { LGStatus } from '@/types';

interface LGFilter {
  status: LGStatus | 'ALL';
  type: string;
}

export default function LGPage() {
  const [filters, setFilters] = useState<LGFilter>({
    status: 'ALL',
    type: 'ALL',
  });

  const stats = [
    { label: 'Active LGs', value: DEMO_LGS.filter(lg => lg.status !== LGStatus.EXPIRED && lg.status !== LGStatus.RELEASED).length, color: 'text-blue-400', icon: '📋' },
    { label: 'Total Value', value: `$${(DEMO_LGS.reduce((sum, lg) => sum + lg.amount, 0) / 1000000).toFixed(1)}M`, color: 'text-green-400', icon: '💰' },
    { label: 'Expiring Soon', value: DEMO_LGS.filter(lg => {
      const daysUntilExpiry = (lg.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length, color: 'text-yellow-400', icon: '⏰' },
  ];

  const filteredLGs = DEMO_LGS.filter(lg => {
    if (filters.status !== 'ALL' && lg.status !== filters.status) return false;
    if (filters.type !== 'ALL' && lg.type !== filters.type) return false;
    return true;
  });

  const getDealReference = (dealId: string) => {
    const deal = DEMO_DEALS.find(d => d.id === dealId);
    return deal?.referenceNumber || 'N/A';
  };

  const getStatusColor = (status: LGStatus) => {
    switch (status) {
      case LGStatus.ISSUED:
        return 'bg-green-500/20 text-green-300';
      case LGStatus.APPROVED:
        return 'bg-blue-500/20 text-blue-300';
      case LGStatus.BANK_REVIEW:
        return 'bg-yellow-500/20 text-yellow-300';
      case LGStatus.CLAIMED:
        return 'bg-orange-500/20 text-orange-300';
      case LGStatus.EXPIRED:
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      BID_BOND: 'Bid Bond',
      PERFORMANCE_BOND: 'Performance Bond',
      ADVANCE_PAYMENT_GUARANTEE: 'Advance Payment',
      CUSTOMS_GUARANTEE: 'Customs Guarantee',
      RETENTION_GUARANTEE: 'Retention',
    };
    return typeLabels[type] || type;
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const days = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Letter of Guarantee (LG) Management</h1>
            <p className="text-gray-400 mt-1">Manage and track your letters of guarantee</p>
          </div>
          <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            📋 Open New LG
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as LGStatus | 'ALL' })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="REQUESTED">Requested</option>
                <option value="BANK_REVIEW">Bank Review</option>
                <option value="APPROVED">Approved</option>
                <option value="ISSUED">Issued</option>
                <option value="RELEASED">Released</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Types</option>
                <option value="BID_BOND">Bid Bond</option>
                <option value="PERFORMANCE_BOND">Performance Bond</option>
                <option value="ADVANCE_PAYMENT_GUARANTEE">Advance Payment</option>
                <option value="CUSTOMS_GUARANTEE">Customs Guarantee</option>
                <option value="RETENTION_GUARANTEE">Retention</option>
              </select>
            </div>
          </div>
        </div>

        {/* LGs Table */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-[#0c0f14]">
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Deal</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Type</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Beneficiary</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Expiry</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLGs.map((lg, idx) => {
                  const daysToExpiry = getDaysUntilExpiry(lg.expiryDate);
                  const isExpirySoon = daysToExpiry <= 30 && daysToExpiry > 0;
                  const isExpired = daysToExpiry <= 0;

                  return (
                    <tr key={lg.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                      <td className="px-6 py-4 text-white font-semibold">
                        <a href={`/lg/${lg.id}`} className="text-[#d4a843] hover:text-yellow-300">{lg.referenceNumber}</a>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{getDealReference(lg.dealId)}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{getTypeLabel(lg.type)}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{lg.beneficiary}</td>
                      <td className="px-6 py-4 text-white font-semibold">
                        ${(lg.amount / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lg.status)}`}>
                          {lg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${isExpired ? 'text-red-400' : isExpirySoon ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {daysToExpiry} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/lg/${lg.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
                          View →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLGs.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No LGs found matching your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
