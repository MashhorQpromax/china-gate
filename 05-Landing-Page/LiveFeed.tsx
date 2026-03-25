'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FeedItem {
  id: string;
  type: 'request' | 'quotation' | 'deal' | 'product';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  timeAgo: string;
  country: string;
  emoji: string;
  amount?: string;
  color: string;
}

const demoFeedData: FeedItem[] = [
  {
    id: '1',
    type: 'request',
    titleAr: 'طلب شراء - مواد البناء',
    titleEn: 'Purchase Request - Construction Materials',
    descriptionAr: 'تم تقديم طلب شراء جديد للحديد والأسمنت',
    descriptionEn: 'New request for steel and cement posted',
    timeAgo: 'منذ 5 دقائق',
    country: '🇸🇦',
    emoji: '📝',
    color: 'from-orange-500/10 to-transparent',
  },
  {
    id: '2',
    type: 'quotation',
    titleAr: 'عرض جديد - الألواح الشمسية',
    titleEn: 'New Quotation - Solar Panels',
    descriptionAr: 'وصل عرض سعر من مورد صيني معتمد',
    descriptionEn: 'Quote received from verified supplier',
    timeAgo: 'منذ 12 دقيقة',
    country: '🇨🇳',
    emoji: '📋',
    amount: '$45,000',
    color: 'from-yellow-500/10 to-transparent',
  },
  {
    id: '3',
    type: 'deal',
    titleAr: 'صفقة منجزة - المعادن',
    titleEn: 'Deal Completed - Metals',
    descriptionAr: 'تم إتمام صفقة بقيمة مليون دولار',
    descriptionEn: 'Million dollar deal successfully completed',
    timeAgo: 'منذ 23 دقيقة',
    country: '🇦🇪',
    emoji: '✅',
    amount: '$1.2M',
    color: 'from-green-500/10 to-transparent',
  },
  {
    id: '4',
    type: 'product',
    titleAr: 'منتج جديد - الإلكترونيات',
    titleEn: 'New Product Listing - Electronics',
    descriptionAr: 'تم إضافة خط إنتاج جديد للإلكترونيات',
    descriptionEn: 'New electronics product line added',
    timeAgo: 'منذ 45 دقيقة',
    country: '🇨🇳',
    emoji: '💻',
    color: 'from-blue-500/10 to-transparent',
  },
  {
    id: '5',
    type: 'request',
    titleAr: 'طلب شراء - الأدوية',
    titleEn: 'Purchase Request - Pharmaceuticals',
    descriptionAr: 'طلب استيراد أدوية متخصصة وعلاجات',
    descriptionEn: 'Specialized pharmaceuticals import request',
    timeAgo: 'منذ ساعة',
    country: '🇶🇦',
    emoji: '💊',
    color: 'from-red-500/10 to-transparent',
  },
  {
    id: '6',
    type: 'quotation',
    titleAr: 'عرض جديد - التغليف',
    titleEn: 'New Quotation - Packaging',
    descriptionAr: 'عرض سعر لتغليف صناعي من شنغهاي',
    descriptionEn: 'Industrial packaging quote from Shanghai',
    timeAgo: 'منذ ساعة',
    country: '🇨🇳',
    emoji: '📦',
    amount: '$12,500',
    color: 'from-emerald-500/10 to-transparent',
  },
];

