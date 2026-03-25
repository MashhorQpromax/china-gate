'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Quotation {
  id: string;
  referenceNumber: string;
  requestTitle: string;
  buyerOrSupplierName: string;
  price: number;
  quantity: number;
  currency: string;
  status: 'Pending' | 'Accepted' | 'Negotiating' | 'Rejected';
  dateSubmitted: Date;
  validity: Date;
  leadTime: number;
}

const demoQuotations: Quotation[] = [
  {
    id: 'quote-001',
    referenceNumber: 'QT-2024-001',
    requestTitle: 'Carbon Steel Sheets - Large Volume',
    buyerOrSupplierName: 'Al-Rajhi Trading Company',
    price: 25750000,
    quantity: 50000,
    currency: 'USD',
    status: 'Pending',
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    validity: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    leadTime: 35,
  },
  {
    id: 'quote-002',
    referenceNumber: 'QT-2024-002',
    requestTitle: 'Electronic Components Package',
    buyerOrSupplierName: 'Gulf Star Electronics',
    price: 450000,
    quantity: 100000,
    currency: 'USD',
    status: 'Accepted',
    dateSubmitted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    validity: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    leadTime: 28,
  },
  {
    id: 'quote-003',
    referenceNumber: 'QT-2024-003',
    requestTitle: 'Solar Panels - 5MW Project',
    buyerOrSupplierName: 'Emirates Steel Traders',
    price: 2500000,
    quantity: 12500,
    currency: 'USD',
    status: 'Negotiating',
    dateSubmitted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    validity: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    leadTime: 60,
  },
  {
    id: 'quote-004',
    referenceNumber: 'QT-2024-004',
    requestTitle: 'Copper Wire - High Volume',
    buyerOrSupplierName: 'Riyada Electronics Manufacturing',
    price: 400000,
    quantity: 5000,
    currency: 'USD',
    status: 'Rejected',
    dateSubmitted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    validity: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    leadTime: 45,
  },
  {
    id: 'quote-005',
    referenceNumber: 'QT-2024-005',
    requestTitle: 'Carbon Steel Sheets - Large Volume',
    buyerOrSupplierName: 'Al-Rajhi Trading Company',
    price: 25400000,
    quantity: 50000,
    currency: 'USD',
    status: 'Pending',
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    validity: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    leadTime: 40,
  },
];

type SortOption = 'date' | 'price' | 'status';
type StatusFilter = 'All' | 'Pending' | 'Accepted' | 'Negotiating' | 'Rejected';

const statusColors = {
  'Pending': { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-400' },
  'Accepted': { bg: 'bg-green-600 bg-opacity-20', text: 'text-green-400' },
  'Negotiating': { bg: 'bg-blue-600 bg-opacity-20', text: 'text-blue-400' },
  'Rejected': { bg: 'bg-red-600 bg-opacity-20', text: 'text-red-400' },
};

export default function QuotationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    let result = demoQuotations.filter(quote => {
      const matchesStatus = selectedStatus === 'All' || quote.status === selectedStatus;
      const matchesSearch =
        quote.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.buyerOrSupplierName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return b.dateSubmitted.getTime() - a.dateSubmitted.getTime();
      }
    });

    return result;
  }, [selectedStatus, sortBy, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedQuotations = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusCounts = {
    Pending: demoQuotations.filter(q => q.status === 'Pending').length,
    Accepted: demoQuotations.filter(q => q.status === 'Accepted').length,
    Negotiating: demoQuotations.filter(q => q.status === 'Negotiating').length,
    Rejected: demoQuotations.filter(q => q.status === 'Rejected').length,
  };

  return (
    <DashboardLayout
      user={{ name: 'Company', initials: 'CO' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quotations</h1>
          <p className="text-gray-400">Track and manage your submitted and received quotations</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.entries(statusCounts) as [StatusFilter, number][]).map(([status, count]) => (
            <div
              key={status}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedStatus === status
                  ? 'bg-[#c41e3a] border-[#c41e3a]'
                  : 'bg-[#1a1d23] border-[#242830] hover:border-[#d4a843]'
              }`}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
            >
              <p className={`text-sm font-semibold ${selectedStatus === status ? 'text-white' : 'text-gray-400'}`}>
                {status}
              </p>
              <p className={`text-2xl font-bold mt-1 ${selectedStatus === status ? 'text-white' : 'text-white'}`}>
                {count}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search by reference, title, or name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors min-w-[150px]"
          >
            <option value="date">Newest First</option>
            <option value="price">Highest Price</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Quotations Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0c0f14] border-b border-[#242830]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Request Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Party</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242830]">
                {paginatedQuotations.map((quote) => {
                  const isExpired = quote.validity < new Date();
                  return (
                    <tr
                      key={quote.id}
                      className="hover:bg-[#242830] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold text-sm">{quote.referenceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{quote.requestTitle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{quote.buyerOrSupplierName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold text-sm">
                          ${quote.price.toLocaleString()} {quote.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              statusColors[quote.status as keyof typeof statusColors].bg
                            } ${statusColors[quote.status as keyof typeof statusColors].text}`}
                          >
                            {quote.status}
                          </span>
                          {isExpired && (
                            <span className="text-xs text-red-400">Expired</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">
                          {quote.dateSubmitted.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded text-xs hover:bg-opacity-30 transition-colors">
                            View
                          </button>
                          {quote.status === 'Pending' && (
                            <button className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded text-xs hover:bg-opacity-30 transition-colors">
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
