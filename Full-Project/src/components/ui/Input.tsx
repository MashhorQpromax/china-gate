'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  isRTL?: boolean;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      isRTL = false,
      showPasswordToggle = false,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const baseStyles =
      'w-full px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none disabled:bg-opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      default:
        'bg-[#242830] border-2 border-[#1a1d23] text-white placeholder-gray-500 focus-visible:border-[#d4a843] focus-visible:ring-2 focus-visible:ring-[#d4a843] focus-visible:ring-opacity-20',
      filled:
        'bg-[#1a1d23] border-b-2 border-[#242830] text-white placeholder-gray-500 focus-visible:border-[#c41e3a] focus-visible:ring-0',
    };

    const textAlignment = isRTL ? 'text-right' : 'text-left';

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              'block mb-2 text-sm font-medium text-gray-300',
              isRTL && 'text-right'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && !isRTL && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          {leftIcon && isRTL && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              baseStyles,
              variantStyles[variant],
              textAlignment,
              leftIcon && !isRTL && 'pl-10',
              leftIcon && isRTL && 'pr-10',
              (rightIcon || (isPassword && showPasswordToggle)) && !isRTL && 'pr-10',
              (rightIcon || (isPassword && showPasswordToggle)) && isRTL && 'pl-10',
              error && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500',
              className
            )}
            {...props}
          />
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 flex items-center gap-2',
              isRTL ? 'left-3' : 'right-3'
            )}
          >
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300 focus-visible:outline-none"
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            )}
            {rightIcon && !isPassword && rightIcon}
          </div>
        </div>
        {error && (
          <p
            className={cn(
              'mt-1.5 text-sm text-red-500',
              isRTL && 'text-right'
            )}
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            className={cn(
              'mt-1.5 text-sm text-gray-400',
              isRTL && 'text-right'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
