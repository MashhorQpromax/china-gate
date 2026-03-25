'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface QualityStatsProps {
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
}

export default function QualityStats({
  currentLanguage = 'en',
  isRTL = false,
}: QualityStatsProps) {
  const passRate = 94;
  const failRate = 3;
  const conditionalRate = 3;

  const defectCategories = [
    { name: 'Dimensional', nameAr: 'أبعاد', count: 45 },
    { name: 'Surface', nameAr: 'سطح', count: 28 },
    { name: 'Assembly', nameAr: 'تجميع', count: 18 },
    { name: 'Color', nameAr: 'لون', count: 12 },
    { name: 'Packaging', nameAr: 'تغليف', count: 8 },
  ];

  const totalDefects = defectCategories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'المنتجات المتتبعة' : 'Products Tracked'}
          </p>
          <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>2,847</p>
          <p className={cn('text-sm text-green-400 mt-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? '↑ 12% هذا الشهر' : '↑ 12% this month'}
          </p>
        </div>

        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'معدل النجاح' : 'Pass Rate'}
          </p>
          <p className={cn('text-3xl font-bold text-green-400', isRTL && 'text-right')}>
            {passRate}%
          </p>
          <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'بدون عيوب' : 'No defects'}
          </p>
        </div>

        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'متوسط وقت الحل' : 'Avg Resolution Time'}
          </p>
          <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
            3.2
          </p>
          <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'أيام عمل' : 'business days'}
          </p>
        </div>

        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'عمليات التفتيش النشطة' : 'Active Inspections'}
          </p>
          <p className={cn('text-3xl font-bold text-blue-400', isRTL && 'text-right')}>
            127
          </p>
          <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'جارية' : 'in progress'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass/Fail Donut Chart */}
        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <h3 className={cn('text-lg font-bold mb-6', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'معدلات النجاح/الفشل' : 'Pass/Fail Rates'}
          </h3>

          {/* SVG Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <svg
              viewBox="0 0 120 120"
              className="w-40 h-40"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Pass segment */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="12"
                strokeDasharray={`${(passRate / 100) * 282.7} 282.7`}
                opacity="0.8"
              />
              {/* Conditional segment */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#eab308"
                strokeWidth="12"
                strokeDasharray={`${(conditionalRate / 100) * 282.7} 282.7`}
                strokeDashoffset={-((passRate / 100) * 282.7)}
                opacity="0.8"
              />
              {/* Fail segment */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${(failRate / 100) * 282.7} 282.7`}
                strokeDashoffset={-(((passRate + conditionalRate) / 100) * 282.7)}
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-300">
                {currentLanguage === 'ar' ? 'نجح' : 'Pass'}: {passRate}%
              </span>
            </div>
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-gray-300">
                {currentLanguage === 'ar' ? 'بشرط' : 'Conditional'}: {conditionalRate}%
              </span>
            </div>
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-gray-300">
                {currentLanguage === 'ar' ? 'فشل' : 'Fail'}: {failRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Defect Categories Bar Chart */}
        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <h3 className={cn('text-lg font-bold mb-6', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'فئات العيوب' : 'Defect Categories'}
          </h3>

          <div className="space-y-4">
            {defectCategories.map((category, idx) => (
              <div key={idx}>
                <div className={cn('flex justify-between items-center mb-1', isRTL && 'flex-row-reverse')}>
                  <span className="text-sm font-medium">
                    {currentLanguage === 'ar' ? category.nameAr : category.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.round((category.count / totalDefects) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#0c0f14] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full"
                    style={{ width: `${(category.count / totalDefects) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className={cn('text-xs text-gray-500 mt-4', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? `إجمالي العيوب المسجلة: ${totalDefects}`
              : `Total recorded defects: ${totalDefects}`}
          </p>
        </div>

        {/* Trends */}
        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <h3 className={cn('text-lg font-bold mb-6', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الاتجاهات' : 'Trends'}
          </h3>

          <div className="space-y-4">
            {[
              { label: currentLanguage === 'ar' ? 'جودة العينة' : 'Sample Quality', trend: 2.5, icon: '📈' },
              { label: currentLanguage === 'ar' ? 'سرعة الفحص' : 'Inspection Speed', trend: 5.2, icon: '⚡' },
              { label: currentLanguage === 'ar' ? 'معدل التعطل' : 'Failure Rate', trend: -1.8, icon: '📉' },
              { label: currentLanguage === 'ar' ? 'رضا الزبون' : 'Customer Satisfaction', trend: 3.1, icon: '😊' },
            ].map((item, idx) => (
              <div key={idx} className={cn('flex items-center justify-between', isRTL && 'flex-row-reverse')}>
                <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <span className={cn(
                  'font-semibold text-sm',
                  item.trend > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {item.trend > 0 ? '+' : ''}{item.trend}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
