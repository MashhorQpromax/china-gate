'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type StepStatus = 'completed' | 'active' | 'pending';

interface TimelineStep {
  id: string;
  label: string;
  status: StepStatus;
  icon?: React.ReactNode;
  description?: string;
  timestamp?: string;
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[];
  orientation?: 'vertical' | 'horizontal';
  isRTL?: boolean;
}

const getStatusColor = (status: StepStatus) => {
  switch (status) {
    case 'completed':
      return {
        bg: 'bg-emerald-500',
        border: 'border-emerald-500',
        text: 'text-emerald-400',
      };
    case 'active':
      return {
        bg: 'bg-[#d4a843]',
        border: 'border-[#d4a843]',
        text: 'text-[#d4a843]',
      };
    case 'pending':
      return {
        bg: 'bg-[#242830]',
        border: 'border-[#242830]',
        text: 'text-gray-400',
      };
    default:
      return {
        bg: 'bg-[#242830]',
        border: 'border-[#242830]',
        text: 'text-gray-400',
      };
  }
};

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      steps,
      orientation = 'vertical',
      isRTL = false,
      className,
      ...props
    },
    ref
  ) => {
    if (orientation === 'horizontal') {
      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const statusColor = getStatusColor(step.status);
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {/* Step Circle */}
                    <div className={cn('relative z-10 flex flex-col items-center')}>
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                          statusColor.bg,
                          statusColor.border,
                          step.status === 'active' && 'ring-2 ring-[#d4a843] ring-opacity-50'
                        )}
                      >
                        {step.icon ? (
                          step.icon
                        ) : step.status === 'completed' ? (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              step.status === 'active' ? 'bg-black' : 'bg-[#242830]'
                            )}
                          />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-300 text-center">
                        {step.label}
                      </p>
                    </div>

                    {/* Connector Line */}
                    {!isLast && (
                      <div
                        className={cn(
                          'flex-1 h-1 mx-2',
                          step.status === 'completed'
                            ? 'bg-emerald-500'
                            : 'bg-[#242830]'
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className={cn('space-y-6', isRTL && 'text-right')}>
          {steps.map((step, index) => {
            const statusColor = getStatusColor(step.status);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                      statusColor.bg,
                      statusColor.border,
                      step.status === 'active' && 'ring-2 ring-[#d4a843] ring-opacity-50'
                    )}
                  >
                    {step.icon ? (
                      step.icon
                    ) : step.status === 'completed' ? (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          step.status === 'active' ? 'bg-black' : 'bg-[#242830]'
                        )}
                      />
                    )}
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={cn(
                        'w-1 h-12 mt-2',
                        step.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-[#242830]'
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className={cn('font-semibold text-gray-200', statusColor.text)}>
                    {step.label}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  )}
                  {step.timestamp && (
                    <p className="text-xs text-gray-500 mt-2">{step.timestamp}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

export default Timeline;
