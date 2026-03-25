'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QualityTimeline from '@/components/quality/QualityTimeline';
import InspectionReport from '@/components/quality/InspectionReport';
import FinalAcceptanceForm from '@/components/quality/FinalAcceptanceForm';
import DisputeForm from '@/components/quality/DisputeForm';
import { cn } from '@/lib/utils';

interface QualityStage {
  id: number;
  nameEn: string;
  nameAr: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  date: string;
  description: string;
  inspector?: string;
  result?: 'PASS' | 'CONDITIONAL' | 'FAIL';
  defectRate?: number;
  notes?: string;
  photos?: string[];
  documents?: Array<{ name: string; url: string }>;
}

const stageData: QualityStage[] = [
  {
    id: 1,
    nameEn: 'Specification Confirmed',
    nameAr: 'تأكيد المواصفات',
    status: 'completed',
    date: '2024-03-01',
    description: 'Product specifications reviewed and confirmed by both parties',
    inspector: 'John Chen',
    notes: 'All specifications approved. Minor tolerance adjustments accepted.',
  },
  {
    id: 2,
    nameEn: 'Sample',
    nameAr: 'العينة',
    status: 'completed',
    date: '2024-03-05',
    description: 'Sample produced and sent for inspection',
    inspector: 'David Wang',
    result: 'PASS',
    defectRate: 0,
  },
  {
    id: 3,
    nameEn: 'Production Started',
    nameAr: 'بدء الإنتاج',
    status: 'completed',
    date: '2024-03-10',
    description: 'Mass production began at supplier facility',
    notes: 'Production line fully operational. 5000 units per day capacity.',
  },
  {
    id: 4,
    nameEn: 'DPI - In Production Inspection',
    nameAr: 'فحص أثناء الإنتاج',
    status: 'completed',
    date: '2024-03-15',
    description: 'During Production Inspection by third-party inspector',
    inspector: 'Maria Rodriguez',
    result: 'PASS',
    defectRate: 1.2,
    notes: '98.8% pass rate. Minor surface defects in 12 units.',
  },
  {
    id: 5,
    nameEn: 'PSI - Pre-Shipment Inspection',
    nameAr: 'فحص ما قبل الشحن',
    status: 'completed',
    date: '2024-03-20',
    description: 'Final inspection before shipment',
    inspector: 'James Liu',
    result: 'PASS',
    defectRate: 0.5,
    notes: 'AQL Level II applied. All packages properly labeled.',
  },
  {
    id: 6,
    nameEn: 'Packing',
    nameAr: 'التغليف',
    status: 'completed',
    date: '2024-03-21',
    description: 'Products properly packed and labeled',
    notes: '500 units per carton. Packing list matches delivery',
  },
  {
    id: 7,
    nameEn: 'Shipped',
    nameAr: 'الشحن',
    status: 'active',
    date: '2024-03-22',
    description: 'Container loaded and shipped',
    notes: 'B/L: MAEU123456789, Container: TXGU1234567',
  },
  {
    id: 8,
    nameEn: 'In Transit',
    nameAr: 'في الطريق',
    status: 'pending',
    date: '2024-03-22',
    description: 'Shipment in transit to destination port',
    notes: 'ETA: 2024-04-15, Current location: Suez Canal',
  },
  {
    id: 9,
    nameEn: 'Arrived & Customs',
    nameAr: 'الوصول والتخليص',
    status: 'pending',
    date: null,
    description: 'Goods arrive and pass customs clearance',
  },
  {
    id: 10,
    nameEn: 'Final Acceptance',
    nameAr: 'الاستلام والتأكيد النهائي',
    status: 'pending',
    date: null,
    description: 'Final inspection and acceptance by buyer',
  },
];

