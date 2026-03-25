'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    initials: string;
    avatar?: string;
  };
  userRole?: 'buyer' | 'seller' | 'admin';
  isRTL?: boolean;
  notificationCount?: number;
  onLanguageChange?: (lang: 'en' | 'ar' | 'zh') => void;
  currentLanguage?: 'en' | 'ar' | 'zh';
  onLogin?: () => void;
  onLogout?: () => void;
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      isAuthenticated = true,
      user = {
        name: 'John Doe',
        initials: 'JD',
        avatar: undefined,
      },
      userRole = 'buyer',
      isRTL = false,
      notificationCount = 0,
      onLanguageChange,
      currentLanguage = 'en',
      onLogin,
      onLogout,
    },
    ref
  ) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen bg-[#0c0f14] text-white',
          isRTL && 'rtl'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          onLanguageChange={onLanguageChange}
          currentLanguage={currentLanguage}
          notificationCount={notificationCount}
          isRTL={isRTL}
        />

        {/* Main layout container */}
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isRTL={isRTL}
            userRole={userRole}
          />

          {/* Main content */}
          <main
            className={cn(
              'flex-1 overflow-auto',
              'pb-24 md:pb-0' // Add padding for mobile nav
            )}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>

            {/* Footer */}
            <Footer
              isRTL={isRTL}
              onLanguageChange={onLanguageChange}
            />
          </main>
        </div>

        {/* Mobile navigation */}
        <MobileNav isRTL={isRTL} />

        {/* Sidebar toggle button for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'md:hidden fixed bottom-20 right-4 z-30',
            'p-3 bg-[#c41e3a] text-white rounded-full shadow-lg',
            'hover:bg-red-700 transition-all duration-200'
          )}
          title="Toggle sidebar"
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
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
