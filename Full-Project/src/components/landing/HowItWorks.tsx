'use client';

import { cn } from '@/lib/utils';

interface Step {
  number: number;
  titleAr: string;
  titleEn: string;
  emoji: string;
  descriptionAr: string;
  descriptionEn: string;
}

const steps: Step[] = [
  {
    number: 1,
    titleAr: 'ابحث عن منتجك',
    titleEn: 'Search for your product',
    emoji: '🔍',
    descriptionAr: 'اختر من آلاف المنتجات من الموردين الموثوقين',
    descriptionEn: 'Choose from thousands of products from verified suppliers',
  },
  {
    number: 2,
    titleAr: 'قارن العروض',
    titleEn: 'Compare quotations',
    emoji: '📋',
    descriptionAr: 'ارسل استفسار وتلقى عروض من عدة موردين',
    descriptionEn: 'Send inquiry and receive quotes from multiple suppliers',
  },
  {
    number: 3,
    titleAr: 'استلم بضاعتك',
    titleEn: 'Receive your goods',
    emoji: '🚢',
    descriptionAr: 'نتعامل مع الشحن واللوجستيات والدفع بأمان',
    descriptionEn: 'We handle shipping, logistics and secure payment',
  },
];

export default function HowItWorks() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0a0d12] to-[#0c0f14]',
      'relative overflow-hidden'
    )}>
      {/* Background accent */}
      <div className={cn(
        'absolute top-1/2 right-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-bl from-[#d4a843] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            كيف تعمل المنصة
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            How It Works
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting lines - hidden on mobile */}
          <div className="hidden sm:block">
            {/* Top line */}
            <svg className={cn(
              'absolute top-1/3 left-0 right-0 w-full h-0.5',
              'z-0'
            )} preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="25%" stopColor="#c41e3a" />
                  <stop offset="75%" stopColor="#c41e3a" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <line x1="0" y1="0" x2="100%" y2="0" stroke="url(#lineGradient)" strokeWidth="2" />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className={cn(
            'grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4',
            'relative z-10'
          )}>
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                {/* Step Card */}
                <div className={cn(
                  'relative mb-8 w-full max-w-sm',
                  'group'
                )}>
                  {/* Gradient border */}
                  <div className={cn(
                    'absolute inset-0 rounded-2xl',
                    'bg-gradient-to-br from-[#c41e3a]/30 to-[#d4a843]/30',
                    'p-0.5 group-hover:from-[#c41e3a]/50 group-hover:to-[#d4a843]/50',
                    'transition-all duration-300 opacity-0 group-hover:opacity-100'
                  )} />

                  <div className={cn(
                    'relative bg-[#0c0f14]/80 backdrop-blur',
                    'rounded-2xl p-8',
                    'border border-gray-800',
                    'group-hover:border-[#c41e3a]/50 transition-colors duration-300'
                  )}>
                    {/* Number Badge */}
                    <div className={cn(
                      'absolute -top-6 left-8',
                      'w-12 h-12 rounded-full',
                      'bg-gradient-to-br from-[#c41e3a] to-[#d4a843]',
                      'flex items-center justify-center',
                      'text-white font-bold text-xl',
                      'border-4 border-[#0c0f14]'
                    )}>
                      {step.number}
                    </div>

                    {/* Emoji */}
                    <div className="text-6xl mb-6 mt-4 text-center">
                      {step.emoji}
                    </div>

                    {/* Content */}
                    <h3 className={cn(
                      'text-2xl font-bold mb-2 text-center',
                      'text-white'
                    )}>
                      {step.titleAr}
                    </h3>

                    <p className={cn(
                      'text-sm text-[#d4a843] text-center mb-4',
                      'font-semibold'
                    )}>
                      {step.titleEn}
                    </p>

                    <p className="text-gray-400 text-center text-sm mb-2">
                      {step.descriptionAr}
                    </p>
                    <p className="text-gray-500 text-center text-xs">
                      {step.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Arrow down - only show on mobile between steps */}
                {index < steps.length - 1 && (
                  <div className="sm:hidden mb-4">
                    <svg className="w-6 h-6 text-[#c41e3a] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-16">
          <button className={cn(
            'px-10 py-4 rounded-lg font-bold text-lg',
            'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'text-white transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#c41e3a]/50',
            'hover:scale-105 active:scale-95'
          )}>
            ابدأ الآن — Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
