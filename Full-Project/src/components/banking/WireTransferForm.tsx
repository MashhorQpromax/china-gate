'use client';

import React, { useState } from 'react';
import { Currency } from '@/types';
import { CURRENCIES } from '@/lib/constants';

interface WireTransferFormProps {
  onSubmit?: (data: WireTransferData) => void;
  onCancel?: () => void;
}

export interface WireTransferData {
  fromAccount: string;
  toBank: string;
  toSwift: string;
  toAccount: string;
  amount: number;
  currency: Currency;
  purpose: string;
}

export default function WireTransferForm({ onSubmit, onCancel }: WireTransferFormProps) {
  const [formData, setFormData] = useState<Partial<WireTransferData>>({
    fromAccount: 'SAR Account ****1234',
    currency: Currency.SAR,
    amount: 0,
    purpose: '',
    toBank: '',
    toSwift: '',
    toAccount: '',
  });

  const rates = {
    [Currency.SAR]: 3.75,
    [Currency.USD]: 1.0,
    [Currency.CNY]: 7.2,
  };

  const estimatedFee = formData.amount ? Math.max(formData.amount * 0.005, 50) : 0; // 0.5% minimum $50
  const totalAmount = (formData.amount || 0) + estimatedFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData as WireTransferData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 space-y-6">
      {/* Info Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="text-yellow-300 font-semibold text-sm">Approval Required</p>
          <p className="text-yellow-200 text-xs mt-1">This wire transfer will go through workflow approval before execution</p>
        </div>
      </div>

      {/* From Account */}
      <div>
        <label className="block text-gray-400 text-sm font-semibold mb-2">From Account</label>
        <div className="bg-[#0c0f14] rounded-lg px-4 py-3 border border-gray-700">
          <p className="text-white font-semibold">My SAR Account</p>
          <p className="text-gray-400 text-sm">Balance: ₹ 1,250,000</p>
        </div>
      </div>

      {/* To Account */}
      <div className="space-y-3">
        <label className="block text-gray-400 text-sm font-semibold">To: Recipient Account</label>

        <div>
          <label className="text-gray-400 text-xs block mb-1">Bank Name</label>
          <input
            type="text"
            placeholder="e.g., Industrial and Commercial Bank of China"
            value={formData.toBank || ''}
            onChange={(e) => setFormData({ ...formData, toBank: e.target.value })}
            className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs block mb-1">SWIFT Code</label>
            <input
              type="text"
              placeholder="e.g., ICBKCNBJ"
              value={formData.toSwift || ''}
              onChange={(e) => setFormData({ ...formData, toSwift: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Account Number</label>
            <input
              type="text"
              placeholder="e.g., 6010202009900012345"
              value={formData.toAccount || ''}
              onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {/* Amount & Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 text-sm font-semibold block mb-2">Amount</label>
          <input
            type="number"
            placeholder="0.00"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-semibold block mb-2">Currency</label>
          <select
            value={formData.currency || Currency.SAR}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
            className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            <option value={Currency.SAR}>SAR (﷼)</option>
            <option value={Currency.USD}>USD ($)</option>
            <option value={Currency.CNY}>CNY (¥)</option>
          </select>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-xs mb-2">Exchange Rate (Placeholder)</p>
        <p className="text-white font-mono text-sm">
          1 {formData.currency || Currency.SAR} = {rates[formData.currency || Currency.SAR].toFixed(4)} USD
        </p>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700 space-y-2">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Transfer Amount</span>
          <span className="text-white">{formData.currency} {(formData.amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Transfer Fee (0.5%)</span>
          <span className="text-white">{formData.currency} {estimatedFee.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
          <span className="text-white">Total Amount</span>
          <span className="text-[#d4a843]">{formData.currency} {totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="text-gray-400 text-sm font-semibold block mb-2">Purpose / Deal Reference</label>
        <input
          type="text"
          placeholder="e.g., DEAL-2024-0001 / Payment for Steel Shipment"
          value={formData.purpose || ''}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Review & Submit
        </button>
      </div>
    </form>
  );
}
