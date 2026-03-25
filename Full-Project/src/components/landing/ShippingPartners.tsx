'use client';

import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  name: string;
  nameAr?: string;
  type: 'sea' | 'air';
  icon?: string;
}

const shippingPartners: Partner[] = [
  { id: 'cosco', name: 'COSCO', nameAr: 'كوسكو', type: 'sea', icon: '🚢' },
  { id: 'maersk', name: 'Maersk', nameAr: 'ماريسك', type: 'sea', icon: '🌊' },
  { id: 'msc', name: 'MSC', nameAr: 'إم إس سي', type: 'sea', icon: '⚓' },
  { id: 'cma', name: 'CMA CGM', nameAr: 'سي إم إيه سي جي إم', type: 'sea', icon: '🚢' },
  { id: 'bahri', name: 'Bahri', nameAr: 'البحري', type: 'sea', icon: '🛢️' },
  { id: 'dhl', name: 'DHL', nameAr: 'دي إتش إل', type: 'air', icon: '✈️' },
  { id: 'fedex', name: 'FedEx', nameAr: 'فيديكس', type: 'air', icon: '📦' },
  { id: 'aramex', name: 'Aramex', nameAr: 'أرامكس', type: 'air', icon: '🚁' },
  { id: 'emirates', name: 'Emirates SkyCargo', nameAr: 'إمارات سكاي', type: 'air', icon: '🛫' },
];

const seaPartners = shippingPartners.filter(p => p.type === 'sea');
const airPartners = shippingPartners.filter(p => p.type === 'air');

export default function ShippingPartners() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0c0f14] to-[#0a0d12]',
      'relative overflow-hidden'
    )}>
      {/* Background accent */}
      <div className={cn(
        'absolute top-1/2 left-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-br from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            شركاء الشحن المعتمدون
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Certified Shipping Partners
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
        </div>

        {/* Sea Shipping Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h3 className={cn(
              'text-2xl font-bold text-white'
            )}>
              الشحن البحري
            </h3>
            <span className="text-[#d4a843] font-semibold text-sm">Sea Shipping</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#d4a843]/30 to-transparent" />
          </div>

          <div className={cn(
            'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4',
            'overflow-x-auto pb-4'
          )}>
            {seaPartners.map((partner) => (
              <div
                key={partner.id}
                className={cn(
                  'group relative rounded-xl overflow-hidden',
                  'transition-all duration-300'
                )}
              >
                {/* Border background */}
                <div className={cn(
                  'absolute inset-0 rounded-xl',
                  'bg-gradient-to-br from-[#c41e3a]/20 to-[#d4a843]/20',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                )} />

                {/* Card */}
                <div className={cn(
                  'relative bg-[#0c0f14]/80 backdrop-blur',
                  'border border-gray-800',
                  'rounded-xl p-6',
                  'group-hover:border-[#c41e3a]/50',
                  'transition-all duration-300',
                  'flex flex-col items-center justify-center text-center',
                  'h-32 sm:h-40'
                )}>
                  {/* Icon */}
                  <div className={cn(
                    'text-4xl mb-3 transform transition-transform duration-300',
                    'group-hover:scale-125'
                  )}>
                    {partner.icon}
                  </div>

                  {/* Company name */}
                  <h4 className={cn(
                    'font-bold text-white text-sm sm:text-base',
                    'group-hover:text-[#d4a843] transition-colors duration-300',
                    'leading-tight'
                  )}>
                    {partner.name}
                  </h4>

                  {partner.nameAr && (
                    <p className="text-gray-500 text-xs mt-1">
                      {partner.nameAr}
                    </p>
                  )}

                  {/* Hover indicator */}
                  <div className={cn(
                    'absolute bottom-2 right-2 w-2 h-2 rounded-full',
                    'bg-[#c41e3a] opacity-0',
                    'group-hover:opacity-100 transition-opacity duration-300'
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Air Shipping Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h3 className={cn(
              'text-2xl font-bold text-white'
            )}>
              الشحن الجوي
            </h3>
            <span className="text-[#d4a843] font-semibold text-sm">Air Shipping</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#d4a843]/30 to-transparent" />
          </div>

          <div className={cn(
            'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'
          )}>
            {airPartners.map((partner) => (
              <div
                key={partner.id}
                className={cn(
                  'group relative rounded-xl overflow-hidden',
                  'transition-all duration-300'
                )}
              >
                {/* Border background */}
                <div className={cn(
                  'absolute inset-0 rounded-xl',
                  'bg-gradient-to-br from-[#c41e3a]/20 to-[#d4a843]/20',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                )} />

                {/* Card */}
                <div className={cn(
                  'relative bg-[#0c0f14]/80 backdrop-blur',
                  'border border-gray-800',
                  'rounded-xl p-6',
                  'group-hover:border-[#c41e3a]/50',
                  'transition-all duration-300',
                  'flex flex-col items-center justify-center text-center',
                  'h-32 sm:h-40'
                )}>
                  {/* Icon */}
                  <div className={cn(
                    'text-4xl mb-3 transform transition-transform duration-300',
                    'group-hover:scale-125'
                  )}>
                    {partner.icon}
                  </div>

                  {/* Company name */}
                  <h4 className={cn(
                    'font-bold text-white text-sm sm:text-base',
                    'group-hover:text-[#d4a843] transition-colors duration-300',
                    'leading-tight'
                  )}>
                    {partner.name}
                  </h4>

                  {partner.nameAr && (
                    <p className="text-gray-500 text-xs mt-1">
                      {partner.nameAr}
                    </p>
                  )}

                  {/* Hover indicator */}
                  <div className={cn(
                    'absolute bottom-2 right-2 w-2 h-2 rounded-full',
                    'bg-[#c41e3a] opacity-0',
                    'group-hover:opacity-100 transition-opacity duration-300'
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <div className={cn(
          'p-8 rounded-2xl',
          'bg-gradient-to-r from-[#c41e3a]/5 to-[#d4a843]/5',
          'border border-[#c41e3a]/20'
        )}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⏱️',
                titleAr: 'سرعة التسليم',
                titleEn: 'Fast Delivery',
                descAr: 'توصيل سريع وآمن',
              },
              {
                icon: '🛡️',
                titleAr: 'التأمين الكامل',
                titleEn: 'Full Insurance',
                descAr: 'حماية شاملة للبضائع',
              },
              {
                icon: '📍',
                titleAr: 'التتبع المباشر',
                titleEn: 'Live Tracking',
                descAr: 'متابعة فورية للشحنات',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4 text-center">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-white mb-2">
                  {benefit.titleAr}
                </h4>
                <p className="text-[#d4a843] text-sm font-semibold mb-2">
                  {benefit.titleEn}
                </p>
                <p className="text-gray-400 text-sm">
                  {benefit.descAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
