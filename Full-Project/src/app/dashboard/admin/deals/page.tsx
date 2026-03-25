'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Deal {
  id: string;
  reference: string;
  buyer: string;
  supplier: string;
  amount: number;
  stage: string;
  date: string;
}

const demoDeals: Deal[] = [
  {
    id: 'deal-001',
    reference: '#2024-001',
    buyer: 'Ahmed Al-Rashid',
    supplier: 'Zhejiang Steel Manufacturing',
    amount: 125000,
    stage: 'Quality Inspection',
    date: '2024-03-22',
  },
  {
    id: 'deal-002',
    reference: '#2024-002',
    buyer: 'Mohammed Hassan',
    supplier: 'Shanghai Electronics Components',
    amount: 85000,
    stage: 'Payment Verified',
    date: '2024-03-20',
  },
  {
    id: 'deal-003',
    reference: '#2024-003',
    buyer: 'Noor Al-Otaibi',
    supplier: 'Jiangsu Solar Panel Manufacturing',
    amount: 250000,
    stage: 'Completed',
    date: '2024-03-18',
  },
  {
    id: 'deal-004',
    reference: '#2024-004',
    buyer: 'Ahmed Al-Rashid',
    supplier: 'Shanghai Electronics Components',
    amount: 95000,
    stage: 'Quotation Received',
    date: '2024-03-15',
  },
  {
    id: 'deal-005',
    reference: '#2024-005',
    buyer: 'Fatima Al-Saud',
    supplier: 'Zhejiang Steel Manufacturing',
    amount: 175000,
    stage: 'Dispute Opened',
    date: '2024-03-12',
  },
  {
    id: 'deal-006',
    reference: '#2024-006',
    buyer: 'Mohammed Hassan',
    supplier: 'Jiangsu Solar Panel Manufacturing',
    amount: 320000,
    stage: 'Completed',
    date: '2024-03-10',
  },
  {
    id: 'deal-007',
    reference: '#2024-007',
    buyer: 'Noor Al-Otaibi',
    supplier: 'Shanghai Electronics Components',
    amount: 65000,
    stage: 'Request Posted',
    date: '2024-03-08',
  },
];

const stageColors = {
  'Request Posted': 'bg-blue-500/20 text-blue-400',
  'Quotation Received': 'bg-purple-500/20 text-purple-400',
  'Payment Verified': 'bg-yellow-500/20 text-yellow-400',
  'Quality Inspection': 'bg-orange-500/20 text-orange-400',
  'Dispute Opened': 'bg-red-500/20 text-red-400',
  'Completed': 'bg-green-500/20 text-green-400',
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState(demoDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const stages = ['all', ...new Set(deals.map(d => d.stage))];

  const filtered = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch =
        deal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = filterStage === 'all' || deal.stage === filterStage;

      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, filterStage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedDeals = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalValue = filtered.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <DashboardLayout
      user={{ name: 'Admin', initials: 'AD' }}
      isAuthenticated={true}
      userRole="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deal Monitoring</h1>
          <p className="text-gray-400">Monitor and manage all active deals on the platform</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Active Deals</p>
            <p className="text-3xl font-bold text-white">{filtered.length}</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Deal Value</p>
            <p className="text-3xl font-bold text-white">${(totalValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Average Deal Value</p>
            <p className="text-3xl font-bold text-white">
              ${filtered.length > 0 ? (totalValue / filtered.length / 1000).toFixed(0) : 0}K
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by reference, buyer, or supplier..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
            />
            <select
              value={filterStage}
              onChange={(e) => {
                setFilterStage(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deals Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0c0f14] border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-4 px-6">Reference</th>
                  <th className="text-left py-4 px-6">Buyer</th>
                  <th className="text-left py-4 px-6">Supplier</th>
                  <th className="text-right py-4 px-6">Amount</th>
                  <th className="text-left py-4 px-6">Stage</th>
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeals.map((deal, idx) => (
                  <tr
                    key={deal.id}
                    className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#0c0f14]' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-white font-semibold">{deal.reference}</td>
                    <td className="py-4 px-6 text-gray-300">{deal.buyer}</td>
                    <td className="py-4 px-6 text-gray-300">{deal.supplier}</td>
                    <td className="py-4 px-6 text-right text-white font-semibold">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          stageColors[deal.stage as keyof typeof stageColors] || 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">{deal.date}</td>
                    <td className="py-4 px-6 text-right space-x-2 flex justify-end gap-2">
                      <button className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs">
                        Details
                      </button>
                      <button className="px-3 py-1 text-yellow-400 hover:text-yellow-300 text-xs">
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-[#c41e3a] text-white'
                    : 'border border-[#242830] text-white hover:bg-[#242830]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
