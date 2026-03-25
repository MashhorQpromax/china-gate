'use client';

import { cn } from '@/lib/utils';

interface PartnerPlaceholder {
  id: string;
  name: string;
  initials: string;
  color: string;
}

const partners: PartnerPlaceholder[] = [
  { id: '1', name: 'Partner 1', initials: 'P1', color: 'bg-red-600/20 border-red-500/30' },
  { id: '2', name: 'Partner 2', initials: 'P2', color: 'bg-blue-600/20 border-blue-500/30' },
  { id: '3', name: 'Partner 3', initials: 'P3', color: 'bg-purple-600/20 border-purple-500/30' },
  { id: '4', name: 'Partner 4', initials: 'P4', color: 'bg-green-600/20 border-green-500/30' },
  { id: '5', name: 'Partner 5', initials: 'P5', color: 'bg-yellow-600/20 border-yellow-500/30' },
  { id: '6', name: 'Partner 6', initials: 'P6', color: 'bg-pink-600/20 border-pink-500/30' },
  { id: '7', name: 'Partner 7', initials: 'P7', color: 'bg-cyan-600/20 border-cyan-500/30' },
  { id: '8', name: 'Partner 8', initials: 'P8', color: 'bg-orange-600/20 border-orange-500/30' },
];

export default function PartnersSection() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0a0d12] to-[#0c0f14]',
      'relative overflow-hidden'
    )}>
      {/* Background accent */}
      <div className={cn(
        'absolute top-1/3 right-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-bl from-[#d4a843] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            شركاؤنا
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Our Partners
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
          <p className="text-gray-400 text-center mt-6">
            نتعاون مع أفضل الشركات العالمية والإقليمية
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={cn(
                'group relative rounded-2xl overflow-hidden',
                'transition-all duration-300'
              )}
            >
              {/* Background */}
              <div className={cn(
                'absolute inset-0 rounded-2xl',
                partner.color,
                'opacity-30 group-hover:opacity-50 transition-opacity duration-300'
              )} />

              {/* Border */}
              <div className={cn(
                'absolute inset-0 border-2 rounded-2xl',
                'transition-all duration-300 group-hover:shadow-lg',
                partner.color
              )} />

              {/* Content */}
              <div className={cn(
                'relative bg-[#0c0f14]/60 backdrop-blur',
                'p-8 h-48 rounded-2xl',
                'flex flex-col items-center justify-center',
                'text-center'
              )}>
                {/* Logo placeholder */}
                <div className={cn(
                  'w-24 h-24 rounded-lg mb-4',
                  partner.color,
                  'flex items-center justify-center',
                  'transform transition-transform duration-300',
                  'group-hover:scale-110 group-hover:rotate-3'
                )}>
                  <span className="text-3xl font-bold text-white">
                    {partner.initials}
                  </span>
                </div>

                {/* Coming Soon badge */}
                <div className={cn(
                  'px-4 py-2 rounded-full',
                  'bg-[#c41e3a]/20 border border-[#c41e3a]/50',
                  'text-[#d4a843] font-bold text-sm'
                )}>
                  قريباً
                </div>

                <p className="text-gray-500 text-xs mt-3">
                  Coming Soon
                </p>
              </div>

              {/* Shine effect on hover */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-10',
                'bg-gradient-to-r from-transparent via-white to-transparent',
                'transform -skew-x-12 translate-x-full',
                'group-hover:translate-x-0 transition-all duration-700 rounded-2xl'
              )} />
            </div>
          ))}
        </div>

        {/* Interest CTA */}
        <div className={cn(
          'p-12 rounded-2xl text-center',
          'bg-gradient-to-r from-[#c41e3a]/10 to-[#d4a843]/10',
          'border border-[#d4a843]/30'
        )}>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            هل أنت شركة مهتمة بالشراكة معنا؟
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Are you interested in becoming a partner?
          </p>

          <button className={cn(
            'px-10 py-4 rounded-lg font-bold text-lg',
            'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'text-white transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#c41e3a]/50',
            'hover:scale-105 active:scale-95'
          )}>
            تواصل معنا — Get in Touch
          </button>

          <p className="text-gray-500 text-sm mt-6">
            نحن ننظر دائماً إلى شركاء جدد للانضمام إلى نظامنا البيئي
          </p>
        </div>
      </div>
    </section>
  );
}
