'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DealCard from '@/components/deals/DealCard';
import { DEMO_DEALS, DEMO_COMPANIES } from '@/lib/demo-data';
import { DealStage, Deal } from '@/types';

interface DealFilter {
  stage: DealStage | 'ALL';
  dateRange: 'all' | '7d' | '30d' | '90d';
  amountRange: 'all' | '0-100k' | '100k-500k' | '500k-1m' | '1m+';
}

export default function DealsPage() {
  const [filters, setFilters] = useState<DealFilter>({
    stage: 'ALL',
    dateRange: 'all',
    amountRange: 'all',
  });

  // Calculate stats
  const activeDealCount = DEMO_DEALS.filter(d => d.stage !== DealStage.COMPLETED).length;
  const totalValue = DEMO_DEALS.reduce((sum, d) => sum + d.totalValue, 0);
  const completedThisMonth = DEMO_DEALS.filter(d => d.stage === DealStage.COMPLETED && d.updatedAt.getMonth() === new Date().getMonth()).length;
  const avgCompletionTime = 45; // Demo data

  const stats = [
    { label: 'Active Deals', value: activeDealCount, color: 'text-blue-400', icon: '📊' },
    { label: 'Total Value', value: `$${(totalValue / 1000000).toFixed(1)}M`, color: 'text-green-400', icon: '💰' },
    { label: 'Completed This Month', value: completedThisMonth, color: 'text-emerald-400', icon: '✓' },
    { label: 'Avg Completion Time', value: `${avgCompletionTime} days`, color: 'text-purple-400', icon: '⏱️' },
  ];

  // Filter deals
  const filteredDeals = DEMO_DEALS.filter(deal => {
    if (filters.stage !== 'ALL' && deal.stage !== filters.stage) return false;

    if (filters.amountRange !== 'all') {
      const ranges: Record<string, [number, number]> = {
        '0-100k': [0, 100000],
        '100k-500k': [100000, 500000],
        '500k-1m': [500000, 1000000],
        '1m+': [1000000, Infinity],
      };
      const [min, max] = ranges[filters.amountRange];
      if (deal.totalValue < min || deal.totalValue > max) return false;
    }

    return true;
  });

  const stageLabels: Record<DealStage, string> = {
    [DealStage.NEGOTIATION]: 'Negotiation',
    [DealStage.QUOTATION_SENT]: 'Quote Sent',
    [DealStage.QUOTATION_REVIEW]: 'Quote Review',
    [DealStage.QUOTATION_ACCEPTED]: 'Quote Accepted',
    [DealStage.PO_ISSUED]: 'PO Issued',
    [DealStage.PO_CONFIRMED]: 'PO Confirmed',
    [DealStage.PRODUCTION_START]: 'Production',
    [DealStage.PRODUCTION_INSPECTION]: 'Quality Check',
    [DealStage.READY_FOR_SHIPMENT]: 'Ready to Ship',
    [DealStage.LC_ISSUED]: 'LC Issued',
    [DealStage.GOODS_SHIPPED]: 'Shipped',
    [DealStage.GOODS_IN_TRANSIT]: 'In Transit',
    [DealStage.PORT_ARRIVED]: 'Port Arrived',
    [DealStage.CUSTOMS_CLEARANCE]: 'Customs',
    [DealStage.DELIVERY]: 'Delivery',
    [DealStage.COMPLETED]: 'Completed',
  };

  const stageOrder = [
    DealStage.NEGOTIATION,
    DealStage.QUOTATION_SENT,
    DealStage.QUOTATION_REVIEW,
    DealStage.QUOTATION_ACCEPTED,
    DealStage.PO_ISSUED,
    DealStage.PO_CONFIRMED,
    DealStage.PRODUCTION_START,
    DealStage.PRODUCTION_INSPECTION,
    DealStage.READY_FOR_SHIPMENT,
    DealStage.LC_ISSUED,
    DealStage.GOODS_SHIPPED,
    DealStage.GOODS_IN_TRANSIT,
    DealStage.PORT_ARRIVED,
    DealStage.CUSTOMS_CLEARANCE,
    DealStage.DELIVERY,
    DealStage.COMPLETED,
  ];

  const getStageProgress = (stage: DealStage) => {
    return ((stageOrder.indexOf(stage) + 1) / stageOrder.length) * 100;
  };

  const getStageColor = (stage: DealStage) => {
    const index = stageOrder.indexOf(stage);
    if (index <= 3) return 'bg-orange-500/20 text-orange-300';
    if (index <= 6) return 'bg-yellow-500/20 text-yellow-300';
    if (index <= 10) return 'bg-blue-500/20 text-blue-300';
    if (index <= 14) return 'bg-purple-500/20 text-purple-300';
    return 'bg-green-500/20 text-green-300';
  };

  const getBuyerName = (buyerId: string) => {
    const buyer = DEMO_COMPANIES.find(c => c.id === buyerId);
    return buyer?.nameEn || 'Unknown';
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = DEMO_COMPANIES.find(c => c.id === supplierId);
    return supplier?.nameEn || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Deal Management</h1>
            <p className="text-gray-400 mt-1">Track and manage your trading deals</p>
          </div>
          <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            ➕ New Deal
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Deal Stage</label>
              <select
                value={filters.stage}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value as DealStage | 'ALL' })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Stages</option>
                {stageOrder.map(stage => (
                  <option key={stage} value={stage}>{stageLabels[stage]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Amount Range</label>
              <select
                value={filters.amountRange}
                onChange={(e) => setFilters({ ...filters, amountRange: e.target.value as any })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="all">All Amounts</option>
                <option value="0-100k">$0 - $100K</option>
                <option value="100k-500k">$100K - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m+">$1M+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deals Table */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-[#0c0f14]">
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Buyer / Supplier</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Stage</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Progress</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Last Updated</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal, idx) => (
                  <tr key={deal.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                    <td className="px-6 py-4 text-white font-semibold">
                      <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300">{deal.referenceNumber}</a>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="text-sm">{getBuyerName(deal.buyerId)}</div>
                      <div className="text-xs text-gray-500">→ {getSupplierName(deal.supplierId)}</div>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ${(deal.totalValue / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(deal.stage)}`}>
                        {stageLabels[deal.stage]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#c41e3a] h-2 rounded-full transition-all"
                          style={{ width: `${getStageProgress(deal.stage)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{Math.round(getStageProgress(deal.stage))}%</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {deal.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/deals/${deal.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredDeals.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No deals found matching your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
