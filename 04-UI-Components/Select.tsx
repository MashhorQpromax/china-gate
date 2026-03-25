'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  placeholder?: string;
  isRTL?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  error?: string;
  label?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      placeholder = 'Select an option',
      isRTL = false,
      isSearchable = false,
      isMulti = false,
      onChange,
      error,
      label,
      value,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
      isMulti && Array.isArray(value) ? value : value ? [value] : []
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = isSearchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const handleSelect = (optionValue: string | number) => {
      if (isMulti) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        setSelectedValues(newValues);
        onChange?.(newValues);
      } else {
        setSelectedValues([optionValue]);
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };

    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && isSearchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, isSearchable]);

    return (
      <div ref={ref} className="w-full">
        {label && (
          <label className={cn('block mb-2 text-sm font-medium text-gray-300', isRTL && 'text-right')}>
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          className="relative"
          {...(isMulti && props)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg font-medium text-left transition-colors duration-200',
              'bg-[#242830] border-2 border-[#1a1d23] text-gray-300',
              'focus-visible:outline-none focus-visible:border-[#d4a843] focus-visible:ring-2 focus-visible:ring-[#d4a843] focus-visible:ring-opacity-20',
              'flex items-center justify-between',
              error && 'border-red-500',
              isRTL && 'text-right'
            )}
          >
            <span className="truncate">
              {selectedLabels.length > 0
                ? isMulti
                  ? `${selectedLabels.length} selected`
                  : selectedLabels[0]
                : placeholder}
            </span>
            <svg
              className={cn(
                'w-5 h-5 transition-transform duration-200 flex-shrink-0',
                isOpen && 'rotate-180'
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

          {isOpen && (
            <div
              className={cn(
                'absolute top-full mt-2 w-full bg-[#1a1d23] border border-[#242830] rounded-lg shadow-lg z-10',
                isRTL && 'right-0'
              )}
            >
              {isSearchable && (
                <div className="p-3 border-b border-[#242830]">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 bg-[#242830] border border-[#1a1d23] rounded-lg text-sm text-white placeholder-gray-500',
                      'focus-visible:outline-none focus-visible:border-[#d4a843]',
                      isRTL && 'text-right'
                    )}
                  />
                </div>
              )}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full px-4 py-2.5 text-left font-medium transition-colors duration-200',
                        'hover:bg-[#242830] border-b border-[#242830] last:border-b-0',
                        selectedValues.includes(option.value) &&
                          'bg-[#242830] text-[#d4a843]',
                        isRTL && 'text-right'
                      )}
                    >
                      {isMulti && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            readOnly
                            className="w-4 h-4 rounded"
                          />
                          <span>{option.label}</span>
                        </div>
                      )}
                      {!isMulti && option.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400">
                    No options available
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className={cn('mt-1.5 text-sm text-red-500', isRTL && 'text-right')}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
