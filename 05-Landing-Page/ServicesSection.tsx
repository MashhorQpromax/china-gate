'use client';

import { cn } from '@/lib/utils';

interface Service {
  id: string;
  emoji: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  accentColor: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 'shipping',
    emoji: '🚢',
    titleAr: 'الشحن واللوجستيك',
    titleEn: 'Shipping & Logistics',
    descriptionAr: 'خدمات شحن شاملة عبر البحر والجو مع تتبع فوري',
    descriptionEn: 'Comprehensive shipping via sea and air with real-time tracking',
    color: 'from-blue-600/10 to-cyan-600/10',
    accentColor: 'border-blue-500/30 hover:border-blue-500/60',
    features: ['تتبع فوري', 'تأمين كامل', 'توصيل سريع'],
  },
  {
    id: 'finance',
    emoji: '🏦',
    titleAr: 'التمويل التجاري',
    titleEn: 'Trade Finance',
    descriptionAr: 'خطابات الاعتماد والضمانات المصرفية',
    descriptionEn: 'Letters of Credit and Bank Guarantees',
    color: 'from-emerald-600/10 to-teal-600/10',
    accentColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    features: ['LC/LG', 'تمويل ميسر', 'شروط مرنة'],
  },
  {
    id: 'partnerships',
    emoji: '🏭',
    titleAr: 'الشراكات التصنيعية',
    titleEn: 'Manufacturing Partnerships',
    descriptionAr: 'فرص شراكة طويلة الأجل مع مصانع موثوقة',
    descriptionEn: 'Long-term partnership opportunities with reliable manufacturers',
    color: 'from-orange-600/10 to-red-600/10',
    accentColor: 'border-orange-500/30 hover:border-orange-500/60',
    features: ['عقود طويلة', 'أسعار مضمونة', 'جودة مستقرة'],
  },
  {
    id: 'quality',
    emoji: '✅',
    titleAr: 'ضمان الجودة',
    titleEn: 'Quality Assurance',
    descriptionAr: 'فحوصات وشهادات جودة دولية شاملة',
    descriptionEn: 'Comprehensive international quality certifications',
    color: 'from-green-600/10 to-lime-600/10',
    accentColor: 'border-green-500/30 hover:border-green-500/60',
    features: ['فحص شامل', 'شهادات دولية', 'ضمان كامل'],
  },
  {
    id: 'deals',
    emoji: '📊',
    titleAr: 'إدارة الصفقات',
    titleEn: 'Deal Management',
    descriptionAr: 'منصة شاملة لإدارة المشتريات والمبيعات',
    descriptionEn: 'Comprehensive platform for purchases and sales management',
    color: 'from-purple-600/10 to-pink-600/10',
    accentColor: 'border-purple-500/30 hover:border-purple-500/60',
    features: ['عقود رقمية', 'تتبع مراحل', 'تقارير مفصلة'],
  },
  {
    id: 'workflow',
    emoji: '🔄',
    titleAr: 'سير العمل المؤسسي',
    titleEn: 'Enterprise Workflow',
    descriptionAr: 'حلول متقدمة لإدارة عمليات المؤسسات الكبرى',
    descriptionEn: 'Advanced solutions for large enterprise operations',
    color: 'from-indigo-600/10 to-blue-600/10',
    accentColor: 'border-indigo-500/30 hover:border-indigo-500/60',
    features: ['تكامل API', 'أتمتة الدوام', 'تقارير متقدمة'],
  },
];

export default function ServicesSection() {
  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0a0d12] to-[#0c0f14]',
      'relative overflow-hidden'
    )}>
      {/* Background accents */}
      <div className={cn(
        'absolute top-1/4 left-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-br from-[#d4a843] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className={cn(
        'absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full',
        'bg-gradient-to-tl from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            خدماتنا المميزة
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Our Premium Services
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
          <p className="text-gray-400 text-center mt-6">
            حزمة شاملة من الخدمات لتسهيل تجارتك مع الصين
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={cn(
                'group relative rounded-2xl overflow-hidden',
                'transition-all duration-300 cursor-pointer',
                'hover:scale-105'
              )}
            >
              {/* Gradient background */}
              <div className={cn(
                'absolute inset-0',
                `bg-gradient-to-br ${service.color}`,
                'transition-all duration-300'
              )} />

              {/* Border */}
              <div className={cn(
                'absolute inset-0 border-2 rounded-2xl',
                'transition-all duration-300 group-hover:shadow-lg',
                service.accentColor
              )} />

              {/* Content */}
              <div className={cn(
                'relative bg-[#0c0f14]/60 backdrop-blur',
                'p-8 h-full rounded-2xl',
                'flex flex-col justify-between'
              )}>
                {/* Top section */}
                <div>
                  {/* Icon */}
                  <div className={cn(
                    'text-5xl mb-4 transform transition-transform duration-300',
                    'group-hover:scale-110 group-hover:-translate-y-2'
                  )}>
                    {service.emoji}
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    'text-2xl font-bold text-white mb-2'
                  )}>
                    {service.titleAr}
                  </h3>

                  <p className="text-[#d4a843] text-sm font-semibold mb-4">
                    {service.titleEn}
                  </p>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {service.descriptionAr}
                  </p>
                  <p className="text-gray-500 text-xs mb-6">
                    {service.descriptionEn}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#d4a843] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className={cn(
                  'w-full py-3 rounded-lg font-semibold text-sm',
                  'bg-gradient-to-r from-[#c41e3a]/20 to-[#d4a843]/20',
                  'text-[#d4a843] border border-[#d4a843]/30',
                  'hover:from-[#c41e3a]/40 hover:to-[#d4a843]/40',
                  'hover:border-[#d4a843]/60',
                  'transition-all duration-300',
                  'group-hover:shadow-lg group-hover:shadow-[#d4a843]/20'
                )}>
                  اعرف أكثر — Learn More
                </button>

                {/* Corner accent */}
                <div className={cn(
                  'absolute top-0 right-0 w-20 h-20 rounded-full',
                  'bg-gradient-to-bl from-[#c41e3a]/10 to-transparent',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                )} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section - integrated support */}
        <div className={cn(
          'mt-16 p-8 rounded-2xl',
          'bg-gradient-to-r from-[#c41e3a]/5 to-[#d4a843]/5',
          'border border-[#c41e3a]/20 border-dashed'
        )}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                الدعم المتكامل
              </h3>
              <p className="text-gray-400">
                فريق متخصص يساعدك في كل خطوة من خطوات عملية التجارة
              </p>
            </div>

            <button className={cn(
              'px-8 py-3 rounded-lg font-bold whitespace-nowrap',
              'bg-[#d4a843] hover:bg-[#c49833]',
              'text-[#0c0f14] transition-all duration-300',
              'hover:shadow-lg hover:shadow-[#d4a843]/50'
            )}>
              اتصل بنا — Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
