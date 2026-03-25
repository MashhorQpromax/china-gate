import React from 'react';
import { DealStage } from '@/types';

interface DealStageTrackerProps {
  currentStage: DealStage;
}

export default function DealStageTracker({ currentStage }: DealStageTrackerProps) {
  const stages = [
    { value: DealStage.NEGOTIATION, label: '1. Negotiation', abbr: 'Neg' },
    { value: DealStage.QUOTATION_SENT, label: '2. Quote Sent', abbr: 'Quote' },
    { value: DealStage.QUOTATION_REVIEW, label: '3. Quote Review', abbr: 'Review' },
    { value: DealStage.QUOTATION_ACCEPTED, label: '4. Quote Accepted', abbr: 'Accept' },
    { value: DealStage.PO_ISSUED, label: '5. PO Issued', abbr: 'PO' },
    { value: DealStage.PO_CONFIRMED, label: '6. PO Confirmed', abbr: 'Confirm' },
    { value: DealStage.PRODUCTION_START, label: '7. Production', abbr: 'Prod' },
    { value: DealStage.PRODUCTION_INSPECTION, label: '8. Quality Check', abbr: 'QC' },
    { value: DealStage.READY_FOR_SHIPMENT, label: '9. Ready Ship', abbr: 'Ready' },
    { value: DealStage.LC_ISSUED, label: '10. LC Issued', abbr: 'LC' },
    { value: DealStage.GOODS_SHIPPED, label: '11. Shipped', abbr: 'Ship' },
    { value: DealStage.GOODS_IN_TRANSIT, label: '12. In Transit', abbr: 'Transit' },
    { value: DealStage.PORT_ARRIVED, label: '13. Port Arrived', abbr: 'Port' },
    { value: DealStage.CUSTOMS_CLEARANCE, label: '14. Customs', abbr: 'Customs' },
    { value: DealStage.DELIVERY, label: '15. Delivery', abbr: 'Delivery' },
    { value: DealStage.COMPLETED, label: '16. Completed', abbr: 'Done' },
  ];

  const currentIndex = stages.findIndex(s => s.value === currentStage);
  const isCompleted = (index: number) => index < currentIndex;
  const isCurrent = (index: number) => index === currentIndex;
  const isUpcoming = (index: number) => index > currentIndex;

  return (
    <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-6">15-Stage Deal Journey</h3>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-full">
          {stages.map((stage, idx) => (
            <div key={stage.value} className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted(idx)
                    ? 'bg-green-500/20 text-green-300 border border-green-400'
                    : isCurrent(idx)
                      ? 'bg-[#c41e3a]/30 text-[#c41e3a] border border-[#c41e3a] animate-pulse'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                }`}
              >
                {idx + 1}
              </div>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400 font-semibold">{stage.abbr}</p>
              </div>
              {idx < stages.length - 1 && (
                <div
                  className={`w-8 h-0.5 mt-2 ${isCompleted(idx + 1) ? 'bg-green-500' : 'bg-gray-700'}`}
                  style={{ marginTop: '-6px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-2">
          {stages.map((stage, idx) => (
            <div key={stage.value} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  isCompleted(idx)
                    ? 'bg-green-500/20 text-green-300 border border-green-400'
                    : isCurrent(idx)
                      ? 'bg-[#c41e3a]/30 text-[#c41e3a] border border-[#c41e3a] animate-pulse'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                }`}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isCurrent(idx) ? 'text-white' : 'text-gray-400'}`}>
                  {stage.label}
                </p>
              </div>
              {isCurrent(idx) && <span className="text-[#c41e3a] font-bold">●</span>}
              {isCompleted(idx) && <span className="text-green-400">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Current Stage Expanded View */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="bg-[#0c0f14] rounded-lg p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Current Stage</p>
          <p className="text-white font-semibold text-lg">{stages[currentIndex]?.label}</p>
          <p className="text-gray-400 text-sm mt-2">You are {currentIndex + 1} of {stages.length} stages into this deal.</p>
        </div>
      </div>
    </div>
  );
}
