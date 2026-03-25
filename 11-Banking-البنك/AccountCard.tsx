'use client';

import React from 'react';
import { Currency } from '@/types';
import { CURRENCIES } from '@/lib/constants';

interface AccountCardProps {
  balance: number;
  baseCurrency: Currency;
  bankName: string;
  accountNumber: string;
  status?: 'ACTIVE' | 'DEMO';
  lastUpdated?: Date;
}

export default function AccountCard({
  balance,
  baseCurrency,
  bankName,
  accountNumber,
  status = 'DEMO',
  lastUpdated = new Date(),
}: AccountCardProps) {
  const baseCurrencyData = CURRENCIES.find((c) => c.code === baseCurrency);
  const exchangeRates = {
    CNY: 7.2,
    USD: 1.0,
    SAR: 3.75,
  };

  const balanceUSD = balance / (exchangeRates[baseCurrency] || 1);
  const balanceCNY = balanceUSD * exchangeRates.CNY;

  return (
    <div className="bg-gradient-to-br from-[#1a1f2b] to-[#0c0f14] rounded-lg p-6 border border-[#d4a843] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <h2 className="text-5xl font-bold text-white">
            {baseCurrencyData?.symbol}
            {balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm mb-1">Account Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Equivalent Amounts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0c0f14] rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Equivalent in USD</p>
          <p className="text-white font-bold">$ {balanceUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-[#0c0f14] rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Equivalent in CNY</p>
          <p className="text-white font-bold">¥ {balanceCNY.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Bank Details */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Bank Name</p>
            <p className="text-white font-semibold">{bankName}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs mb-1">Account Number</p>
            <p className="text-white font-mono text-sm">****{accountNumber.slice(-4)}</p>
          </div>
        </div>

        <p className="text-gray-500 text-xs">
          Last updated: {lastUpdated.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
