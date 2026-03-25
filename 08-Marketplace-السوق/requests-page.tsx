'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RequestCard from '@/components/marketplace/RequestCard';

interface PurchaseRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  quantityUnit: string;
  budget: number;
  currency: string;
  deadline: Date;
  buyerCountry: string;
  buyerName: string;
  status: 'Open' | 'Receiving Quotes' | 'Closed' | 'Awarded';
  quotationCount: number;
}

const demoPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'req-001',
    title: 'Carbon Steel Sheets - Large Volume',
    description: 'Need 50,000 tons of carbon steel flat sheets for construction projects',
    category: 'Steel & Metals',
    quantity: 50000,
    quantityUnit: 'tons',
    budget: 25000000,
    currency: 'USD',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    buyerCountry: 'Saudi Arabia',
    buyerName: 'Al-Rajhi Trading Company',
    status: 'Receiving Quotes',
    quotationCount: 5,
  },
  {
    id: 'req-002',
    title: 'Electronic Components Package',
    description: 'Seeking capacitors, resistors, and circuit boards for manufacturing',
    category: 'Electronics',
    quantity: 100000,
    quantityUnit: 'pieces',
    budget: 500000,
    currency: 'USD',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    buyerCountry: 'Kuwait',
    buyerName: 'Gulf Star Electronics',
    status: 'Receiving Quotes',
    quotationCount: 3,
  },
  {
    id: 'req-003',
    title: 'Solar Panels - 5MW Project',
    description: 'Need 12,500 units of 400W solar panels for renewable energy project',
    category: 'Solar & Renewable',
    quantity: 12500,
    quantityUnit: 'units',
    budget: 2500000,
    currency: 'USD',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    buyerCountry: 'UAE',
    buyerName: 'Emirates Steel Traders',
    status: 'Open',
    quotationCount: 2,
  },
  {
    id: 'req-004',
    title: 'Copper Wire - High Volume',
    description: 'Bulk order of copper wire for electrical installations',
    category: 'Raw Materials',
    quantity: 5000,
    quantityUnit: 'tons',
    budget: 450000,
    currency: 'USD',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    buyerCountry: 'Saudi Arabia',
    buyerName: 'Riyada Electronics Manufacturing',
    status: 'Awarded',
    quotationCount: 8,
  },
];

const categories = ['All', 'Steel & Metals', 'Electronics', 'Solar & Renewable', 'Raw Materials'];
const countries = ['All', 'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar'];
const statuses = ['All', 'Open', 'Receiving Quotes', 'Closed', 'Awarded'];

type SortOption = 'newest' | 'deadline' | 'budget' | 'quotes';

export default function PurchaseRequestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 100000000 });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    let result = demoPurchaseRequests.filter(req => {
      const matchesCategory = selectedCategory === 'All' || req.category === selectedCategory;
      const matchesCountry = selectedCountry === 'All' || req.buyerCountry === selectedCountry;
      const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;
      const matchesBudget = req.budget >= budgetRange.min && req.budget <= budgetRange.max;
      const matchesSearch =
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.buyerName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesCountry && matchesStatus && matchesBudget && matchesSearch;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.deadline.getTime() - b.deadline.getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'quotes':
          return b.quotationCount - a.quotationCount;
        case 'newest':
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCategory, selectedCountry, selectedStatus, budgetRange, sortBy, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRequests = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const daysUntilDeadline = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return days > 0 ? days : 0;
  };

  return (
    <DashboardLayout
      user={{ name: 'Supplier', initials: 'S' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Purchase Requests</h1>
            <p className="text-gray-400">Discover buying opportunities from Gulf buyers</p>
          </div>
          <button className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold hidden sm:block">
            + Post New Request
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Category</h3>
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{cat}</span>
                </label>
              ))}
            </div>

            {/* Country Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Buyer Country</h3>
              {countries.map(country => (
                <label key={country} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCountry === country}
                    onChange={() => {
                      setSelectedCountry(country);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{country}</span>
                </label>
              ))}
            </div>

            {/* Status Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Status</h3>
              {statuses.map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedStatus === status}
                    onChange={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{status}</span>
                </label>
              ))}
            </div>

            {/* Budget Range */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Budget Range (USD)</h3>
              <input
                type="number"
                placeholder="Min"
                value={budgetRange.min}
                onChange={(e) => {
                  setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={budgetRange.max}
                onChange={(e) => {
                  setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 100000000 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          {/* Requests */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-400">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} requests
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline Soon</option>
                <option value="budget">Highest Budget</option>
                <option value="quotes">Most Quotes</option>
              </select>
            </div>

            {/* Requests Grid */}
            {paginatedRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {paginatedRequests.map(request => (
                  <RequestCard
                    key={request.id}
                    request={{
                      id: request.id,
                      title: request.title,
                      description: request.description,
                      category: request.category,
                      quantity: `${request.quantity.toLocaleString()} ${request.quantityUnit}`,
                      budget: `$${(request.budget / 1000000).toFixed(1)}M`,
                      deadline: daysUntilDeadline(request.deadline),
                      buyerCountry: request.buyerCountry,
                      buyerName: request.buyerName,
                      status: request.status,
                      quotationCount: request.quotationCount,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <p className="text-gray-400">No requests found matching your filters.</p>
              </div>
            )}

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
        </div>
      </div>
    </DashboardLayout>
  );
}
