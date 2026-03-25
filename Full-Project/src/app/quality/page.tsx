'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QualityStats from '@/components/quality/QualityStats';
import { cn } from '@/lib/utils';

interface QualityJourney {
  id: string;
  productName: string;
  productNameAr: string;
  currentStage: number;
  status: 'completed' | 'active' | 'pending' | 'failed';
  passRate: number;
  lastUpdate: string;
  supplier: string;
  orderId: string;
}

const demoQualityJourneys: QualityJourney[] = [
  {
    id: 'qj-001',
    productName: 'Electronic Transformer',
    productNameAr: 'محول كهربائي',
    currentStage: 7,
    status: 'active',
    passRate: 96,
    lastUpdate: '2024-03-24 14:30',
    supplier: 'Shanghai Electronics Co.',
    orderId: 'PO-2024-001',
  },
  {
    id: 'qj-002',
    productName: 'Industrial Valve',
    productNameAr: 'صمام صناعي',
    currentStage: 5,
    status: 'active',
    passRate: 98,
    lastUpdate: '2024-03-24 10:15',
    supplier: 'Tianjin Industrial Ltd.',
    orderId: 'PO-2024-002',
  },
  {
    id: 'qj-003',
    productName: 'Plastic Components',
    productNameAr: 'مكونات بلاستيكية',
    currentStage: 10,
    status: 'completed',
    passRate: 97,
    lastUpdate: '2024-03-23 16:45',
    supplier: 'Guangzhou Plastics Corp.',
    orderId: 'PO-2024-003',
  },
  {
    id: 'qj-004',
    productName: 'Steel Pipes',
    productNameAr: 'أنابيب فولاذية',
    currentStage: 3,
    status: 'failed',
    passRate: 78,
    lastUpdate: '2024-03-22 09:20',
    supplier: 'Wuhan Steel Mills',
    orderId: 'PO-2024-004',
  },
  {
    id: 'qj-005',
    productName: 'Circuit Boards',
    productNameAr: 'لوحات الدوائر',
    currentStage: 4,
    status: 'active',
    passRate: 95,
    lastUpdate: '2024-03-24 13:00',
    supplier: 'Shenzhen Electronics',
    orderId: 'PO-2024-005',
  },
];

const stageNames = [
  { en: 'Specification Confirmed', ar: 'تأكيد المواصفات' },
  { en: 'Sample', ar: 'العينة' },
  { en: 'Production Started', ar: 'بدء الإنتاج' },
  { en: 'DPI - In Production Inspection', ar: 'فحص أثناء الإنتاج' },
  { en: 'PSI - Pre-Shipment Inspection', ar: 'فحص ما قبل الشحن' },
  { en: 'Packing', ar: 'التغليف' },
  { en: 'Shipped', ar: 'الشحن' },
  { en: 'In Transit', ar: 'في الطريق' },
  { en: 'Arrived & Customs', ar: 'الوصول والتخليص' },
  { en: 'Final Acceptance', ar: 'الاستلام والتأكيد النهائي' },
];

