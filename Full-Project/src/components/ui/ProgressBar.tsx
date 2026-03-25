'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gold';
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      percentage,
      color = 'primary',
      showLabel = true,
      animated = true,
      className,
      ...props
    },
    ref
  ) => {
    const percentage100 = Math.min(Math.max(percentage, 0), 100);

    const colorStyles = {
      primary: 'bg-[#c41e3a]',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      gold: 'bg-[#d4a843]',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          {showLabel && (
            <span className="text-sm font-semibold text-gray-200">
              {percentage100}%
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-[#242830] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500',
              colorStyles[color],
              animated && 'animate-pulse'
            )}
            style={{
              width: `${percentage100}%`,
            }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
