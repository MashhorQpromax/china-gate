'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  isRTL?: boolean;
  onLanguageChange?: (lang: 'en' | 'ar' | 'zh') => void;
}

const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ isRTL = false, onLanguageChange, className }, ref) => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
      {
        name: 'LinkedIn',
        icon: '💼',
        href: 'https://linkedin.com',
      },
      {
        name: 'X (Twitter)',
        icon: '𝕏',
        href: 'https://twitter.com',
      },
      {
        name: 'WeChat',
        icon: '🇨🇳',
        href: '#',
      },
      {
        name: 'WhatsApp',
        icon: '💬',
        href: 'https://whatsapp.com',
      },
    ];

    return (
      <footer
        ref={ref}
        className={cn(
          'bg-[#0c0f14] border-t border-[#242830]',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className={cn(
            'grid grid-cols-1 md:grid-cols-4 gap-8 py-12',
            isRTL && 'text-right'
          )}>
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🇨🇳🇸🇦</span>
                <span>China Gate</span>
              </h3>
              <p className="text-sm text-gray-400">
                Connecting China and Saudi Arabia through seamless B2B trade and partnerships.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold text-white mb-4">Languages</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onLanguageChange?.('en')}
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors text-left"
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onLanguageChange?.('ar')}
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors text-left"
                  >
                    العربية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onLanguageChange?.('zh')}
                    className="text-sm text-gray-400 hover:text-[#d4a843] transition-colors text-left"
                  >
                    中文
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#242830]" />

          {/* Bottom footer */}
          <div className={cn(
            'flex flex-col md:flex-row items-center justify-between gap-4 py-8',
            isRTL && 'flex-row-reverse'
          )}>
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} China Gate. All rights reserved.
            </p>

            {/* Social links */}
            <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="w-10 h-10 rounded-full bg-[#242830] flex items-center justify-center text-gray-300 hover:bg-[#c41e3a] hover:text-white transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
