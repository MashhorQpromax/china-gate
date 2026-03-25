'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatItem {
  id: string;
  labelAr: string;
  labelEn: string;
  target: number;
  suffix: string;
  icon: string;
  description?: string;
}

const stats: StatItem[] = [
  {
    id: 'suppliers',
    labelAr: 'مورد معتمد',
    labelEn: 'Verified Suppliers',
    target: 1200,
    suffix: '+',
    icon: '🏢',
    description: 'من جميع أنحاء الصين',
  },
  {
    id: 'products',
    labelAr: 'منتج',
    labelEn: 'Products',
    target: 5000,
    suffix: '+',
    icon: '📦',
    description: 'في مختلف القطاعات',
  },
  {
    id: 'volume',
    labelAr: 'مليار دولار',
    labelEn: 'Deal Volume',
    target: 2.5,
    suffix: 'B+',
    icon: '💰',
    description: 'قيمة الصفقات المنفذة',
  },
  {
    id: 'companies',
    labelAr: 'شركة خليجية',
    labelEn: 'Gulf Companies',
    target: 850,
    suffix: '+',
    icon: '🌍',
    description: 'من دول الخليج',
  },
  {
    id: 'satisfaction',
    labelAr: 'نسبة الرضا',
    labelEn: 'Customer Satisfaction',
    target: 98.5,
    suffix: '%',
    icon: '⭐',
    description: 'رضا العملاء',
  },
];

function AnimatedCounter({ target, suffix, isDecimal }: { target: number; suffix: string; isDecimal?: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = progress * target;

      if (isDecimal) {
        setValue(Math.floor(currentValue * 10) / 10);
      } else {
        setValue(Math.floor(currentValue));
      }

      if (progress === 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [target, isDecimal]);

  const displayValue = isDecimal ? value.toFixed(1) : value.toLocaleString();

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function PlatformStats() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0a0d12] to-[#0c0f14]',
      'relative overflow-hidden'
    )}>
      {/* Background accents */}
      <div className={cn(
        'absolute top-0 right-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-bl from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className={cn(
        'absolute bottom-0 left-1/3 w-96 h-96 rounded-full',
        'bg-gradient-to-tr from-[#d4a843] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            أرقام المنصة
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Platform Numbers
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
          <p className="text-gray-400 text-center mt-6">
            نحن ننمو بسرعة ونخدم الآلاف من التجار والموردين
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => {
            const isDecimal = stat.target < 100;

            return (
              <div
                key={stat.id}
                className={cn(
                  'group relative rounded-xl overflow-hidden',
                  'transition-all duration-300'
                )}
              >
                {/* Gradient border background */}
                <div className={cn(
                  'absolute inset-0 rounded-xl',
                  'bg-gradient-to-br from-[#c41e3a]/20 to-[#d4a843]/20',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                )} />

                {/* Main card */}
                <div className={cn(
                  'relative bg-[#0c0f14]/80 backdrop-blur',
                  'border border-gray-800/50',
                  'rounded-xl p-6 sm:p-8',
                  'group-hover:border-[#c41e3a]/50',
                  'transition-all duration-300'
                )}>
                  {/* Icon */}
                  <div className={cn(
                    'text-4xl sm:text-5xl mb-4',
                    'transform transition-transform duration-300',
                    'group-hover:scale-110 group-hover:-translate-y-1'
                  )}>
                    {stat.icon}
                  </div>

                  {/* Value */}
                  <div className={cn(
                    'text-3xl sm:text-4xl font-bold mb-2',
                    'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
                    'bg-clip-text text-transparent'
                  )}>
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      isDecimal={isDecimal}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-white font-semibold text-sm sm:text-base mb-2">
                    {stat.labelAr}
                  </p>

                  <p className="text-[#d4a843] text-xs sm:text-sm font-medium">
                    {stat.labelEn}
                  </p>

                  {stat.description && (
                    <p className="text-gray-500 text-xs mt-3">
                      {stat.description}
                    </p>
                  )}

                  {/* Hover indicator */}
                  <div className={cn(
                    'absolute top-4 right-4 w-2 h-2 rounded-full',
                    'bg-[#c41e3a] opacity-0',
                    'group-hover:opacity-100 transition-opacity duration-300'
                  )} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth chart indicator */}
        <div className={cn(
          'mt-16 p-8 rounded-xl',
          'bg-gradient-to-r from-[#c41e3a]/10 to-[#d4a843]/10',
          'border border-[#c41e3a]/20',
          'text-center'
        )}>
          <p className="text-gray-300 mb-2">
            📈 نمو سنوي
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] bg-clip-text text-transparent">
              ٪247
            </span>
            <span className="text-gray-400 ml-3">
              Year-over-Year Growth
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
