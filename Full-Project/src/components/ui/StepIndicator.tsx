'use client';

interface StepIndicatorProps {
  steps: Array<{
    id: string;
    label: string;
    label_ar: string;
  }>;
  current: number;
  dir?: 'ltr' | 'rtl';
}

export function StepIndicator({
  steps,
  current,
  dir = 'rtl',
}: StepIndicatorProps) {
  const isRTL = dir === 'rtl';

  return (
    <div className={`w-full mb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isUpcoming = index > current;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : isCurrent
                      ? 'bg-red-600 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-gray-900'
                      : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-red-400'
                      : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-400'
                  }`}
                >
                  {isRTL ? step.label_ar : step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute w-12 h-0.5 top-5 ${
                    isRTL ? 'right-[calc(50%+20px)]' : 'left-[calc(50%+20px)]'
                  } ${
                    isCompleted
                      ? 'bg-green-600'
                      : 'bg-gray-700'
                  }`}
                  style={{
                    top: '20px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Connector Lines (rendered separately) */}
      <div className="relative h-10 mb-4">
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null;

          const isCompleted = index < current;
          return (
            <div
              key={`connector-${index}`}
              className={`absolute h-0.5 top-1 ${
                isRTL
                  ? `right-[calc(${(index + 1) * (100 / steps.length)}% - 20px)]`
                  : `left-[calc(${(index + 1) * (100 / steps.length)}% - 20px)]`
              } w-[calc(${100 / steps.length}% - 20px)] ${
                isCompleted ? 'bg-green-600' : 'bg-gray-700'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
