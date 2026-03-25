'use client';

import React from 'react';
import { useLocale } from '@/hooks/useLocale';

interface ShipmentTrackerProps {
  trackingNumber: string;
  currentLocation: string;
  eta: string;
  status: string;
  shippingCompany: string;
  containerNumber: string;
  progress?: number;
}

const STAGES = [
  { id: 'booked', enLabel: 'Booked', arLabel: 'مرسوم' },
  { id: 'pickup', enLabel: 'Picked Up', arLabel: 'تم الاستلام' },
  { id: 'port', enLabel: 'At Port', arLabel: 'في الميناء' },
  { id: 'loaded', enLabel: 'Loaded', arLabel: 'محمل' },
  { id: 'transit', enLabel: 'In Transit', arLabel: 'قيد النقل' },
  { id: 'arrived', enLabel: 'Arrived', arLabel: 'وصل' },
  { id: 'customs', enLabel: 'Customs', arLabel: 'الجمارك' },
  { id: 'delivered', enLabel: 'Delivered', arLabel: 'سُلّم' },
];

export default function ShipmentTracker({
  trackingNumber,
  currentLocation,
  eta,
  status,
  shippingCompany,
  containerNumber,
  progress = 50,
}: ShipmentTrackerProps) {
  const { isRTL, t } = useLocale();
  const currentStageIndex = Math.floor((progress / 100) * (STAGES.length - 1));

  return (
    <div className="bg-[#1a1f2b] rounded-lg p-6 space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
          <p className="text-white font-mono text-lg">{trackingNumber}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Current Location</p>
          <p className="text-white font-semibold">{currentLocation}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">ETA</p>
          <p className="text-white font-semibold">{eta}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Shipping Company</p>
          <p className="text-white font-semibold">{shippingCompany}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#0c0f14] rounded-lg p-4">
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {STAGES.map((stage, idx) => {
            let stageStatus = 'pending';
            if (idx < currentStageIndex) stageStatus = 'completed';
            if (idx === currentStageIndex) stageStatus = 'active';

            return (
              <div key={stage.id} className="flex flex-col items-center min-w-fit">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                    stageStatus === 'completed'
                      ? 'bg-green-500 text-white'
                      : stageStatus === 'active'
                        ? 'bg-[#c41e3a] text-white ring-2 ring-[#d4a843]'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {stageStatus === 'completed' ? '✓' : idx + 1}
                </div>
                <p className="text-xs text-gray-400 text-center whitespace-nowrap">
                  {stage.enLabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Container & Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0c0f14] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Container/Flight Number</p>
          <p className="text-white font-mono text-lg">{containerNumber}</p>
        </div>
        <div className="bg-[#0c0f14] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Status</p>
          <p className="text-white font-semibold">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                status === 'IN_TRANSIT'
                  ? 'bg-blue-500/20 text-blue-300'
                  : status === 'DELIVERED'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </span>
          </p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-[#0c0f14] rounded-lg p-6 h-64 flex items-center justify-center border border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 mb-2">📍 Interactive Map Coming Soon</p>
          <p className="text-gray-500 text-sm">Real-time location tracking will be available here</p>
        </div>
      </div>
    </div>
  );
}
