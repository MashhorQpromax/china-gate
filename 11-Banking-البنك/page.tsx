'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatementTransaction {
  date: Date;
  description: string;
  debit?: number;
  credit?: number;
  balance: number;
  reference: string;
}

const DEMO_STATEMENT_DATA: StatementTransaction[] = [
  {
    date: new Date('2024-03-01'),
    description: 'Opening Balance',
    credit: 1250000,
    balance: 1250000,
    reference: 'OPEN-2024-03-01',
  },
  {
    date: new Date('2024-03-05'),
    description: 'Wire Transfer - Supplier Payment (Zhejiang Steel)',
    debit: 580000,
    balance: 670000,
    reference: 'WIRE-2024-001',
  },
  {
    date: new Date('2024-03-08'),
    description: 'LC Issuance Fee',
    debit: 5000,
    balance: 665000,
    reference: 'LC-FEES-001',
  },
  {
    date: new Date('2024-03-12'),
    description: 'Payment Received - Buyer (Emirates Steel)',
    credit: 142500,
    balance: 807500,
    reference: 'PAY-IN-2024-001',
  },
  {
    date: new Date('2024-03-15'),
    description: 'Currency Exchange - USD to SAR',
    debit: 375000,
    balance: 432500,
    reference: 'EXCH-2024-001',
  },
  {
    date: new Date('2024-03-18'),
    description: 'Wire Transfer - Deposit to Account',
    credit: 500000,
    balance: 932500,
    reference: 'WIRE-2024-002',
  },
  {
    date: new Date('2024-03-20'),
    description: 'Monthly Service Fee',
    debit: 250,
    balance: 932250,
    reference: 'FEE-2024-03',
  },
];

export default function BankStatementPage() {
  const [startDate, setStartDate] = useState(new Date('2024-03-01'));
  const [endDate, setEndDate] = useState(new Date('2024-03-31'));
  const [filterType, setFilterType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');

  const openingBalance = 1250000;
  const totalDebits = DEMO_STATEMENT_DATA.filter((t) => t.debit).reduce((sum, t) => sum + (t.debit || 0), 0);
  const totalCredits = DEMO_STATEMENT_DATA.filter((t) => t.credit && t.description !== 'Opening Balance').reduce(
    (sum, t) => sum + (t.credit || 0),
    0
  );
  const closingBalance = DEMO_STATEMENT_DATA[DEMO_STATEMENT_DATA.length - 1]?.balance || 0;

  const filteredTransactions = DEMO_STATEMENT_DATA.filter((t) => {
    const dateMatch = t.date >= startDate && t.date <= endDate;
    if (filterType === 'ALL') return dateMatch;
    if (filterType === 'DEBIT') return dateMatch && t.debit;
    if (filterType === 'CREDIT') return dateMatch && t.credit;
    return dateMatch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/banking" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to Banking
          </a>
          <h1 className="text-3xl font-bold text-white">Bank Statement</h1>
          <p className="text-gray-400 mt-1">Al-Rajhi Bank - SAR Account</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Statement Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">From Date</label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">To Date</label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'DEBIT' | 'CREDIT')}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Transactions</option>
                <option value="DEBIT">Debits Only</option>
                <option value="CREDIT">Credits Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Opening Balance</p>
            <p className="text-white text-2xl font-bold">﷼ {openingBalance.toLocaleString('en-US')}</p>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Credits</p>
            <p className="text-green-400 text-2xl font-bold">+ ﷼ {totalCredits.toLocaleString('en-US')}</p>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Debits</p>
            <p className="text-red-400 text-2xl font-bold">- ﷼ {totalDebits.toLocaleString('en-US')}</p>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-4 border border-[#d4a843]">
            <p className="text-gray-400 text-sm mb-1">Closing Balance</p>
            <p className="text-[#d4a843] text-2xl font-bold">﷼ {closingBalance.toLocaleString('en-US')}</p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="bg-[#0c0f14] p-6 border-b border-gray-700 flex gap-2">
            <button className="px-3 py-1 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded text-xs font-semibold transition-colors">
              📄 Print
            </button>
            <button className="px-3 py-1 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded text-xs font-semibold transition-colors">
              📥 PDF
            </button>
            <button className="px-3 py-1 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded text-xs font-semibold transition-colors">
              📊 Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-[#1a1f2b]">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Date</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Description</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm">Debit</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm">Credit</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm">Balance</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-[#0c0f14] transition-colors">
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {txn.date.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{txn.description}</td>
                    <td className="px-6 py-4 text-right text-red-400 font-mono text-sm">
                      {txn.debit ? '﷼ ' + txn.debit.toLocaleString('en-US') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-green-400 font-mono text-sm">
                      {txn.credit ? '﷼ ' + txn.credit.toLocaleString('en-US') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-white font-mono font-bold text-sm">
                      ﷼ {txn.balance.toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{txn.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statement Footer */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-xs mb-2">Statement Notice</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            This bank statement contains all transactions for the selected period. Please review carefully and report any discrepancies
            within 30 days. For support, contact Al-Rajhi Bank customer service.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