export default function QualityPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterSupplier, setFilterSupplier] = useState<string>('all');

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  const filteredJourneys = demoQualityJourneys.filter(journey => {
    if (filterStatus !== 'all' && journey.status !== filterStatus) return false;
    if (filterProduct !== 'all' && journey.productName !== filterProduct) return false;
    if (filterSupplier !== 'all' && journey.supplier !== filterSupplier) return false;
    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'active':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'failed':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: { en: 'Completed', ar: 'مكتمل' },
      active: { en: 'Active', ar: 'نشط' },
      pending: { en: 'Pending', ar: 'قيد الانتظار' },
      failed: { en: 'Failed', ar: 'فشل' },
    };
    return labels[status as keyof typeof labels] || { en: 'Unknown', ar: 'غير معروف' };
  };

  const uniqueProducts = Array.from(new Set(demoQualityJourneys.map(j => j.productName)));
  const uniqueSuppliers = Array.from(new Set(demoQualityJourneys.map(j => j.supplier)));

  return (
    <DashboardLayout
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={cn('text-4xl font-bold mb-2', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'ضمان الجودة' : 'Quality Assurance'}
          </h1>
          <p className={cn('text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? 'تتبع رحلة المنتج الكاملة من المواصفات إلى الاستقبال النهائي'
              : 'Track your complete product journey from specifications to final acceptance'}
          </p>
        </div>

        {/* Statistics Cards */}
        <QualityStats isRTL={isRTL} currentLanguage={currentLanguage} />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'حالة' : 'Status'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              <option value="completed">{currentLanguage === 'ar' ? 'مكتمل' : 'Completed'}</option>
              <option value="active">{currentLanguage === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="pending">{currentLanguage === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="failed">{currentLanguage === 'ar' ? 'فشل' : 'Failed'}</option>
            </select>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'المنتج' : 'Product'}
            </label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              {uniqueProducts.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'المورد' : 'Supplier'}
            </label>
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              {uniqueSuppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              {currentLanguage === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>

        {/* Recent Quality Journeys */}
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', isRTL && 'text-right')}>
            {currentLanguage === 'ar' ? 'رحلات الجودة الأخيرة' : 'Recent Quality Journeys'}
          </h2>

          <div className="space-y-4">
            {filteredJourneys.map((journey) => (
              <a
                key={journey.id}
                href={`/quality/${journey.id}`}
                className="block p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all hover:shadow-lg hover:shadow-red-900/20 cursor-pointer"
              >
                <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                  <div className={cn('flex-1', isRTL && 'text-right')}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {journey.productName}
                      </h3>
                      <span className="text-sm text-gray-400">
                        ({journey.productNameAr})
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      {currentLanguage === 'ar' ? 'المورد:' : 'Supplier:'} {journey.supplier}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm text-gray-400">
                        {currentLanguage === 'ar' ? 'PO:' : 'Order:'} {journey.orderId}
                      </span>
                      <span className="text-sm text-gray-400">
                        {currentLanguage === 'ar' ? 'المرحلة:' : 'Stage:'} {journey.currentStage}/10
                      </span>
                      <span className="text-sm text-gray-400">
                        {currentLanguage === 'ar' ? 'معدل النجاح:' : 'Pass Rate:'} {journey.passRate}%
                      </span>
                    </div>
                  </div>

                  <div className={cn('flex flex-col items-end gap-3', isRTL && 'items-start')}>
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        getStatusBadgeColor(journey.status)
                      )}
                    >
                      {getStatusLabel(journey.status)[currentLanguage as 'en' | 'ar']}
                    </span>
                    <div className="w-32 bg-[#0c0f14] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-2 rounded-full"
                        style={{ width: `${(journey.currentStage / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {currentLanguage === 'ar' ? 'التحديث:' : 'Updated:'} {journey.lastUpdate}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredJourneys.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {currentLanguage === 'ar' ? 'لا توجد رحلات جودة مطابقة' : 'No matching quality journeys found'}
              </p>
            </div>
          )}
        </div>

        {/* Common Issues Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'أكثر المشاكل شيوعاً' : 'Most Common Issues'}
            </h3>
            <div className="space-y-3">
              {[
                { en: 'Dimensional Tolerance', ar: 'تحمل الأبعاد', count: 12 },
                { en: 'Surface Defects', ar: 'عيوب السطح', count: 8 },
                { en: 'Assembly Quality', ar: 'جودة التجميع', count: 6 },
                { en: 'Color Variation', ar: 'اختلاف اللون', count: 4 },
                { en: 'Packaging Damage', ar: 'تلف التغليف', count: 3 },
              ].map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300">{issue[currentLanguage as 'en' | 'ar']}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[#0c0f14] rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(issue.count / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-8">{issue.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h3 className={cn('text-xl font-bold mb-4', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'أفضل المورددين من حيث الجودة' : 'Best Suppliers by Quality'}
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Shanghai Electronics Co.', rating: 9.8 },
                { name: 'Guangzhou Plastics Corp.', rating: 9.5 },
                { name: 'Tianjin Industrial Ltd.', rating: 9.2 },
                { name: 'Shenzhen Electronics', rating: 8.9 },
                { name: 'Wuhan Steel Mills', rating: 7.5 },
              ].map((supplier, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-300 font-medium">{idx + 1}. {supplier.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#d4a843]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(supplier.rating / 2) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{supplier.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
