'use client';

import React, { useState } from 'react';
import { Currency } from '@/types';
import { CURRENCIES } from '@/lib/constants';

interface CurrencyExchangeProps {
  onExecute?: (data: ExchangeData) => void;
}

export interface ExchangeData {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
}

const SUPPORTED_CURRENCIES = [Currency.SAR, Currency.USD, Currency.CNY, Currency.AED, Currency.KWD, Currency.QAR, Currency.BHD, Currency.OMR];

export default function CurrencyExchange({ onExecute }: CurrencyExchangeProps) {
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.SAR);
  const [toCurrency, setToCurrency] = useState<Currency>(Currency.USD);
  const [fromAmount, setFromAmount] = useState<number>(0);

  // Placeholder exchange rates
  const exchangeRates: Record<Currency, Record<Currency, number>> = {
    [Currency.SAR]: {
      [Currency.USD]: 0.267,
      [Currency.CNY]: 1.92,
      [Currency.AED]: 0.98,
      [Currency.KWD]: 0.082,
      [Currency.QAR]: 0.972,
      [Currency.BHD]: 0.101,
      [Currency.OMR]: 0.103,
      [Currency.SAR]: 1,
    },
    [Currency.USD]: {
      [Currency.SAR]: 3.75,
      [Currency.CNY]: 7.2,
      [Currency.AED]: 3.67,
      [Currency.KWD]: 0.307,
      [Currency.QAR]: 3.64,
      [Currency.BHD]: 0.377,
      [Currency.OMR]: 0.385,
      [Currency.USD]: 1,
    },
    [Currency.CNY]: {
      [Currency.SAR]: 0.521,
      [Currency.USD]: 0.139,
      [Currency.AED]: 0.509,
      [Currency.KWD]: 0.0427,
      [Currency.QAR]: 0.506,
      [Currency.BHD]: 0.0523,
      [Currency.OMR]: 0.0535,
      [Currency.CNY]: 1,
    },
    [Currency.AED]: {
      [Currency.SAR]: 1.022,
      [Currency.USD]: 0.272,
      [Currency.CNY]: 1.961,
      [Currency.KWD]: 0.0837,
      [Currency.QAR]: 0.993,
      [Currency.BHD]: 0.103,
      [Currency.OMR]: 0.105,
      [Currency.AED]: 1,
    },
    [Currency.KWD]: {
      [Currency.SAR]: 12.21,
      [Currency.USD]: 3.26,
      [Currency.CNY]: 23.44,
      [Currency.AED]: 11.95,
      [Currency.QAR]: 11.87,
      [Currency.BHD]: 1.23,
      [Currency.OMR]: 1.26,
      [Currency.KWD]: 1,
    },
    [Currency.QAR]: {
      [Currency.SAR]: 1.029,
      [Currency.USD]: 0.275,
      [Currency.CNY]: 1.977,
      [Currency.AED]: 1.007,
      [Currency.KWD]: 0.0843,
      [Currency.BHD]: 0.103,
      [Currency.OMR]: 0.106,
      [Currency.QAR]: 1,
    },
    [Currency.BHD]: {
      [Currency.SAR]: 9.975,
      [Currency.USD]: 2.656,
      [Currency.CNY]: 19.16,
      [Currency.AED]: 9.709,
      [Currency.KWD]: 0.813,
      [Currency.QAR]: 9.709,
      [Currency.OMR]: 1.026,
      [Currency.BHD]: 1,
    },
    [Currency.OMR]: {
      [Currency.SAR]: 9.708,
      [Currency.USD]: 2.597,
      [Currency.CNY]: 18.69,
      [Currency.AED]: 9.476,
      [Currency.KWD]: 0.794,
      [Currency.QAR]: 9.434,
      [Currency.BHD]: 0.975,
      [Currency.OMR]: 1,
    },
  };

  const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
  const toAmount = fromAmount * rate;
  const fee = toAmount * 0.002; // 0.2% fee
  const finalAmount = toAmount - fee;

  const getSymbol = (curr: Currency) => {
    return CURRENCIES.find((c) => c.code === curr)?.symbol || curr;
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleExecute = () => {
    onExecute?.({
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount: finalAmount,
    });
  };

  return (
    <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 space-y-6">
      {/* From Currency */}
      <div>
        <label className="text-gray-400 text-sm font-semibold block mb-3">From</label>
        <div className="flex gap-3">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as Currency)}
            className="w-32 bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="0.00"
            value={fromAmount || ''}
            onChange={(e) => setFromAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwap}
          className="p-2 bg-[#0c0f14] border border-gray-700 rounded-full hover:bg-gray-700 transition-colors text-white"
          title="Swap currencies"
        >
          ↔
        </button>
      </div>

      {/* To Currency */}
      <div>
        <label className="text-gray-400 text-sm font-semibold block mb-3">To</label>
        <div className="flex gap-3">
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as Currency)}
            className="w-32 bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
          <div className="flex-1 bg-[#0c0f14] rounded-lg px-3 py-2 border border-gray-700 flex items-center">
            <span className="text-white font-semibold">
              {getSymbol(toCurrency)} {toAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Exchange Rate */}
      <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-xs mb-1">Exchange Rate</p>
        <p className="text-white font-mono">
          1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
        </p>
        <p className="text-gray-500 text-xs mt-1">Rates are indicative and for reference only</p>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-[#0c0f14] rounded-lg p-4 border border-gray-700 space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Amount in {toCurrency}</span>
          <span className="text-white">{getSymbol(toCurrency)} {toAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Exchange Fee (0.2%)</span>
          <span className="text-white">{getSymbol(toCurrency)} {fee.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
          <span className="text-white">You will receive</span>
          <span className="text-[#d4a843]">
            {getSymbol(toCurrency)} {finalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-blue-300 text-xs">
          ℹ️ This exchange rate is provided for reference only. Actual rates may vary based on market conditions and bank rates.
        </p>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={fromAmount <= 0}
        className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
          fromAmount > 0
            ? 'bg-[#c41e3a] text-white hover:bg-red-700'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        Execute Exchange
      </button>
    </div>
  );
}
