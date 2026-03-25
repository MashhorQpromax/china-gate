'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isOnline?: boolean;
  badge?: React.ReactNode;
  alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      initials,
      size = 'md',
      isOnline = false,
      badge,
      alt = 'Avatar',
      className,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    };

    const baseBadgeStyles = {
      xs: 'w-2 h-2',
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
    };

    return (
      <div ref={ref} className={cn('relative inline-flex', className)} {...props}>
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-[#c41e3a] to-[#d4a843] overflow-hidden',
            sizeStyles[size]
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-semibold text-white">{initials?.slice(0, 2)}</span>
          )}
        </div>

        {isOnline && (
          <div
            className={cn(
              'absolute bottom-0 right-0 bg-emerald-500 rounded-full border-2 border-[#0c0f14]',
              baseBadgeStyles[size]
            )}
          />
        )}

        {badge && (
          <div className="absolute top-0 right-0">
            {badge}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
