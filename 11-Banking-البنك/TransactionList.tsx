'use client';

import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: Date;
  type: 'WIRE' | 'LC' | 'LG' | 'EXCHANGE' | 'PAYMENT' | 'DEPOSIT';
  description: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  reference: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    date: new Date('2024-03-20'),
    type: 'WIRE',
    description: 'Wire Transfer to Supplier (Zhejiang Steel)',
    amount: -580000,
    currency: 'USD',
    status: 'COMPLETED',
    reference: 'WIRE-2024-001',
  },
  {
    id: 'txn-002',
    date: new Date('2024-03-19'),
    type: 'LC',
    description: 'LC Issuance - Deal-2024-0001',
    amount: -5800000,
    currency: 'USD',
    status: 'COMPLETED',
    reference: 'LC-2024-0001',
  },
  {
    id: 'txn-003',
    date: new Date('2024-03-18'),
    type: 'PAYMENT',
    description: 'Payment Received - Buyer (Gulf Star Electronics)',
    amount: 142500,
    currency: 'USD',
    status: 'COMPLETED',
    reference: 'PAY-2024-003',
  },
  {
    id: 'txn-004',
    date: new Date('2024-03-17'),
    type: 'EXCHANGE',
    description: 'Currency Exchange - USD to SAR',
    amount: -100000,
    currency: 'USD',
    status: 'COMPLETED',
    reference: 'EXCH-2024-001',
  },
  {
    id: 'txn-005',
    date: new Date('2024-03-16'),
    type: 'LC',
    description: 'LC Amendment - Deal-2024-0002',
    amount: 0,
    currency: 'USD',
    status: 'PENDING',
    reference: 'LC-2024-0002-AMN',
  },
  {
    id: 'txn-006',
    date: new Date('2024-03-15'),
    type: 'WIRE',
    description: 'Wire Transfer - Deposit to Account',
    amount: 500000,
    currency: 'USD',
    status: 'COMPLETED',
    reference: 'WIRE-2024-002',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'WIRE':
      return '💸';
    case 'LC':
      return '📋';
    case 'LG':
      return '🛡️';
    case 'EXCHANGE':
      return '💱';
    case 'PAYMENT':
      return '✅';
    case 'DEPOSIT':
      return '📥';
    default:
      return '📌';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-300';
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'FAILED':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

export default function TransactionList({
  transactions = DEMO_TRANSACTIONS,
  onExportPDF,
  onExportExcel,
}: TransactionListProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === 'ALL' || t.type === filterType;
    const statusMatch = filterStatus === 'ALL' || t.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
      {/* Header with Filters and Export */}
      <div className="bg-[#0c0f14] p-6 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-white font-semibold text-lg">Recent Transactions</h3>
          <div className="flex gap-2">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="px-3 py-1 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded text-xs font-semibold transition-colors"
              >
                📄 PDF
              </button>
            )}
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="px-3 py-1 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded text-xs font-semibold transition-colors"
              >
                📊 Excel
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#1a1f2b] text-white rounded px-2 py-1.5 border border-gray-700 text-xs focus:border-[#c41e3a] outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="WIRE">Wire Transfer</option>
              <option value="LC">Letter of Credit</option>
              <option value="LG">Letter of Guarantee</option>
              <option value="EXCHANGE">Currency Exchange</option>
              <option value="PAYMENT">Payment</option>
              <option value="DEPOSIT">Deposit</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#1a1f2b] text-white rounded px-2 py-1.5 border border-gray-700 text-xs focus:border-[#c41e3a] outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-[#1a1f2b]">
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Date</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Type</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Description</th>
              <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm">Amount</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} className="border-b border-gray-700 hover:bg-[#0c0f14] transition-colors">
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {txn.date.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-white text-sm">
                  <span className="flex items-center gap-2">
                    {getTypeIcon(txn.type)}
                    {txn.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-white text-sm">{txn.description}</td>
                <td className={`px-6 py-4 text-right font-mono font-bold text-sm ${txn.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {txn.amount >= 0 ? '+' : ''}
                  {txn.currency} {Math.abs(txn.amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{txn.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400">No transactions found</p>
        </div>
      )}
    </div>
  );
}
