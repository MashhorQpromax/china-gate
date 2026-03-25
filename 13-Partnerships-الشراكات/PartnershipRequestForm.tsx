'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PartnershipRequestFormProps {
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
  onSubmit?: (data: any) => void;
}

export default function PartnershipRequestForm({
  currentLanguage = 'en',
  isRTL = false,
  onSubmit,
}: PartnershipRequestFormProps) {
  const [formData, setFormData] = useState({
    factoryName: 'Saudi Manufacturing Co.',
    product: '',
    description: '',
    specifications: null as File | null,
    sample: null as File | null,
    monthlyQuantity: '',
    currentCapacity: '80000',
    qualityStandards: [] as string[],
    duration: '1-year',
    crossTraining: false,
    laborLending: false,
    sendWorkers: false,
    acceptOem: false,
  });

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof formData],
    }));
  };

  const handleQualityStandardChange = (standard: string) => {
    setFormData(prev => ({
      ...prev,
      qualityStandards: prev.qualityStandards.includes(standard)
        ? prev.qualityStandards.filter(s => s !== standard)
        : [...prev.qualityStandards, standard],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const qualityStandardOptions = ['ISO 9001', 'ISO 13485', 'SASO', 'CE', 'FDA', 'IEC 60062', 'ASTM'];

  const gapQuantity = Math.max(0, (parseInt(formData.monthlyQuantity) || 0) - (parseInt(formData.currentCapacity) || 0));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Factory Name (auto-filled) */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'اسم المصنع' : 'Factory Name'}
        </label>
        <input
          type="text"
          value={formData.factoryName}
          onChange={(e) => setFormData({ ...formData, factoryName: e.target.value })}
          className={cn(
            'w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none disabled:opacity-60',
            isRTL && 'text-right'
          )}
          disabled
        />
      </div>

      {/* Product */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'المنتج المطلوب تصنيعه' : 'Product to Manufacture'}
        </label>
        <input
          type="text"
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'مثال: مكونات إلكترونية' : 'e.g., Electronic components'}
          className={cn(
            'w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none',
            isRTL && 'text-right'
          )}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'الوصف' : 'Product Description'}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'وصف منتجك...' : 'Describe your product...'}
          className={cn(
            'w-full px-4 py-3 bg-[#0c0f14] border border-[#242830] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none resize-none',
            isRTL && 'text-right'
          )}
          rows={4}
        />
      </div>

      {/* Specifications Upload */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'تحميل المواصفات (PDF)' : 'Upload Specifications (PDF)'}
        </label>
        <div className="p-4 border-2 border-dashed border-[#242830] rounded-lg hover:border-[#c41e3a] transition-colors cursor-pointer bg-[#0c0f14]/50">
          <div className={cn('flex flex-col items-center justify-center py-6', isRTL && 'text-right')}>
            <span className="text-2xl mb-2">📄</span>
            <p className="text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'اسحب ملف PDF أو انقر هنا' : 'Drag PDF file or click here'}
            </p>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFormData({ ...formData, specifications: e.target.files?.[0] || null })}
            className="hidden"
          />
        </div>
        {formData.specifications && (
          <p className={cn('mt-2 text-sm text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الملف:' : 'File:'} {formData.specifications.name}
          </p>
        )}
      </div>

      {/* Sample/Drawings Upload */}
      <div>
        <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'تحميل عينة أو رسومات' : 'Upload Sample/Drawings'}
        </label>
        <div className="p-4 border-2 border-dashed border-[#242830] rounded-lg hover:border-[#c41e3a] transition-colors cursor-pointer bg-[#0c0f14]/50">
          <div className={cn('flex flex-col items-center justify-center py-6', isRTL && 'text-right')}>
            <span className="text-2xl mb-2">📸</span>
            <p className="text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'أضف صور أو ملفات' : 'Add images or files'}
            </p>
          </div>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, sample: e.target.files?.[0] || null })}
            className="hidden"
          />
        </div>
        {formData.sample && (
          <p className={cn('mt-2 text-sm text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الملف:' : 'File:'} {formData.sample.name}
          </p>
        )}
      </div>

      {/* Production Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الكمية الشهرية المطلوبة' : 'Monthly Quantity Needed'}
          </label>
          <input
            type="number"
            value={formData.monthlyQuantity}
            onChange={(e) => setFormData({ ...formData, monthlyQuantity: e.target.value })}
            placeholder="50000"
            className={cn(
              'w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none',
              isRTL && 'text-right'
            )}
            required
          />
        </div>

        <div>
          <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'القدرة الحالية' : 'Current Capacity'}
          </label>
          <input
            type="number"
            value={formData.currentCapacity}
            onChange={(e) => setFormData({ ...formData, currentCapacity: e.target.value })}
            className={cn(
              'w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none disabled:opacity-60',
              isRTL && 'text-right'
            )}
              disabled
            />
          </div>

          <div>
            <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الفجوة' : 'Gap to Cover'}
            </label>
            <input
              type="number"
              value={gapQuantity}
              className={cn(
                'w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white disabled:opacity-60',
                isRTL && 'text-right'
              )}
              disabled
            />
          </div>
        </div>

        {/* Quality Standards */}
        <div>
          <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'معايير الجودة المطلوبة' : 'Required Quality Standards'}
          </label>
          <div className="space-y-2">
            {qualityStandardOptions.map((standard) => (
              <label
                key={standard}
                className={cn(
                  'flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a] transition-colors',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <input
                  type="checkbox"
                  checked={formData.qualityStandards.includes(standard)}
                  onChange={() => handleQualityStandardChange(standard)}
                  className="w-5 h-5 accent-[#c41e3a]"
                />
                <span className="text-sm">{standard}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Partnership Duration */}
        <div>
          <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'مدة الشراكة' : 'Partnership Duration'}
          </label>
          <div className="space-y-2">
            {['6-months', '1-year', 'open'].map((duration) => (
              <label
                key={duration}
                className={cn(
                  'flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a] transition-colors',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <input
                  type="radio"
                  name="duration"
                  value={duration}
                  checked={formData.duration === duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-5 h-5 accent-[#c41e3a]"
                />
                <span className="text-sm">
                  {duration === '6-months'
                    ? currentLanguage === 'ar' ? '6 أشهر' : '6 months'
                    : duration === '1-year'
                    ? currentLanguage === 'ar' ? 'سنة واحدة' : '1 year'
                    : currentLanguage === 'ar' ? 'مفتوح' : 'Open'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Partnership Options */}
        <div>
          <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'خيارات الشراكة' : 'Partnership Options'}
          </label>
          <div className="space-y-2">
            <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
              <input
                type="checkbox"
                checked={formData.crossTraining}
                onChange={() => handleCheckboxChange('crossTraining')}
                className="w-5 h-5 accent-[#c41e3a]"
              />
              <span className="text-sm">{currentLanguage === 'ar' ? 'تدريب متقاطع' : 'Cross-training'}</span>
            </label>

            <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
              <input
                type="checkbox"
                checked={formData.laborLending}
                onChange={() => handleCheckboxChange('laborLending')}
                className="w-5 h-5 accent-[#c41e3a]"
              />
              <span className="text-sm">{currentLanguage === 'ar' ? 'إعارة عمالة' : 'Labor lending'}</span>
            </label>

            <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
              <input
                type="checkbox"
                checked={formData.sendWorkers}
                onChange={() => handleCheckboxChange('sendWorkers')}
                className="w-5 h-5 accent-[#c41e3a]"
              />
              <span className="text-sm">{currentLanguage === 'ar' ? 'إرسال عمالنا للتدريب' : 'Send our workers for training'}</span>
            </label>

            <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
              <input
                type="checkbox"
                checked={formData.acceptOem}
                onChange={() => handleCheckboxChange('acceptOem')}
                className="w-5 h-5 accent-[#c41e3a]"
              />
              <span className="text-sm">{currentLanguage === 'ar' ? 'قبول OEM' : 'Accept OEM'}</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className={cn('flex gap-3 col-span-full', isRTL && 'flex-row-reverse')}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            {currentLanguage === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
          </button>
          <button
            type="reset"
            className="px-6 py-3 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-semibold"
          >
            {currentLanguage === 'ar' ? 'إعادة تعيين' : 'Reset'}
          </button>
        </div>
      </form>
    </form>
  );
}
