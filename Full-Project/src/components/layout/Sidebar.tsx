'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: SidebarItem[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  isRTL?: boolean;
  userRole?: 'buyer' | 'seller' | 'admin';
}

const SidebarLink: React.FC<{
  item: SidebarItem;
  isActive: boolean;
  isRTL?: boolean;
}> = ({ item, isActive, isRTL }) => (
  <Link
    href={item.href}
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
      isActive
        ? 'bg-[#c41e3a] text-white'
        : 'text-gray-400 hover:text-white hover:bg-[#242830]',
      isRTL && 'flex-row-reverse'
    )}
  >
    {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
    <span className="flex-1 text-sm font-medium">{item.label}</span>
    {item.badge !== undefined && (
      <Badge variant="danger" size="sm">
        {item.badge}
      </Badge>
    )}
  </Link>
);

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ isOpen = true, onClose, isRTL = false, userRole = 'buyer', className }, ref) => {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpanded = (itemId: string) => {
      setExpandedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    };

    // Base menu items
    const baseItems: SidebarItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: '📊',
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        href: '/marketplace',
        icon: '🛒',
      },
      {
        id: 'deals',
        label: 'Deals',
        href: '/deals',
        icon: '🤝',
        badge: 3,
      },
      {
        id: 'shipping',
        label: 'Shipping',
        href: '/shipping',
        icon: '📦',
      },
      {
        id: 'banking',
        label: 'Banking',
        href: '/banking',
        icon: '🏦',
      },
      {
        id: 'quality',
        label: 'Quality',
        href: '/quality',
        icon: '✅',
      },
      {
        id: 'partnerships',
        label: 'Partnerships',
        href: '/partnerships',
        icon: '🤖',
      },
      {
        id: 'lclg',
        label: 'LC/LG',
        href: '/lclg',
        icon: '📄',
      },
      {
        id: 'messages',
        label: 'Messages',
        href: '/messages',
        icon: '💬',
        badge: 5,
      },
    ];

    // Role-based items
    const roleItems =
      userRole === 'admin'
        ? [...baseItems, {
            id: 'analytics',
            label: 'Analytics',
            href: '/analytics',
            icon: '📈',
          }]
        : baseItems;

    const menuItems = [
      ...roleItems,
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: '⚙️',
      },
    ];

    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            'fixed md:relative z-40 h-screen w-64 bg-[#1a1d23] border-r border-[#242830]',
            'transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            isRTL && 'border-r-0 border-l border-l-[#242830]',
            isRTL && (isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'),
            className
          )}
        >
          <div className="h-full overflow-y-auto flex flex-col">
            {/* Sidebar header */}
            <div className={cn('px-6 py-4 border-b border-[#242830] flex items-center justify-between', isRTL && 'flex-row-reverse')}>
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button
                onClick={onClose}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const isExpandable = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.id);

                return (
                  <div key={item.id}>
                    <div
                      className="flex items-center"
                      onClick={() => isExpandable && toggleExpanded(item.id)}
                    >
                      {isExpandable ? (
                        <button
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                            isActive
                              ? 'bg-[#c41e3a] text-white'
                              : 'text-gray-400 hover:text-white hover:bg-[#242830]',
                            isRTL && 'flex-row-reverse'
                          )}
                        >
                          {item.icon && (
                            <div className="flex-shrink-0">{item.icon}</div>
                          )}
                          <span className="flex-1 text-sm font-medium text-left">
                            {item.label}
                          </span>
                          <svg
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      ) : (
                        <SidebarLink item={item} isActive={isActive} isRTL={isRTL} />
                      )}
                    </div>

                    {/* Submenu items */}
                    {isExpandable && isExpanded && (
                      <div className="ml-4 space-y-1 mt-1 border-l border-[#242830]">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <SidebarLink
                              key={child.id}
                              item={child}
                              isActive={isChildActive}
                              isRTL={isRTL}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Sidebar footer */}
            <div className="px-4 py-4 border-t border-[#242830] space-y-2">
              <p className="text-xs text-gray-500 px-4">v1.0.0</p>
              <button className="w-full px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#242830] transition-colors">
                Documentation
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
