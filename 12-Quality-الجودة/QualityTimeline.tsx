'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TimelineStage {
  id: number;
  nameEn: string;
  nameAr: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  date: string | null;
  description: string;
  inspector?: string;
  result?: 'PASS' | 'CONDITIONAL' | 'FAIL';
  defectRate?: number;
  notes?: string;
  photos?: string[];
  documents?: Array<{ name: string; url: string }>;
}

interface QualityTimelineProps {
  stages: TimelineStage[];
  currentLanguage: 'en' | 'ar' | 'zh';
  isRTL: boolean;
}

export default function QualityTimeline({
  stages,
  currentLanguage,
  isRTL,
}: QualityTimelineProps) {
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'active':
        return '●';
      case 'pending':
        return '○';
      case 'failed':
        return '✗';
      default:
        return '?';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'active':
        return 'bg-blue-600 text-white';
      case 'pending':
        return 'bg-gray-600 text-white';
      case 'failed':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'active':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'pending':
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
      case 'failed':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getResultColor = (result?: string) => {
    switch (result) {
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

  const getResultLabel = (result: string | undefined) => {
    if (!result) return null;
    const labels = {
      PASS: { en: 'PASS', ar: 'نجح' },
      CONDITIONAL: { en: 'CONDITIONAL', ar: 'بشرط' },
      FAIL: { en: 'FAIL', ar: 'فشل' },
    };
    return labels[result as keyof typeof labels] || { en: result, ar: result };
  };

  return (
    <div className={cn('space-y-2', isRTL && 'rtl')}>
      {stages.map((stage, index) => (
        <div key={stage.id}>
          {/* Timeline connector */}
          {index < stages.length - 1 && (
            <div className={cn('flex', isRTL && 'flex-row-reverse')}>
              <div className={cn('flex flex-col items-center w-12', isRTL && 'items-end')}>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                    getStatusColor(stage.status)
                  )}
                >
                  {getStatusIcon(stage.status)}
                </div>
                <div className="w-1 flex-1 bg-gradient-to-b from-[#c41e3a] to-transparent mt-1"></div>
              </div>
              <div className="flex-1"></div>
            </div>
          )}

          {/* Timeline card - Last item */}
          {index === stages.length - 1 && (
            <div className={cn('flex', isRTL && 'flex-row-reverse')}>
              <div className={cn('flex flex-col items-center w-12', isRTL && 'items-end')}>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                    getStatusColor(stage.status)
                  )}
                >
                  {getStatusIcon(stage.status)}
                </div>
              </div>
              <div className="flex-1"></div>
            </div>
          )}

          {/* Stage content */}
          <div className={cn('mb-4', isRTL && 'text-right')}>
            <button
              onClick={() =>
                setExpandedStageId(
                  expandedStageId === stage.id ? null : stage.id
                )
              }
              className={cn(
                'w-full p-4 bg-[#0c0f14] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all text-left',
                stage.status === 'active' && 'border-blue-600/50 bg-blue-900/10',
                isRTL && 'text-right'
              )}
            >
              <div className={cn('flex items-center justify-between gap-4', isRTL && 'flex-row-reverse')}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[#d4a843]">
                      {stage.id.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="font-bold">
                        {currentLanguage === 'ar'
                          ? stage.nameAr
                          : stage.nameEn}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {stage.date || (currentLanguage === 'ar' ? 'قيد الانتظار' : 'Pending')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 ml-12">
                    {stage.description}
                  </p>
                </div>

                <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                  {stage.result && (
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold border',
                        getResultColor(stage.result)
                      )}
                    >
                      {getResultLabel(stage.result)?.[currentLanguage as 'en' | 'ar'] || stage.result}
                    </span>
                  )}
                  <span className="text-gray-400">
                    {expandedStageId === stage.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded content */}
            {expandedStageId === stage.id && (
              <div className="mt-3 p-4 bg-[#1a1d23] border border-[#242830] rounded-lg space-y-4">
                {/* Inspector info */}
                {stage.inspector && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {currentLanguage === 'ar' ? 'المفتش' : 'Inspector'}
                    </p>
                    <p className="font-medium">{stage.inspector}</p>
                  </div>
                )}

                {/* Defect rate */}
                {stage.defectRate !== undefined && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {currentLanguage === 'ar' ? 'معدل العيب' : 'Defect Rate'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#0c0f14] rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full"
                          style={{
                            width: `${stage.defectRate}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold">
                        {stage.defectRate}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {stage.notes && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {currentLanguage === 'ar' ? 'ملاحظات' : 'Notes'}
                    </p>
                    <p className="text-gray-300 text-sm">{stage.notes}</p>
                  </div>
                )}

                {/* Photos */}
                {stage.photos && stage.photos.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {currentLanguage === 'ar' ? 'الصور' : 'Photos'} ({stage.photos.length})
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {stage.photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="aspect-square bg-[#0c0f14] border border-[#242830] rounded-lg flex items-center justify-center text-gray-500"
                        >
                          📷
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {stage.documents && stage.documents.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {currentLanguage === 'ar' ? 'المستندات' : 'Documents'} ({stage.documents.length})
                    </p>
                    <div className="space-y-2">
                      {stage.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          className="flex items-center gap-2 p-2 bg-[#0c0f14] rounded hover:bg-[#242830] transition-colors"
                        >
                          <span className="text-[#d4a843]">📄</span>
                          <span className="text-sm text-blue-400 hover:underline">
                            {doc.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload section */}
                <div className="pt-4 border-t border-[#242830]">
                  <button className="px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                    {currentLanguage === 'ar' ? '📤 إضافة صور/مستندات' : '📤 Add Photos/Documents'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