export default function LiveFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    setFeedItems(demoFeedData);

    // Simulate real-time feed updates
    const interval = setInterval(() => {
      setFeedItems((prev) => {
        const newItem: FeedItem = {
          ...demoFeedData[Math.floor(Math.random() * demoFeedData.length)],
          id: Date.now().toString(),
          timeAgo: 'منذ قليل',
        };
        return [newItem, ...prev.slice(0, -1)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0c0f14] to-[#0a0d12]',
      'relative overflow-hidden'
    )}>
      {/* Background accent */}
      <div className={cn(
        'absolute top-1/3 right-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-bl from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            آخر الطلبات والعروض
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Latest Requests & Offers
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
          <p className="text-gray-400 text-center mt-6">
            تحديثات حية من النشاط على المنصة
          </p>
        </div>

        {/* Feed Container */}
        <div className={cn(
          'relative bg-[#0c0f14]/50 backdrop-blur',
          'border border-gray-800/50 rounded-2xl overflow-hidden'
        )}>
          {/* Live indicator */}
          <div className={cn(
            'absolute top-4 right-4 flex items-center gap-2 z-20',
            'bg-[#0c0f14] px-3 py-1 rounded-full border border-[#c41e3a]/30'
          )}>
            <div className="w-2 h-2 rounded-full bg-[#c41e3a] animate-pulse" />
            <span className="text-xs text-[#c41e3a] font-semibold">
              LIVE
            </span>
          </div>

          {/* Feed items */}
          <div className="max-h-[600px] overflow-y-auto scroll-smooth">
            {feedItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'px-6 py-5 border-b border-gray-800/30',
                  'last:border-b-0',
                  'hover:bg-gradient-to-r hover:from-transparent hover:to-[#c41e3a]/5',
                  'transition-all duration-300 cursor-pointer group',
                  'animate-fade-in',
                  index === 0 ? 'bg-gradient-to-r from-[#c41e3a]/10 to-transparent' : ''
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'text-2xl flex-shrink-0 mt-1'
                  )}>
                    {item.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <h3 className={cn(
                          'font-bold text-white mb-1',
                          'group-hover:text-[#d4a843] transition-colors duration-300'
                        )}>
                          {item.titleAr}
                        </h3>
                        <p className="text-sm text-[#d4a843] mb-2 font-medium">
                          {item.titleEn}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                          {item.descriptionAr}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.descriptionEn}
                        </p>
                      </div>

                      {/* Right section */}
                      <div className="text-right flex-shrink-0">
                        {item.amount && (
                          <div className={cn(
                            'text-lg font-bold text-[#d4a843] mb-1'
                          )}>
                            {item.amount}
                          </div>
                        )}

                        {/* Time and country */}
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-500">
                            {item.timeAgo}
                          </span>
                          <span className="text-lg">
                            {item.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Type badge */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                        'transition-all duration-300',
                        item.type === 'request' && 'bg-orange-500/20 text-orange-300',
                        item.type === 'quotation' && 'bg-yellow-500/20 text-yellow-300',
                        item.type === 'deal' && 'bg-green-500/20 text-green-300',
                        item.type === 'product' && 'bg-blue-500/20 text-blue-300'
                      )}>
                        {item.type === 'request' && 'طلب شراء'}
                        {item.type === 'quotation' && 'عرض سعر'}
                        {item.type === 'deal' && 'صفقة منجزة'}
                        {item.type === 'product' && 'منتج جديد'}
                      </span>

                      {/* Arrow icon */}
                      <div className={cn(
                        'opacity-0 group-hover:opacity-100',
                        'transform group-hover:translate-x-1',
                        'transition-all duration-300 ml-auto'
                      )}>
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 gap-4 flex-wrap">
          <button className={cn(
            'px-8 py-3 rounded-lg font-bold',
            'bg-[#c41e3a] hover:bg-[#a01830]',
            'text-white transition-all duration-300',
            'hover:shadow-lg hover:shadow-[#c41e3a]/50'
          )}>
            أنشئ طلب جديد — Post Request
          </button>

          <button className={cn(
            'px-8 py-3 rounded-lg font-bold',
            'border-2 border-[#d4a843] text-[#d4a843]',
            'hover:bg-[#d4a843]/10 transition-all duration-300'
          )}>
            استعرض جميع الطلبات — Browse All
          </button>
        </div>
      </div>

      {/* Custom scroll styling */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .scroll-smooth::-webkit-scrollbar {
          width: 6px;
        }

        .scroll-smooth::-webkit-scrollbar-track {
          background: transparent;
        }

        .scroll-smooth::-webkit-scrollbar-thumb {
          background: #c41e3a;
          border-radius: 3px;
        }

        .scroll-smooth::-webkit-scrollbar-thumb:hover {
          background: #d4a843;
        }
      `}</style>
    </section>
  );
}