export default function QualityDetailPage() {
  const params = useParams();
  const journeyId = params.id as string;
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showAcceptanceForm, setShowAcceptanceForm] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  const currentStage = 7;
  const overallProgress = (currentStage / 10) * 100;

  const completedStages = stageData.filter(s => s.status === 'completed').length;
  const failedStages = stageData.filter(s => s.status === 'failed').length;

  return (
    <DashboardLayout
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn('text-4xl font-bold mb-2', isRTL && 'text-right')}>
                {currentLanguage === 'ar' ? 'رحلة الجودة' : 'Quality Journey'}
              </h1>
              <p className={cn('text-gray-400 flex items-center gap-2', isRTL && 'text-right flex-row-reverse')}>
                <span className="font-mono text-[#d4a843]">{journeyId}</span>
                <span>—</span>
                <span>Electronic Transformer / محول كهربائي</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-blue-900/30 text-blue-400 border border-blue-700 rounded-lg">
                {currentLanguage === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'إجمالي التقدم' : 'Overall Progress'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {Math.round(overallProgress)}%
            </p>
            <div className="w-full bg-[#0c0f14] rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-2 rounded-full"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'المرحلة الحالية' : 'Current Stage'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {currentStage}/10
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الشحن' : 'Shipped'}
            </p>
          </div>

          <div className="p-4 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'المراحل المكتملة' : 'Completed Stages'}
            </p>
            <p className={cn('text-3xl font-bold text-green-400', isRTL && 'text-right')}>
              {completedStages}
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'بدون مشاكل' : 'Without issues'}
            </p>
          </div>

          <div className="p-4 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'معدل النجاح' : 'Pass Rate'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              96%
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'عبر جميع المراحل' : 'Across all stages'}
            </p>
          </div>
        </div>

        {/* Quality Timeline */}
        <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
          <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'رحلة الجودة الكاملة' : 'Complete Quality Journey'}
          </h2>
          <QualityTimeline
            stages={stageData}
            currentLanguage={currentLanguage}
            isRTL={isRTL}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowAcceptanceForm(!showAcceptanceForm)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {currentLanguage === 'ar' ? '✓ قبول النهائي' : '✓ Final Acceptance'}
          </button>
          <button
            onClick={() => setShowDisputeForm(!showDisputeForm)}
            className="px-6 py-2 bg-red-900/40 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors font-medium"
          >
            {currentLanguage === 'ar' ? '🚩 فتح نزاع' : '🚩 Open Dispute'}
          </button>
          <button className="px-6 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded-lg hover:bg-[#d4a843]/30 transition-colors font-medium">
            {currentLanguage === 'ar' ? '📄 تحميل التقرير' : '📄 Download Report'}
          </button>
        </div>

        {/* Final Acceptance Form */}
        {showAcceptanceForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'نموذج الاستقبال النهائي' : 'Final Acceptance Form'}
            </h3>
            <FinalAcceptanceForm
              currentLanguage={currentLanguage}
              isRTL={isRTL}
            />
          </div>
        )}

        {/* Dispute Form */}
        {showDisputeForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'نموذج فتح نزاع' : 'Open Dispute Form'}
            </h3>
            <DisputeForm
              currentLanguage={currentLanguage}
              isRTL={isRTL}
            />
          </div>
        )}

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
            </h3>
            <div className="space-y-4">
              <div className={cn('flex justify-between items-center pb-3 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-gray-400">{currentLanguage === 'ar' ? 'اسم المنتج' : 'Product Name'}</span>
                <span className="font-semibold">Electronic Transformer 500KVA</span>
              </div>
              <div className={cn('flex justify-between items-center pb-3 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-gray-400">{currentLanguage === 'ar' ? 'طلب الشراء' : 'Purchase Order'}</span>
                <span className="font-semibold">PO-2024-001</span>
              </div>
              <div className={cn('flex justify-between items-center pb-3 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-gray-400">{currentLanguage === 'ar' ? 'المورد' : 'Supplier'}</span>
                <span className="font-semibold">Shanghai Electronics Co.</span>
              </div>
              <div className={cn('flex justify-between items-center pb-3 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-gray-400">{currentLanguage === 'ar' ? 'الكمية' : 'Quantity'}</span>
                <span className="font-semibold">2,500 units</span>
              </div>
              <div className={cn('flex justify-between items-center pb-3 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-gray-400">{currentLanguage === 'ar' ? 'قيمة الطلب' : 'Order Value'}</span>
                <span className="font-semibold text-[#d4a843]">$125,000 USD</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'معايير الجودة' : 'Quality Standards'}
            </h3>
            <div className="space-y-3">
              {['ISO 9001', 'IEC 60076', 'SASO', 'CE Marked'].map((std) => (
                <div key={std} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="font-medium">{std}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
