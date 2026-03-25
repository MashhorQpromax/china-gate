'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { validatePassword, getPasswordStrength } from '@/lib/validation';
import { PASSWORD_REQUIREMENTS } from '@/constants/auth';

interface PasswordStrengthProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  label_ar?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
}

export function PasswordStrength({
  value,
  onChange,
  label = 'Password',
  label_ar = 'كلمة المرور',
  placeholder = 'Enter password',
  error,
  required = false,
  dir = 'rtl',
}: PasswordStrengthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const requirements = validatePassword(value);
  const strength = getPasswordStrength(value);

  const strengthConfig = {
    'weak': { color: 'bg-red-600', label_en: 'Weak', label_ar: 'ضعيفة', width: '25%' },
    'medium': { color: 'bg-orange-500', label_en: 'Medium', label_ar: 'متوسطة', width: '50%' },
    'strong': { color: 'bg-yellow-500', label_en: 'Strong', label_ar: 'قوية', width: '75%' },
    'very-strong': { color: 'bg-green-600', label_en: 'Very Strong', label_ar: 'قوية جداً', width: '100%' },
  };

  const config = strengthConfig[strength];
  const isRTL = dir === 'rtl';

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {isRTL ? label_ar : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative mb-3">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-10 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition ${
            error ? 'border-red-500' : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-3">{error}</p>
      )}

      {value && (
        <>
          {/* Strength Meter */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400">
                {isRTL ? config.label_ar : config.label_en}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${config.color} transition-all duration-300`}
                style={{ width: config.width }}
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-2">
            {PASSWORD_REQUIREMENTS.map((req) => {
              const isMet = requirements[req.key as keyof typeof requirements];
              return (
                <div
                  key={req.key}
                  className="flex items-center gap-2 text-xs"
                >
                  {isMet ? (
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-gray-500 flex-shrink-0" />
                  )}
                  <span
                    className={
                      isMet ? 'text-green-500' : 'text-gray-400'
                    }
                  >
                    {isRTL ? req.label_ar : req.label_en}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
