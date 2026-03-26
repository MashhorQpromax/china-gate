'use client';

import React, { useState } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE - Marketing Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0c0f14] via-[#141820] to-[#1a1d23] relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#c41e3a]/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#d4a843]/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        {/* Top Section - Logo */}
        <div className="relative z-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-[#d4a843] font-serif">
              {isArabic ? 'بوابة الصين' : 'CHINA GATE'}
            </h1>
            <p className="text-sm tracking-widest text-gray-400">
              {isArabic ? 'منصة التجارة' : 'B2B TRADING PLATFORM'}
            </p>
          </div>

          {/* Main Tagline */}
          <div className="mt-16">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              {isArabic
                ? 'بوابتك إلى التجارة الصينية الخليجية'
                : 'Your Gateway to\nChina-Gulf Trade'}
            </h2>
            <p className="text-lg text-gray-300">
              {isArabic
                ? 'منصة التجارة الصناعية الموثوقة بين الصين والخليج'
                : 'Connecting manufacturers, suppliers, and traders across continents'}
            </p>
          </div>
        </div>

        {/* Middle Section - Feature Highlights */}
        <div className="relative z-10 space-y-4">
          {[
            {
              icon: '✓',
              en: 'Verified Suppliers',
              ar: 'موردين موثقين',
            },
            {
              icon: '🔒',
              en: 'Secure Payments',
              ar: 'مدفوعات آمنة',
            },
            {
              icon: '⭐',
              en: 'Quality Assured',
              ar: 'جودة مضمونة',
            },
            {
              icon: '⚡',
              en: 'Fast Shipping',
              ar: 'شحن سريع',
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="text-2xl text-[#d4a843]">{feature.icon}</div>
              <p className="text-gray-300 text-sm">
                {isArabic ? feature.ar : feature.en}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section - Trust Badges */}
        <div className="relative z-10 border-t border-gray-700/50 pt-8">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-[#d4a843]">10K+</p>
              <p className="text-xs text-gray-400 mt-1">
                {isArabic ? 'المنتجات' : 'Products'}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#d4a843]">500+</p>
              <p className="text-xs text-gray-400 mt-1">
                {isArabic ? 'الموردين' : 'Suppliers'}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#d4a843]">15+</p>
              <p className="text-xs text-gray-400 mt-1">
                {isArabic ? 'الدول' : 'Countries'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form Panel */}
      <div
        className={`w-full lg:w-1/2 bg-white flex flex-col relative ${
          isArabic ? 'rtl' : 'ltr'
        }`}
      >
        {/* Language Toggle */}
        <div className="absolute top-6 right-6 lg:right-8 z-50">
          <button
            onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
            className="text-sm font-medium text-gray-600 hover:text-[#c41e3a] transition-colors px-3 py-2 rounded-lg border border-gray-200 hover:border-[#c41e3a]"
          >
            {isArabic ? 'EN' : 'AR'}
          </button>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden pt-8 px-6 mb-4">
          <h1 className="text-2xl font-bold text-[#c41e3a] font-serif">
            {isArabic ? 'بوابة الصين' : 'CHINA GATE'}
          </h1>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 py-6 px-6 text-center">
          <p className="text-xs text-gray-500">
            {isArabic
              ? '© 2024-2026 بوابة الصين. جميع الحقوق محفوظة.'
              : '© 2024-2026 China Gate. All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
}
