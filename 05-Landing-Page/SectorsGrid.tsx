'use client';

import { cn } from '@/lib/utils';

interface Sector {
  id: string;
  titleAr: string;
  titleEn: string;
  emoji: string;
  color: string;
  accentColor: string;
}

const sectors: Sector[] = [
  {
    id: 'construction',
    titleAr: 'بناء وتشييد',
    titleEn: 'Construction',
    emoji: '🏗️',
    color: 'from-orange-600/20 to-red-600/20',
    accentColor: 'border-orange-500/30 hover:border-orange-500/60 hover:shadow-orange-500/20',
  },
  {
    id: 'metals',
    titleAr: 'حديد ومعادن',
    titleEn: 'Steel & Metals',
    emoji: '⚙️',
    color: 'from-gray-600/20 to-slate-600/20',
    accentColor: 'border-gray-500/30 hover:border-gray-500/60 hover:shadow-gray-500/20',
  },
  {
    id: 'solar',
    titleAr: 'طاقة شمسية',
    titleEn: 'Solar Energy',
    emoji: '☀️',
    color: 'from-yellow-600/20 to-amber-600/20',
    accentColor: 'border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-yellow-500/20',
  },
  {
    id: 'vehicles',
    titleAr: 'سيارات كهربائية',
    titleEn: 'Electric Vehicles',
    emoji: '🚗',
    color: 'from-blue-600/20 to-cyan-600/20',
    accentColor: 'border-blue-500/30 hover:border-blue-500/60 hover:shadow-blue-500/20',
  },
  {
    id: 'packaging',
    titleAr: 'تغليف',
    titleEn: 'Packaging',
    emoji: '📦',
    color: 'from-emerald-600/20 to-teal-600/20',
    accentColor: 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-500/20',
  },
  {
    id: 'pharma',
    titleAr: 'أدوية',
    titleEn: 'Pharmaceuticals',
    emoji: '💊',
    color: 'from-red-600/20 to-pink-600/20',
    accentColor: 'border-red-500/30 hover:border-red-500/60 hover:shadow-red-500/20',
  },
  {
    id: 'electronics',
    titleAr: 'إلكترونيات',
    titleEn: 'Electronics',
    emoji: '💻',
    color: 'from-purple-600/20 to-indigo-600/20',
    accentColor: 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-purple-500/20',
  },
  {
    id: 'chemicals',
    titleAr: 'المواد الكيميائية',
    titleEn: 'Chemicals',
    emoji: '🧪',
    color: 'from-lime-600/20 to-green-600/20',
    accentColor: 'border-lime-500/30 hover:border-lime-500/60 hover:shadow-lime-500/20',
  },
];

export default function SectorsGrid() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0c0f14] to-[#0a0d12]',
      'relative overflow-hidden'
    )}>
      {/* Background accent */}
      <div className={cn(
        'absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full',
        'bg-gradient-to-tr from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            القطاعات
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Sectors & Industries
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => {
                // Navigate to marketplace filtered by sector
                window.location.href = `/marketplace?sector=${sector.id}`;
              }}
              className={cn(
                'group relative h-64 rounded-2xl overflow-hidden',
                'transition-all duration-300',
                'hover:scale-105 active:scale-95',
                'cursor-pointer'
              )}
            >
              {/* Background gradient */}
              <div className={cn(
                'absolute inset-0',
                `bg-gradient-to-br ${sector.color}`,
                'transition-all duration-300'
              )} />

              {/* Border glow effect */}
              <div className={cn(
                'absolute inset-0 border-2 rounded-2xl',
                'transition-all duration-300',
                'group-hover:shadow-lg',
                sector.accentColor
              )} />

              {/* Overlay on hover */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-t from-[#0c0f14] via-transparent to-transparent',
                'opacity-60 group-hover:opacity-40 transition-opacity duration-300'
              )} />

              {/* Content */}
              <div className={cn(
                'relative h-full flex flex-col items-center justify-center',
                'p-6 text-center'
              )}>
                {/* Emoji Icon */}
                <div className={cn(
                  'text-6xl mb-6 transform transition-transform duration-300',
                  'group-hover:scale-125 group-hover:-translate-y-2'
                )}>
                  {sector.emoji}
                </div>

                {/* Text Content */}
                <div className={cn(
                  'transform transition-all duration-300',
                  'group-hover:translate-y-2'
                )}>
                  <h3 className={cn(
                    'text-xl font-bold text-white mb-2'
                  )}>
                    {sector.titleAr}
                  </h3>
                  <p className="text-[#d4a843] text-sm font-semibold">
                    {sector.titleEn}
                  </p>
                </div>

                {/* Arrow icon - appears on hover */}
                <div className={cn(
                  'absolute bottom-4 right-4 opacity-0 transform transition-all duration-300',
                  'group-hover:opacity-100 group-hover:translate-x-1'
                )}>
                  <svg className="w-6 h-6 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Shine effect */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-10',
                'bg-gradient-to-r from-transparent via-white to-transparent',
                'transform -skew-x-12 translate-x-full',
                'group-hover:translate-x-0 transition-all duration-700'
              )} />
            </button>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="flex justify-center mt-16">
          <button className={cn(
            'px-8 py-3 rounded-lg font-bold',
            'border-2 border-[#d4a843] text-[#d4a843]',
            'hover:bg-[#d4a843]/10 transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#d4a843]/30'
          )}>
            عرض جميع القطاعات — View All Sectors
          </button>
        </div>
      </div>
    </section>
  );
}
