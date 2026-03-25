'use client';

import { cn } from '@/lib/utils';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import SectorsGrid from './SectorsGrid';
import PlatformStats from './PlatformStats';
import LiveFeed from './LiveFeed';
import ServicesSection from './ServicesSection';
import ShippingPartners from './ShippingPartners';
import PartnersSection from './PartnersSection';
import ContactSection from './ContactSection';

export default function LandingPage() {
  return (
    <main className={cn(
      'w-full',
      'bg-[#0c0f14]'
    )}>
      {/* Hero Section */}
      <HeroSection />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* How It Works */}
      <HowItWorks />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Sectors Grid */}
      <SectorsGrid />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Platform Stats */}
      <PlatformStats />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Live Feed */}
      <LiveFeed />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Services Section */}
      <ServicesSection />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Shipping Partners */}
      <ShippingPartners />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Partners Section */}
      <PartnersSection />

      {/* Divider */}
      <div className={cn(
        'h-px bg-gradient-to-r from-transparent via-[#c41e3a]/30 to-transparent',
        'w-full'
      )} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className={cn(
        'bg-[#0a0d12] border-t border-gray-800/50',
        'py-12 px-4'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className={cn(
                'text-2xl font-bold mb-2',
                'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
                'bg-clip-text text-transparent'
              )}>
                بوابة الصين
              </h3>
              <p className="text-gray-400">China Gate</p>
              <p className="text-gray-600 text-sm mt-2">
                نربط الخليج بالصين
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    الخدمات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    المدونة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    الشروط والأحكام
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4">القانوني</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    الاستخدام المقبول
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    معلومات الأمان
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#d4a843] transition-colors duration-300">
                    اتصل بنا
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-800/50 mb-8" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm text-center sm:text-left mb-4 sm:mb-0">
              © 2024 بوابة الصين. جميع الحقوق محفوظة.
            </p>

            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                👍
              </a>
              <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                📸
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Smooth scroll behavior */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </main>
  );
}
