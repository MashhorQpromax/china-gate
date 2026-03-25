'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FinalAcceptanceFormProps {
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
  onSubmit?: (data: any) => void;
}

export default function FinalAcceptanceForm({
  currentLanguage = 'en',
  isRTL = false,
  onSubmit,
}: FinalAcceptanceFormProps) {
  const [checklist, setChecklist] = useState({
    quantityMatches: false,
    specsMatch: false,
    packagingIntact: false,
    noDamage: false,
    labelsCorrect: false,
  });

  const [decision, setDecision] = useState<'accept' | 'partial' | 'reject' | 'dispute' | null>(null);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handleCheckboxChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        checklist,
        decision,
        notes,
        photos,
      });
    }
  };

  const checklistItems = [
    {
      key: 'quantityMatches',
      en: 'Quantity matches',
      ar: 'الكمية مطابقة',
      icon: '📦',
    },
    {
      key: 'specsMatch',
      en: 'Specifications match',
      ar: 'المواصفات مطابقة',
      icon: '✔️',
    },
    {
      key: 'packagingIntact',
      en: 'Packaging intact',
      ar: 'التغليف سليم',
      icon: '🎁',
    },
    {
      key: 'noDamage',
      en: 'No visible damage',
      ar: 'لا أضرار ظاهرة',
      icon: '👁️',
    },
    {
      key: 'labelsCorrect',
      en: 'Labels correct',
      ar: 'العلامات صحيحة',
      icon: '🏷️',
    },
  ];

  const allChecked = Object.values(checklist).every(v => v === true);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Checklist */}
      <div>
        <h4 className={cn('font-semibold mb-4', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'قائمة التحقق' : 'Acceptance Checklist'}
        </h4>
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <label
              key={item.key}
              className={cn(
                'flex items-center gap-3 p-4 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a] transition-all',
                isRTL && 'flex-row-reverse'
              )}
            >
              <input
                type="checkbox"
                checked={checklist[item.key as keyof typeof checklist]}
                onChange={() => handleCheckboxChange(item.key as keyof typeof checklist)}
                className="w-5 h-5 accent-[#c41e3a] cursor-pointer"
              />
              <span className="text-lg">{item.icon}</span>
              <span className={cn('flex-1', isRTL && 'text-right')}>
                {currentLanguage === 'ar' ? item.ar : item.en}
              </span>
              <span
                className={cn(
                  'text-lg',
                  checklist[item.key as keyof typeof checklist] ? 'text-green-400' : 'text-gray-500'
                )}
              >
                {checklist[item.key as keyof typeof checklist] ? '✓' : '○'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <h4 className={cn('font-semibold mb-4', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'تحميل الصور' : 'Upload Photos'}
        </h4>
        <div className="p-4 border-2 border-dashed border-[#242830] rounded-lg hover:border-[#c41e3a] transition-colors cursor-pointer bg-[#0c0f14]/50">
          <div className={cn('flex flex-col items-center justify-center py-8', isRTL && 'text-right')}>
            <span className="text-3xl mb-2">📷</span>
            <p className="text-gray-400">
              {currentLanguage === 'ar'
                ? 'انقر لتحميل الصور أو اسحب الملفات هنا'
                : 'Click to upload photos or drag files here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {currentLanguage === 'ar' ? 'PNG, JPG حتى 5MB' : 'PNG, JPG up to 5MB'}
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          />
        </div>
        {photos.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-400 mb-2">
              {currentLanguage === 'ar' ? 'الملفات المختارة' : 'Selected files'}:
            </p>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#0c0f14] border border-[#242830] rounded text-sm text-gray-300">
                  {photo.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={currentLanguage === 'ar'
            ? 'أضف أي ملاحظات أو مخاوف...'
            : 'Add any notes or concerns...'}
          className={cn(
            'w-full px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none resize-none',
            isRTL && 'text-right'
          )}
          rows={4}
        />
      </div>

      {/* Decision Buttons */}
      <div>
        <h4 className={cn('font-semibold mb-4', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'القرار' : 'Decision'}
        </h4>
        <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', isRTL && 'text-right')}>
          <button
            type="button"
            onClick={() => setDecision('accept')}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-all',
              decision === 'accept'
                ? 'bg-green-600 text-white'
                : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-green-700'
            )}
          >
            {currentLanguage === 'ar' ? '✓ قبول' : '✓ Accept'}
          </button>

          <button
            type="button"
            onClick={() => setDecision('partial')}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-all',
              decision === 'partial'
                ? 'bg-yellow-600 text-white'
                : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-yellow-700'
            )}
          >
            {currentLanguage === 'ar' ? '⚠️ جزئياً' : '⚠️ Partial'}
          </button>

          <button
            type="button"
            onClick={() => setDecision('reject')}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-all',
              decision === 'reject'
                ? 'bg-red-600 text-white'
                : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-red-700'
            )}
          >
            {currentLanguage === 'ar' ? '❌ رفض' : '❌ Reject'}
          </button>

          <button
            type="button"
            onClick={() => setDecision('dispute')}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-all',
              decision === 'dispute'
                ? 'bg-red-900/60 text-red-300'
                : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-red-700'
            )}
          >
            {currentLanguage === 'ar' ? '🚩 نزاع' : '🚩 Dispute'}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
        <button
          type="submit"
          disabled={!decision || !allChecked}
          className={cn(
            'flex-1 px-6 py-3 bg-[#c41e3a] text-white rounded-lg font-semibold transition-all',
            !decision || !allChecked
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-700'
          )}
        >
          {currentLanguage === 'ar' ? 'إرسال القرار' : 'Submit Decision'}
        </button>
        <button
          type="button"
          onClick={() => {
            setChecklist({
              quantityMatches: false,
              specsMatch: false,
              packagingIntact: false,
              noDamage: false,
              labelsCorrect: false,
            });
            setDecision(null);
            setNotes('');
            setPhotos([]);
          }}
          className="px-6 py-3 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded-lg font-semibold hover:border-gray-600 transition-colors"
        >
          {currentLanguage === 'ar' ? 'إعادة تعيين' : 'Reset'}
        </button>
      </div>

      {/* Info message */}
      {!allChecked && (
        <div className={cn('p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-blue-400 text-sm', isRTL && 'text-right')}>
          {currentLanguage === 'ar'
            ? 'يجب التحقق من جميع العناصر قبل الإرسال'
            : 'All checklist items must be verified before submitting'}
        </div>
      )}
    </form>
  );
}
