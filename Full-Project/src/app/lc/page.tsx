'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_LCS, DEMO_COMPANIES, DEMO_DEALS } from '@/lib/demo-data';
import { LCStatus } from '@/types';

interface LCFilter {
  status: LCStatus | 'ALL';
  type: string;
}

export default function LCPage() {
  const [filters, setFilters] = useState<LCFilter>({
    status: 'ALL',
    type: 'ALL',
  });

  const stats = [
    { label: 'Active LCs', value: DEMO_LCS.filter(lc => lc.status !== LCStatus.EXPIRED && lc.status !== LCStatus.CANCELLED).length, color: 'text-blue-400', icon: '📄' },
    { label: 'Total Value', value: `$${(DEMO_LCS.reduce((sum, lc) => sum + lc.amount, 0) / 1000000).toFixed(1)}M`, color: 'text-green-400', icon: '💰' },
    { label: 'Expiring Soon', value: DEMO_LCS.filter(lc => {
      const daysUntilExpiry = (lc.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length, color: 'text-yellow-400', icon: '⏰' },
    { label: 'Documents Pending', value: 3, color: 'text-orange-400', icon: '📋' },
  ];

  const filteredLCs = DEMO_LCS.filter(lc => {
    if (filters.status !== 'ALL' && lc.status !== filters.status) return false;
    if (filters.type !== 'ALL' && lc.type !== filters.type) return false;
    return true;
  });

  const getDealReference = (dealId: string) => {
    const deal = DEMO_DEALS.find(d => d.id === dealId);
    return deal?.referenceNumber || 'N/A';
  };

  const getCompanyName = (companyId: string) => {
    const company = DEMO_COMPANIES.find(c => c.id === companyId);
    return company?.nameEn || 'Unknown';
  };

  const getStatusColor = (status: LCStatus) => {
    switch (status) {
      case LCStatus.ISSUED:
        return 'bg-green-500/20 text-green-300';
      case LCStatus.APPROVED:
        return 'bg-blue-500/20 text-blue-300';
      case LCStatus.UNDER_REVIEW:
        return 'bg-yellow-500/20 text-yellow-300';
      case LCStatus.AMENDMENT_REQUESTED:
        return 'bg-orange-500/20 text-orange-300';
      case LCStatus.EXPIRED:
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
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
            <h1 className="text-3xl font-bold text-white">Letter of Credit (LC) Management</h1>
            <p className="text-gray-400 mt-1">Manage and track your letters of credit</p>
          </div>
          <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            📄 Open New LC
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                onChange={(e) => setFilters({ ...filters, status: e.target.value as LCStatus | 'ALL' })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="REQUESTED">Requested</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="ISSUED">Issued</option>
                <option value="ACCEPTED">Accepted</option>
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
                <option value="IRREVOCABLE">Irrevocable</option>
                <option value="REVOCABLE">Revocable</option>
                <option value="STANDBY">Standby</option>
                <option value="REVOLVING">Revolving</option>
                <option value="BACK_TO_BACK">Back-to-Back</option>
                <option value="TRANSFERABLE">Transferable</option>
              </select>
            </div>
          </div>
        </div>

        {/* LCs Table */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-[#0c0f14]">
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Deal</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Applicant</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Beneficiary</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Type</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Expiry</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLCs.map((lc, idx) => {
                  const daysToExpiry = getDaysUntilExpiry(lc.expiryDate);
                  const isExpirySoon = daysToExpiry <= 30 && daysToExpiry > 0;
                  const isExpired = daysToExpiry <= 0;

                  return (
                    <tr key={lc.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                      <td className="px-6 py-4 text-white font-semibold">
                        <a href={`/lc/${lc.id}`} className="text-[#d4a843] hover:text-yellow-300">{lc.referenceNumber}</a>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{getDealReference(lc.dealId)}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{getCompanyName(lc.buyerId)}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{getCompanyName(lc.supplierId)}</td>
                      <td className="px-6 py-4 text-white font-semibold">
                        ${(lc.amount / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{lc.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lc.status)}`}>
                          {lc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${isExpired ? 'text-red-400' : isExpirySoon ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {daysToExpiry} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/lc/${lc.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
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

        {filteredLCs.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No LCs found matching your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
