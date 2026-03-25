'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DisputeFormProps {
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
  onSubmit?: (data: any) => void;
}

export default function DisputeForm({
  currentLanguage = 'en',
  isRTL = false,
  onSubmit,
}: DisputeFormProps) {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [resolution, setResolution] = useState<'reship' | 'discount' | 'return' | 'compensation' | null>(null);
  const [compensationAmount, setCompensationAmount] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        reason,
        evidence,
        resolution,
        compensationAmount,
        details,
      });
    }
  };

  const resolutionOptions = [
    { key: 'reship', en: 'Re-ship products', ar: 'إعادة شحن المنتجات', icon: '📦' },
    { key: 'discount', en: 'Offer discount', ar: 'تقديم خصم', icon: '💰' },
    { key: 'return', en: 'Full return', ar: 'استرجاع كامل', icon: '↩️' },
    { key: 'compensation', en: 'Compensation', ar: 'تعويض', icon: '💵' },
  ];

  const reasonOptions = [
    { en: 'Quality defects', ar: 'عيوب الجودة' },
    { en: 'Quantity mismatch', ar: 'عدم تطابق الكمية' },
    { en: 'Specifications not met', ar: 'المواصفات غير مطابقة' },
    { en: 'Damaged packaging', ar: 'تلف التغليف' },
    { en: 'Missing items', ar: 'عناصر مفقودة' },
    { en: 'Wrong products', ar: 'منتجات خاطئة' },
    { en: 'Late delivery', ar: 'تأخير التسليم' },
    { en: 'Other', ar: 'أخرى' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Reason Selection */}
      <div>
        <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'سبب النزاع' : 'Dispute Reason'}
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={cn(
            'w-full px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none',
            isRTL && 'text-right'
          )}
          required
        >
          <option value="">
            {currentLanguage === 'ar' ? 'اختر السبب...' : 'Select a reason...'}
          </option>
          {reasonOptions.map((opt) => (
            <option key={opt.en} value={opt.en}>
              {currentLanguage === 'ar' ? opt.ar : opt.en}
            </option>
          ))}
        </select>
      </div>

      {/* Details */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'التفاصيل' : 'Details'}
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={currentLanguage === 'ar'
            ? 'وصف تفصيلي لمشكلة النزاع...'
            : 'Detailed description of the dispute issue...'}
          className={cn(
            'w-full px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none resize-none',
            isRTL && 'text-right'
          )}
          rows={5}
          required
        />
      </div>

      {/* Evidence Upload */}
      <div>
        <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'الأدلة (صور/مستندات)' : 'Evidence (Photos/Documents)'}
        </label>
        <div className="p-4 border-2 border-dashed border-[#242830] rounded-lg hover:border-[#c41e3a] transition-colors cursor-pointer bg-[#0c0f14]/50">
          <div className={cn('flex flex-col items-center justify-center py-8', isRTL && 'text-right')}>
            <span className="text-3xl mb-2">📎</span>
            <p className="text-gray-400">
              {currentLanguage === 'ar'
                ? 'انقر لتحميل الأدلة أو اسحب الملفات هنا'
                : 'Click to upload evidence or drag files here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {currentLanguage === 'ar' ? 'الحد الأقصى 20 ملف' : 'Max 20 files'}
            </p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setEvidence(Array.from(e.target.files || []))}
          />
        </div>
        {evidence.length > 0 && (
          <div className="mt-4">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الملفات المرفوعة' : 'Uploaded files'}: {evidence.length}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {evidence.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#0c0f14] border border-[#242830] rounded-lg"
                >
                  <div className="text-2xl mb-2">
                    {file.type.includes('image') ? '🖼️' : '📄'}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resolution Request */}
      <div>
        <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'الحل المطلوب' : 'Requested Resolution'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {resolutionOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setResolution(opt.key as any)}
              className={cn(
                'p-4 rounded-lg border transition-all',
                resolution === opt.key
                  ? 'bg-[#c41e3a] border-[#c41e3a] text-white'
                  : 'bg-[#0c0f14] border-[#242830] text-gray-300 hover:border-[#c41e3a]'
              )}
            >
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div className="text-sm font-medium">
                {currentLanguage === 'ar' ? opt.ar : opt.en}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compensation Amount (if selected) */}
      {resolution === 'compensation' && (
        <div>
          <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'مبلغ التعويض المطلوب' : 'Requested Compensation Amount'}
          </label>
          <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
            <span className="px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-gray-400">
              USD
            </span>
            <input
              type="number"
              value={compensationAmount}
              onChange={(e) => setCompensationAmount(e.target.value)}
              placeholder={currentLanguage === 'ar' ? 'أدخل المبلغ...' : 'Enter amount...'}
              className={cn(
                'flex-1 px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none',
                isRTL && 'text-right'
              )}
              step="0.01"
              min="0"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
        <button
          type="submit"
          disabled={!reason || !details || !resolution}
          className={cn(
            'flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold transition-all',
            !reason || !details || !resolution
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-700'
          )}
        >
          {currentLanguage === 'ar' ? '🚩 فتح نزاع' : '🚩 Open Dispute'}
        </button>
        <button
          type="button"
          onClick={() => {
            setReason('');
            setDetails('');
            setEvidence([]);
            setResolution(null);
            setCompensationAmount('');
          }}
          className="px-6 py-3 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded-lg font-semibold hover:border-gray-600 transition-colors"
        >
          {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
      </div>

      {/* Info message */}
      <div className={cn('p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-400 text-sm', isRTL && 'text-right')}>
        {currentLanguage === 'ar'
          ? 'سيتم مراجعة نزاعك في غضون 48 ساعة من قبل فريق دعم CHINA GATE'
          : 'Your dispute will be reviewed within 48 hours by the CHINA GATE support team'}
      </div>
    </form>
  );
}
