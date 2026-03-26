'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    initials: string;
    avatar?: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
  onLanguageChange?: (lang: 'en' | 'ar' | 'zh') => void;
  currentLanguage?: 'en' | 'ar' | 'zh';
  notificationCount?: number;
  isRTL?: boolean;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      isAuthenticated = false,
      user,
      onLogin,
      onLogout,
      onLanguageChange,
      currentLanguage = 'en',
      notificationCount = 0,
      isRTL = false,
    },
    ref
  ) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Track inquiry cart count from localStorage
    useEffect(() => {
      const updateCartCount = () => {
        try {
          const cart = JSON.parse(localStorage.getItem('cg_inquiry_cart') || '[]');
          setCartCount(cart.length);
        } catch { setCartCount(0); }
      };
      updateCartCount();
      window.addEventListener('inquiry-cart-updated', updateCartCount);
      window.addEventListener('storage', updateCartCount);
      return () => {
        window.removeEventListener('inquiry-cart-updated', updateCartCount);
        window.removeEventListener('storage', updateCartCount);
      };
    }, []);

    const languages = [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'العربية' },
      { code: 'zh', label: '中文' },
    ] as const;

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 w-full',
          'bg-[#0c0f14] bg-opacity-80 backdrop-blur-md',
          'border-b border-[#242830]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn('flex items-center justify-between h-16', isRTL && 'flex-row-reverse')}>
            {/* Logo */}
            <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
              <div className="text-2xl">🇨🇳🇸🇦</div>
              <h1 className="text-xl font-bold text-white hidden sm:block">
                China Gate
              </h1>
            </div>

            {/* Center navigation - hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              <nav className={cn('flex gap-6', isRTL && 'flex-row-reverse')}>
                <a href="/" className="text-gray-300 hover:text-[#d4a843] transition-colors text-sm">
                  Dashboard
                </a>
                <a href="/marketplace" className="text-gray-300 hover:text-[#d4a843] transition-colors text-sm">
                  Marketplace
                </a>
                <a href="/deals" className="text-gray-300 hover:text-[#d4a843] transition-colors text-sm">
                  Deals
                </a>
              </nav>
            </div>

            {/* Right side items */}
            <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
              {/* Inquiry Cart */}
              <a href="/marketplace/inquiry-cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <Badge
                    variant="danger"
                    size="sm"
                    className="absolute -top-2 -right-2 px-2 py-0.5"
                  >
                    {cartCount}
                  </Badge>
                )}
              </a>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notificationCount > 0 && (
                    <Badge
                      variant="danger"
                      size="sm"
                      className="absolute -top-2 -right-2 px-2 py-0.5"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </button>
              )}

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  {currentLanguage.toUpperCase()}
                </button>

                {showLanguageMenu && (
                  <div
                    className={cn(
                      'absolute top-full mt-2 bg-[#1a1d23] border border-[#242830] rounded-lg shadow-lg overflow-hidden',
                      isRTL ? 'right-0' : 'left-0'
                    )}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange?.(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-[#242830] transition-colors',
                          currentLanguage === lang.code && 'bg-[#242830] text-[#d4a843]'
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth buttons / User menu */}
              {!isAuthenticated ? (
                <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogin}
                    className="hidden sm:inline-flex"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onLogin}
                    className="hidden sm:inline-flex"
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <Avatar
                      initials={user?.initials}
                      src={user?.avatar}
                      size="sm"
                      isOnline
                    />
                  </button>

                  {showUserMenu && (
                    <div
                      className={cn(
                        'absolute top-full mt-2 w-48 bg-[#1a1d23] border border-[#242830] rounded-lg shadow-lg overflow-hidden',
                        isRTL ? 'right-0' : 'left-0'
                      )}
                    >
                      <div className="px-4 py-3 border-b border-[#242830]">
                        <p className="font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">Premium Member</p>
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#242830] transition-colors"
                      >
                        Profile Settings
                      </a>
                      <a
                        href="/messages"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#242830] transition-colors"
                      >
                        Messages
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-gray-300 hover:bg-[#242830] transition-colors"
                      >
                        Settings
                      </a>
                      <button
                        onClick={() => {
                          onLogout?.();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#242830] transition-colors border-t border-[#242830]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden pb-4 border-t border-[#242830]">
              <nav className="flex flex-col gap-2 pt-4">
                <a href="/" className="px-4 py-2 text-gray-300 hover:bg-[#242830] rounded transition-colors">
                  Dashboard
                </a>
                <a href="/marketplace" className="px-4 py-2 text-gray-300 hover:bg-[#242830] rounded transition-colors">
                  Marketplace
                </a>
                <a href="/deals" className="px-4 py-2 text-gray-300 hover:bg-[#242830] rounded transition-colors">
                  Deals
                </a>
              </nav>
              {!isAuthenticated && (
                <div className="flex gap-2 px-4 pt-4 border-t border-[#242830] mt-4">
                  <Button variant="ghost" size="sm" onClick={onLogin} className="flex-1">
                    Login
                  </Button>
                  <Button variant="primary" size="sm" onClick={onLogin} className="flex-1">
                    Register
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;
