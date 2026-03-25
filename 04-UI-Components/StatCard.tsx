'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TrendType = 'up' | 'down' | 'neutral';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  icon?: React.ReactNode;
  trend?: {
    type: TrendType;
    percentage: number;
  };
  variant?: 'compact' | 'full';
  animateCounter?: boolean;
  suffix?: string;
  prefix?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      icon,
      trend,
      variant = 'full',
      animateCounter = true,
      suffix = '',
      prefix = '',
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (!animateCounter) {
        setDisplayValue(value);
        return;
      }

      let current = 0;
      const increment = Math.ceil(value / 20);
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, 30);

      return () => clearInterval(timer);
    }, [value, animateCounter]);

    const getTrendColor = (type: TrendType) => {
      switch (type) {
        case 'up':
          return 'text-emerald-400';
        case 'down':
          return 'text-red-400';
        case 'neutral':
          return 'text-gray-400';
        default:
          return 'text-gray-400';
      }
    };

    const getTrendIcon = (type: TrendType) => {
      switch (type) {
        case 'up':
          return (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L13.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'down':
          return (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 1.414L9.414 13H12z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    const baseStyles = 'bg-[#1a1d23] border border-[#242830] rounded-xl transition-all duration-200 hover:shadow-lg';

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn(baseStyles, 'p-4', className)}
          {...props}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 p-2 bg-[#242830] rounded-lg text-[#d4a843]">
                {icon}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-100">
                {prefix}
                {displayValue.toLocaleString()}
                {suffix}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, 'p-6', className)}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-gray-100">
              {prefix}
              {displayValue.toLocaleString()}
              {suffix}
            </h3>
          </div>
          {icon && (
            <div className="p-3 bg-[#242830] rounded-lg text-[#d4a843]">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor(trend.type))}>
            {getTrendIcon(trend.type)}
            <span>
              {trend.type === 'up' ? '+' : trend.type === 'down' ? '-' : ''}{' '}
              {trend.percentage}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
