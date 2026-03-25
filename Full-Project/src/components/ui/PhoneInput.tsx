'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GULF_COUNTRIES } from '@/constants/auth';
import { getCountryCodePrefix } from '@/lib/validation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  label?: string;
  label_ar?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
  allowChinese?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
  label = 'Phone',
  label_ar = 'رقم الجوال',
  placeholder = 'Enter phone number',
  error,
  required = false,
  dir = 'rtl',
  allowChinese = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = dir === 'rtl';

  const countries = allowChinese
    ? [
        ...GULF_COUNTRIES,
        { code: 'CN', name: '中国', name_en: 'China', flag: '🇨🇳' },
      ]
    : GULF_COUNTRIES;

  const selectedCountry = countries.find((c) => c.code === countryCode);
  const countryPrefix = getCountryCodePrefix(countryCode);

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {isRTL ? label_ar : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2 mb-2">
        {/* Country Code Selector */}
        <div className="relative w-24">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-red-500 transition flex items-center justify-between hover:bg-gray-750"
          >
            <span className="text-lg">{selectedCountry?.flag}</span>
            <ChevronDown size={16} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onCountryChange(country.code);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition text-white text-sm flex items-center gap-2"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex-1">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg">
            <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
              {countryPrefix}
            </span>
            <input
              type="tel"
              value={value}
              onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
