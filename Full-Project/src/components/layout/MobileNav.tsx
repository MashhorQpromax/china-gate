'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isRTL?: boolean;
}

const MobileNav = React.forwardRef<HTMLDivElement, MobileNavProps>(
  ({ isRTL = false, className }, ref) => {
    const pathname = usePathname();

    const navItems: MobileNavItem[] = [
      {
        id: 'home',
        label: 'Home',
        href: '/',
        icon: '🏠',
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        href: '/marketplace',
        icon: '🛒',
      },
      {
        id: 'create',
        label: 'Create',
        href: '/create',
        icon: '➕',
      },
      {
        id: 'messages',
        label: 'Messages',
        href: '/messages',
        icon: '💬',
      },
      {
        id: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: '👤',
      },
    ];

    return (
      <nav
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          'bg-[#0c0f14] border-t border-[#242830]',
          'md:hidden',
          className
        )}
      >
        <div
          className={cn(
            'flex items-center justify-around h-16',
            isRTL && 'flex-row-reverse'
          )}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200',
                  'hover:bg-[#242830]',
                  isActive && 'text-[#d4a843] border-t-2 border-[#d4a843]'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
);

MobileNav.displayName = 'MobileNav';

export default MobileNav;
