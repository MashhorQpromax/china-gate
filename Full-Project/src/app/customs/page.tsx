'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_CUSTOMS_CLEARANCES, DEMO_SHIPMENTS, DEMO_DEALS, DEMO_COMPANIES } from '@/lib/demo-data';
import { Country } from '@/types';

interface CustomsFilter {
  status: string;
}

interface DutyCalculatorInput {
  cifValue: number;
  country: Country | '';
}

export default function CustomsPage() {
  const [filters, setFilters] = useState<CustomsFilter>({
    status: 'ALL',
  });

  const [calculator, setCalculator] = useState<DutyCalculatorInput>({
    cifValue: 0,
    country: Country.SAUDI_ARABIA,
  });

  const vatRates: Record<Country, number> = {
    [Country.SAUDI_ARABIA]: 15,
    [Country.UAE]: 5,
    [Country.KUWAIT]: 0,
    [Country.QATAR]: 5,
    [Country.BAHRAIN]: 0,
    [Country.OMAN]: 0,
    [Country.CHINA]: 13,
  };

  const customsDutyRate = 5; // Standard 5% duty

  const calculateDuties = () => {
    if (!calculator.country || calculator.cifValue === 0) return null;

    const dutyAmount = (calculator.cifValue * customsDutyRate) / 100;
    const vatRate = vatRates[calculator.country];
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
    { status: 'Docs Prep', icon: '📋' },
    { status: 'Submitted', icon: '📤' },
    { status: 'Review', icon: '🔍' },
    { status: 'Inspection', icon: '✓' },
    { status: 'Duties Paid', icon: '💰' },
    { status: 'Cleared', icon: '✅' },
    { status: 'Released', icon: '📦' },
  ];

  const getDealReference = (dealId: string) => {
    const shipment = DEMO_SHIPMENTS.find(s => s.id === dealId);
    if (shipment) {
      const deal = DEMO_DEALS.find(d => d.id === shipment.dealId);
      return deal?.referenceNumber || 'N/A';
    }
    return 'N/A';
  };

  const getCountryName = (country: Country) => {
    const names: Record<Country, string> = {
      [Country.SAUDI_ARABIA]: 'Saudi Arabia',
      [Country.UAE]: 'United Arab Emirates',
      [Country.KUWAIT]: 'Kuwait',
      [Country.QATAR]: 'Qatar',
      [Country.BAHRAIN]: 'Bahrain',
      [Country.OMAN]: 'Oman',
      [Country.CHINA]: 'China',
    };
    return names[country];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-300';
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const filteredClearances = filters.status === 'ALL' ? DEMO_CUSTOMS_CLEARANCES : DEMO_CUSTOMS_CLEARANCES.filter(c => c.status === filters.status);

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
          <p className="font-semibold">🔗 FASAH Integration</p>
          <p className="text-sm mt-1">Integration with Saudi customs (FASAH) coming soon for automated clearance tracking</p>
        </div>

        {/* Customs Duty Calculator */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">💻 Customs Duty Calculator</h3>
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
                onChange={(e) => setCalculator({ ...calculator, country: e.target.value as Country })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="">Select Country</option>
                <option value={Country.SAUDI_ARABIA}>Saudi Arabia</option>
                <option value={Country.UAE}>United Arab Emirates</option>
                <option value={Country.KUWAIT}>Kuwait</option>
                <option value={Country.QATAR}>Qatar</option>
                <option value={Country.BAHRAIN}>Bahrain</option>
                <option value={Country.OMAN}>Oman</option>
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
                  <p className="text-white font-semibold">${duties.duty.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">VAT ({duties.vatRate}%)</p>
                  <p className="text-white font-semibold">${duties.vat.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Total</p>
                  <p className="text-[#d4a843] font-bold text-lg">${duties.total.toLocaleString()}</p>
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
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Clearances Table */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-[#0c0f14]">
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Declaration #</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Deal</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">HS Code</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">CIF Value</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Country</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Duties</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClearances.map((clearance, idx) => (
                  <tr key={clearance.id} className={`border-b border-gray-700 hover:bg-[#252d3a] transition-colors ${idx % 2 === 0 ? 'bg-[#141820]' : ''}`}>
                    <td className="px-6 py-4 text-white font-semibold">{clearance.referenceNumber}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{getDealReference(clearance.shipmentId)}</td>
                    <td className="px-6 py-4 text-gray-300 font-semibold">{clearance.hsCode}</td>
                    <td className="px-6 py-4 text-white">
                      ${(clearance.declaredValue / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{getCountryName(clearance.importCountry)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(clearance.status)}`}>
                        {clearance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ${(clearance.estimatedDuty / 1000).toFixed(0)}K
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

        {filteredClearances.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No customs clearances found</p>
          </div>
        )}

        {/* Status Flow Reference */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Customs Clearance Process</h3>
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
