'use client';

import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface CustomsClearance {
  id: string;
  reference_number: string;
  shipment_id: string;
  importer_id: string;
  customs_agent_id: string;
  import_country: string;
  hs_code: string;
  declared_value: number;
  currency: string;
  duty_rate: number;
  estimated_duty: number;
  actual_duty: number | null;
  vat_rate: number;
  estimated_vat: number;
  actual_vat: number | null;
  other_fees: number;
  total_charges: number;
  status: string;
  created_at: string;
}

interface CustomsFilter {
  status: string;
}

interface DutyCalculatorInput {
  cifValue: number;
  country: string;
}

interface PageData {
  data: CustomsClearance[];
  page: number;
  limit: number;
  total: number;
}

export default function CustomsPage() {
  const [filters, setFilters] = useState<CustomsFilter>({
    status: 'ALL',
  });

  const [calculator, setCalculator] = useState<DutyCalculatorInput>({
    cifValue: 0,
    country: 'SA',
  });

  const [pageData, setPageData] = useState<PageData>({
    data: [],
    page: 1,
    limit: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryOptions = [
    { code: 'SA', name: 'Saudi Arabia', vat: 15 },
    { code: 'AE', name: 'United Arab Emirates', vat: 5 },
    { code: 'KW', name: 'Kuwait', vat: 0 },
    { code: 'QA', name: 'Qatar', vat: 5 },
    { code: 'BH', name: 'Bahrain', vat: 0 },
    { code: 'OM', name: 'Oman', vat: 0 },
    { code: 'CN', name: 'China', vat: 13 },
  ];

  const customsDutyRate = 5;

  const fetchClearances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('page', pageData.page.toString());
      params.append('limit', pageData.limit.toString());

      if (filters.status !== 'ALL') {
        params.append('status', filters.status);
      }

      const response = await fetch(`/api/customs?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customs clearances: ${response.statusText}`);
      }

      const result = await response.json();

      setPageData({
        data: result.data || [],
        page: result.pagination?.page || 1,
        limit: result.pagination?.limit || 10,
        total: result.pagination?.total || 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customs clearances';
      setError(message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [pageData.page, pageData.limit, filters]);

  useEffect(() => {
    fetchClearances();
  }, [filters]);

  const calculateDuties = () => {
    if (!calculator.country || calculator.cifValue === 0) return null;

    const selectedCountry = countryOptions.find(c => c.code === calculator.country);
    const vatRate = selectedCountry?.vat || 0;

    const dutyAmount = (calculator.cifValue * customsDutyRate) / 100;
    const vatBase = calculator.cifValue + dutyAmount;
    const vatAmount = (vatBase * vatRate) / 100;
    const totalCost = calculator.cifValue + dutyAmount + vatAmount;

    return {
      cifValue: calculator.cifValue,
      duty: dutyAmount,
      dutyRate: customsDutyRate,
      vat: vatAmount,
      vatRate: vatRate,
      total: totalCost,
    };
  };

  const duties = calculateDuties();

  const statusFlow = [
    { status: 'Pending', icon: '⏳' },
    { status: 'Documents Submitted', icon: '📋' },
    { status: 'Under Review', icon: '🔍' },
    { status: 'Inspection Required', icon: '🔎' },
    { status: 'Duties Assessed', icon: '💰' },
    { status: 'Payment Pending', icon: '⏰' },
    { status: 'Cleared', icon: '✅' },
    { status: 'Released', icon: '📦' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'documents_submitted':
        return 'bg-blue-500/20 text-blue-300';
      case 'under_review':
        return 'bg-purple-500/20 text-purple-300';
      case 'inspection_required':
        return 'bg-orange-500/20 text-orange-300';
      case 'duties_assessed':
        return 'bg-cyan-500/20 text-cyan-300';
      case 'payment_pending':
        return 'bg-red-500/20 text-red-300';
      case 'cleared':
        return 'bg-green-500/20 text-green-300';
      case 'released':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'held':
        return 'bg-red-600/20 text-red-400';
      case 'rejected':
        return 'bg-red-700/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      documents_submitted: 'Documents Submitted',
      under_review: 'Under Review',
      inspection_required: 'Inspection Required',
      duties_assessed: 'Duties Assessed',
      payment_pending: 'Payment Pending',
      cleared: 'Cleared',
      released: 'Released',
      held: 'Held',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Customs Clearance Management</h1>
            <p className="text-gray-400 mt-1">Manage and track customs declarations and duties</p>
          </div>
        </div>

        {/* FASAH Integration Banner */}
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-blue-300">
          <p className="font-semibold">FASAH Integration</p>
          <p className="text-sm mt-1">Integration with Saudi customs (FASAH) coming soon for automated clearance tracking</p>
        </div>

        {/* Customs Duty Calculator */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Customs Duty Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">CIF Value (USD)</label>
              <input
                type="number"
                value={calculator.cifValue || ''}
                onChange={(e) => setCalculator({ ...calculator, cifValue: parseFloat(e.target.value) || 0 })}
                placeholder="Enter CIF value..."
                className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Country of Import</label>
              <select
                value={calculator.country}
                onChange={(e) => setCalculator({ ...calculator, country: e.target.value })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="">Select Country</option>
                {countryOptions.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>

          {duties && (
            <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-4">Estimated Costs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">CIF Value</p>
                  <p className="text-white font-semibold">${duties.cifValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Duty ({duties.dutyRate}%)</p>
                  <p className="text-white font-semibold">${duties.duty.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">VAT ({duties.vatRate}%)</p>
                  <p className="text-white font-semibold">${duties.vat.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Total</p>
                  <p className="text-[#d4a843] font-bold text-lg">${duties.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Filters</h3>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="documents_submitted">Documents Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="inspection_required">Inspection Required</option>
              <option value="duties_assessed">Duties Assessed</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="cleared">Cleared</option>
              <option value="released">Released</option>
              <option value="held">Held</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c41e3a]"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading customs clearances...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-300">
            <p className="font-semibold">Error: {error}</p>
            <button
              onClick={fetchClearances}
              className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500 rounded text-red-300 hover:bg-red-500/30 transition-colors text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Clearances Table */}
        {!loading && !error && (
          <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-[#0c0f14]">
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Reference #</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">HS Code</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Declared Value</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Country</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Est. Duty</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Total Charges</th>
                    <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.data.map((clearance, idx) => (
                    <tr key={clearance.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                      <td className="px-6 py-4 text-white font-semibold">{clearance.reference_number}</td>
                      <td className="px-6 py-4 text-gray-300 font-semibold">{clearance.hs_code}</td>
                      <td className="px-6 py-4 text-white">
                        {clearance.currency} {(clearance.declared_value / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{clearance.import_country}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(clearance.status)}`}>
                          {getStatusLabel(clearance.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {clearance.currency} {(clearance.estimated_duty / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {clearance.currency} {(clearance.total_charges / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && pageData.data.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No customs clearances found</p>
          </div>
        )}

        {/* Status Flow Reference */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Customs Clearance Process</h3>
          <div className="flex flex-wrap gap-3">
            {statusFlow.map((step, idx) => (
              <div key={step.status} className="flex items-center">
                <div className="px-4 py-2 rounded-lg bg-[#0c0f14] border border-gray-600 text-center">
                  <p className="text-xl">{step.icon}</p>
                  <p className="text-xs text-gray-400 mt-1">{step.status}</p>
                </div>
                {idx < statusFlow.length - 1 && (
                  <div className="mx-2 text-gray-600">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
