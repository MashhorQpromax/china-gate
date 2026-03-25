'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PartnershipOffer {
  id: string;
  supplierName: string;
  rating: number;
  capacityOffered: number;
  pricePerUnit: number;
  startTimeline: string;
  trainingReady: boolean;
  availableTechnicians: number;
  certifications: string[];
  requestId: string;
}

interface PartnershipOfferCardProps {
  offer: PartnershipOffer;
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
  onAccept?: (offerId: string) => void;
  onNegotiate?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
}

export default function PartnershipOfferCard({
  offer,
  currentLanguage = 'en',
  isRTL = false,
  onAccept,
  onNegotiate,
  onReject,
}: PartnershipOfferCardProps) {
  return (
    <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all">
      {/* Header */}
      <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
        <div className={cn('flex-1', isRTL && 'text-right')}>
          <h3 className="text-lg font-semibold mb-1">{offer.supplierName}</h3>
          <p className={cn('text-sm text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'موضوع الطلب:' : 'Request ID:'} {offer.requestId}
          </p>
        </div>

        <div className={cn('text-right', isRTL && 'text-left')}>
          <div className="flex justify-end text-[#d4a843] mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.floor(offer.rating / 1) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-400">{offer.rating}/5</span>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[#242830]', isRTL && 'text-right')}>
        <div>
          <p className="text-xs text-gray-400 mb-1">
            {currentLanguage === 'ar' ? 'القدرة المعروضة' : 'Capacity Offered'}
          </p>
          <p className="font-bold">
            {offer.capacityOffered.toLocaleString()} {currentLanguage === 'ar' ? 'وحدة/شهر' : 'units/month'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">
            {currentLanguage === 'ar' ? 'السعر' : 'Price per Unit'}
          </p>
          <p className="font-bold text-[#d4a843]">
            ${offer.pricePerUnit.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">
            {currentLanguage === 'ar' ? 'بدء الإنتاج' : 'Production Start'}
          </p>
          <p className="font-bold">{offer.startTimeline}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">
            {currentLanguage === 'ar' ? 'الفنيون المتاحون' : 'Available Technicians'}
          </p>
          <p className="font-bold text-blue-400">{offer.availableTechnicians}</p>
        </div>
      </div>

      {/* Features */}
      <div className={cn('grid grid-cols-2 gap-4 mb-6', isRTL && 'text-right')}>
        {/* Training Ready */}
        <div className="flex items-start gap-3">
          <span className={cn('text-lg mt-1', offer.trainingReady ? '✓' : '○')}>
            {offer.trainingReady ? '✓' : '○'}
          </span>
          <div>
            <p className="font-medium">
              {currentLanguage === 'ar' ? 'جاهز للتدريب' : 'Training Ready'}
            </p>
            <p className="text-xs text-gray-400">
              {currentLanguage === 'ar' ? 'برامج تدريب متاحة' : 'Training programs available'}
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex items-start gap-3">
          <span className="text-lg mt-1">🏅</span>
          <div>
            <p className="font-medium">
              {currentLanguage === 'ar' ? 'معايير معتمدة' : 'Certifications'}
            </p>
            <p className="text-xs text-gray-400">
              {offer.certifications.length} {currentLanguage === 'ar' ? 'معايير' : 'standards'}
            </p>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className={cn('mb-6 pb-6 border-b border-[#242830]', isRTL && 'text-right')}>
        <p className={cn('text-sm font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'الشهادات:' : 'Certifications:'}
        </p>
        <div className={cn('flex flex-wrap gap-2', isRTL && 'flex-row-reverse')}>
          {offer.certifications.map((cert) => (
            <span
              key={cert}
              className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700"
            >
              ✓ {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Photos/Video Placeholder */}
      <div className="mb-6 p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
        <p className={cn('text-sm font-semibold mb-3', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'صور خط الإنتاج' : 'Production Line Photos/Video'}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="aspect-video bg-[#0c0f14] border border-[#242830] rounded-lg flex items-center justify-center text-gray-500 hover:border-[#c41e3a] transition-colors cursor-pointer"
            >
              📸 {idx}
            </div>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <div className={cn('mb-6 p-4 bg-[#c41e3a]/10 border border-[#c41e3a]/30 rounded-lg', isRTL && 'text-right')}>
        <p className={cn('text-xs text-gray-400 mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'تقدير التكلفة الشهرية' : 'Estimated Monthly Cost'}
        </p>
        <div className={cn('flex items-baseline gap-2', isRTL && 'flex-row-reverse')}>
          <span className="text-2xl font-bold text-[#d4a843]">
            ${(offer.capacityOffered * offer.pricePerUnit).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-gray-400">
            ({offer.capacityOffered.toLocaleString()} × ${offer.pricePerUnit})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
        <button
          onClick={() => onAccept?.(offer.id)}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
        >
          {currentLanguage === 'ar' ? '✓ قبول' : '✓ Accept'}
        </button>
        <button
          onClick={() => onNegotiate?.(offer.id)}
          className="flex-1 px-4 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded-lg hover:bg-[#d4a843]/30 transition-colors font-medium text-sm"
        >
          {currentLanguage === 'ar' ? '💬 التفاوض' : '💬 Negotiate'}
        </button>
        <button
          onClick={() => onReject?.(offer.id)}
          className="flex-1 px-4 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors font-medium text-sm"
        >
          {currentLanguage === 'ar' ? '✗ رفض' : '✗ Reject'}
        </button>
      </div>
    </div>
  );
}
