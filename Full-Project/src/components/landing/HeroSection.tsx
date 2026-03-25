'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const [tradeVolume, setTradeVolume] = useState(0);

  useEffect(() => {
    const target = 107;
    const duration = 2000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTradeVolume(Math.floor(progress * target));

      if (progress === 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={cn(
      'relative w-full min-h-screen overflow-hidden',
      'bg-gradient-to-b from-[#0c0f14] to-[#0a0d12]'
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Red accent gradient */}
        <div className={cn(
          'absolute top-0 right-0 w-96 h-96 rounded-full',
          'bg-gradient-to-bl from-[#c41e3a] to-transparent opacity-10'
        )} />

        {/* Gold accent */}
        <div className={cn(
          'absolute bottom-0 left-0 w-96 h-96 rounded-full',
          'bg-gradient-to-tr from-[#d4a843] to-transparent opacity-5'
        )} />

        {/* Animated border line */}
        <div className={cn(
          'absolute top-1/4 left-0 right-0 h-px',
          'bg-gradient-to-r from-transparent via-[#c41e3a] to-transparent',
          'opacity-30 animate-pulse'
        )} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Flags */}
        <div className="flex gap-4 mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="text-6xl">🇨🇳</span>
          <span className="text-6xl">🇸🇦</span>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-8 max-w-4xl">
          <h1 className={cn(
            'text-4xl sm:text-5xl lg:text-7xl font-bold mb-4',
            'text-white leading-tight'
          )}>
            <span className="block mb-2">بوابة الصين</span>
            <span className={cn(
              'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
              'bg-clip-text text-transparent'
            )}>
              نربط الخليج بالصين
            </span>
          </h1>

          <h1 className={cn(
            'text-3xl sm:text-4xl lg:text-5xl font-bold',
            'text-gray-300 mt-6'
          )}>
            China Gate
            <span className={cn(
              'block text-xl sm:text-2xl mt-2',
              'text-gray-400'
            )}>
              Connecting the Gulf with China
            </span>
          </h1>
        </div>

        {/* Trade Volume Counter */}
        <div className={cn(
          'bg-gradient-to-r from-[#c41e3a]/20 to-[#d4a843]/20',
          'border border-[#c41e3a]/30 rounded-lg px-8 py-6 mb-12',
          'backdrop-blur-sm'
        )}>
          <p className="text-gray-300 text-center mb-2">حجم التجارة | Trade Volume</p>
          <p className={cn(
            'text-5xl font-bold text-center',
            'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'bg-clip-text text-transparent'
          )}>
            ${tradeVolume}B+
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={cn(
          'flex flex-col sm:flex-row gap-4 w-full sm:w-auto',
          'justify-center flex-wrap'
        )}>
          <button className={cn(
            'px-8 py-4 rounded-lg font-bold text-lg',
            'bg-[#c41e3a] hover:bg-[#a01830]',
            'text-white transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#c41e3a]/50',
            'hover:scale-105 active:scale-95'
          )}>
            <span className="block text-sm mb-1">أنا مشتري خليجي</span>
            <span className="text-xs text-gray-200">Gulf Buyer</span>
          </button>

          <button className={cn(
            'px-8 py-4 rounded-lg font-bold text-lg',
            'bg-[#d4a843] hover:bg-[#c49833]',
            'text-[#0c0f14] transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#d4a843]/50',
            'hover:scale-105 active:scale-95'
          )}>
            <span className="block text-sm mb-1">أنا مورد صيني</span>
            <span className="text-xs text-gray-800">Chinese Supplier</span>
          </button>

          <button className={cn(
            'px-8 py-4 rounded-lg font-bold text-lg',
            'border-2 border-[#c41e3a] hover:bg-[#c41e3a]/10',
            'text-[#c41e3a] transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#c41e3a]/30',
            'hover:scale-105 active:scale-95'
          )}>
            <span className="block text-sm mb-1">أنا مصنع سعودي</span>
            <span className="text-xs text-gray-400">Saudi Factory</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
