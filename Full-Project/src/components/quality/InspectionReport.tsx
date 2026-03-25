'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InspectionReportProps {
  inspectorName: string;
  date: string;
  result: 'PASS' | 'CONDITIONAL' | 'FAIL';
  defectRate: number;
  samplesInspected: number;
  aqlLevel: string;
  testResults: Array<{
    name: string;
    nameAr: string;
    result: 'PASS' | 'FAIL' | 'CONDITIONAL';
    value?: string;
  }>;
  photos?: string[];
  certificates?: Array<{
    name: string;
    url: string;
  }>;
  notes?: string;
  currentLanguage?: 'en' | 'ar' | 'zh';
  isRTL?: boolean;
}

export default function InspectionReport({
  inspectorName,
  date,
  result,
  defectRate,
  samplesInspected,
  aqlLevel,
  testResults,
  photos = [],
  certificates = [],
  notes = '',
  currentLanguage = 'en',
  isRTL = false,
}: InspectionReportProps) {
  const getResultColor = (res: string) => {
    switch (res) {
      case 'PASS':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'CONDITIONAL':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'FAIL':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getResultLabel = () => {
    const labels = {
      PASS: { en: 'PASS', ar: 'نجح' },
      CONDITIONAL: { en: 'CONDITIONAL', ar: 'بشرط' },
      FAIL: { en: 'FAIL', ar: 'فشل' },
    };
    return labels[result] || { en: result, ar: result };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('flex items-start justify-between', isRTL && 'flex-row-reverse')}>
        <div>
          <p className={cn('text-sm text-gray-400 mb-1', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'المفتش' : 'Inspector'}
          </p>
          <p className={cn('font-semibold', isRTL && 'text-right')}>
            {inspectorName}
          </p>
          <p className={cn('text-sm text-gray-400 mt-3', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'التاريخ' : 'Date'}
          </p>
          <p className={cn('font-semibold', isRTL && 'text-right')}>{date}</p>
        </div>

        <span
          className={cn(
            'px-4 py-2 rounded-lg border font-semibold text-lg',
            getResultColor(result)
          )}
        >
          {getResultLabel()[currentLanguage as 'en' | 'ar']}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'معدل العيب' : 'Defect Rate'}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#1a1d23] rounded-full h-3">
              <div
                className="bg-red-600 h-3 rounded-full"
                style={{ width: `${defectRate}%` }}
              ></div>
            </div>
            <span className="font-bold text-lg">{defectRate}%</span>
          </div>
        </div>

        <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'العينات المفتشة' : 'Samples Inspected'}
          </p>
          <p className={cn('text-2xl font-bold', isRTL && 'text-right')}>
            {samplesInspected}
          </p>
        </div>

        <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
          <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'مستوى AQL' : 'AQL Level'}
          </p>
          <p className={cn('text-2xl font-bold', isRTL && 'text-right')}>
            {aqlLevel}
          </p>
        </div>
      </div>

      {/* Test Results */}
      <div>
        <h4 className={cn('text-lg font-semibold mb-4', isRTL && 'text-right')}>
          {currentLanguage === 'ar' ? 'نتائج الاختبارات' : 'Test Results'}
        </h4>
        <div className="space-y-2">
          {testResults.map((test, idx) => (
            <div key={idx} className={cn('flex items-center justify-between p-3 bg-[#0c0f14] rounded border border-[#242830]', isRTL && 'flex-row-reverse')}>
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    test.result === 'PASS'
                      ? 'bg-green-400'
                      : test.result === 'CONDITIONAL'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  )}
                ></span>
                <span className="font-medium">
                  {currentLanguage === 'ar' ? test.nameAr : test.name}
                </span>
              </div>
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                {test.value && <span className="text-sm text-gray-400">{test.value}</span>}
                <span
                  className={cn(
                    'px-2 py-1 rounded text-xs font-semibold',
                    test.result === 'PASS'
                      ? 'bg-green-900/30 text-green-400'
                      : test.result === 'CONDITIONAL'
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-red-900/30 text-red-400'
                  )}
                >
                  {test.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div>
          <h4 className={cn('text-lg font-semibold mb-4', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الصور' : 'Photos'}
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="aspect-square bg-[#0c0f14] border border-[#242830] rounded-lg flex items-center justify-center text-gray-500 hover:border-[#c41e3a] transition-colors cursor-pointer"
              >
                📷 {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div>
          <h4 className={cn('text-lg font-semibold mb-4', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'الشهادات' : 'Certificates'}
          </h4>
          <div className="space-y-2">
            {certificates.map((cert, idx) => (
              <a
                key={idx}
                href={cert.url}
                className="flex items-center gap-2 p-3 bg-[#0c0f14] rounded border border-[#242830] hover:border-[#d4a843] transition-colors"
              >
                <span className="text-[#d4a843]">📄</span>
                <span className="text-blue-400 hover:underline">{cert.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div>
          <h4 className={cn('text-lg font-semibold mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'ملاحظات' : 'Notes'}
          </h4>
          <p className={cn('text-gray-300 text-sm leading-relaxed', isRTL && 'text-right')}>
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}
