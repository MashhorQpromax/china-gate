'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      showDot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';

    const variantStyles = {
      default: 'bg-[#242830] text-gray-300',
      success: 'bg-emerald-500 bg-opacity-10 text-emerald-400',
      warning: 'bg-amber-500 bg-opacity-10 text-amber-400',
      danger: 'bg-red-500 bg-opacity-10 text-red-400',
      info: 'bg-blue-500 bg-opacity-10 text-blue-400',
      gold: 'bg-[#d4a843] bg-opacity-10 text-[#d4a843]',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    };

    const dotColors = {
      default: 'bg-gray-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      gold: 'bg-[#d4a843]',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {showDot && <div className={cn('w-2 h-2 rounded-full', dotColors[variant])} />}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
