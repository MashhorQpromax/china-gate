'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  isRTL?: boolean;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string;
  isActive: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTab,
      onTabChange,
      isRTL = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn(
            'flex border-b border-[#242830] gap-2',
            isRTL && 'flex-row-reverse'
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'relative px-4 py-3 font-medium text-sm transition-colors duration-200',
                'hover:text-[#d4a843]',
                activeTab === tab.id
                  ? 'text-[#d4a843]'
                  : 'text-gray-400',
                isRTL && 'flex-row-reverse'
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <div className="flex-shrink-0">{tab.icon}</div>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="bg-[#c41e3a] text-white text-xs rounded-full px-2 py-0.5">
                    {tab.badge}
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-1 bg-[#d4a843] rounded-t transition-all duration-300'
                  )}
                />
              )}
            </button>
          ))}
        </div>
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ tabId, isActive, className, children, ...props }, ref) => {
    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={cn('animate-in fade-in duration-200', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsContent };
