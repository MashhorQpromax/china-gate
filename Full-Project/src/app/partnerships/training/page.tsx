'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';

interface TrainingProgram {
  id: string;
  type: 'china-to-saudi' | 'saudi-to-china';
  title: string;
  titleAr: string;
  factory: string;
  field: string;
  fieldAr: string;
  duration: string;
  trainees: number;
  language: string;
  cost: number;
  certification: string;
  status: 'draft' | 'requested' | 'approved' | 'active' | 'completed';
  startDate?: string;
  endDate?: string;
}

const demoPrograms: TrainingProgram[] = [
  {
    id: 'tp-001',
    type: 'china-to-saudi',
    title: 'Electronics Manufacturing Excellence',
    titleAr: 'تميز التصنيع الإلكتروني',
    factory: 'Shanghai Electronics Co. → Saudi Manufacturing Co.',
    field: 'Electronics Assembly',
    fieldAr: 'تجميع إلكترونيات',
    duration: '3 months',
    trainees: 12,
    language: 'Chinese + Arabic',
    cost: 25000,
    certification: 'ISO 9001 Advanced',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
  },
  {
    id: 'tp-002',
    type: 'saudi-to-china',
    title: 'Quality Inspection & Testing',
    titleAr: 'فحص الجودة والاختبار',
    factory: 'Saudi Quality Bureau → Guangzhou Plastics',
    field: 'Quality Control',
    fieldAr: 'مراقبة الجودة',
    duration: '2 months',
    trainees: 8,
    language: 'English + Chinese',
    cost: 18000,
    certification: 'AQL Certification',
    status: 'approved',
    startDate: '2024-04-01',
    endDate: '2024-05-30',
  },
  {
    id: 'tp-003',
    type: 'china-to-saudi',
    title: 'Advanced Injection Molding',
    titleAr: 'حقن المعادن المتقدم',
    factory: 'Tianjin Industrial → Gulf Manufacturing',
    field: 'Plastic Injection',
    fieldAr: 'حقن البلاستيك',
    duration: '4 weeks',
    trainees: 6,
    language: 'Mandarin + Arabic',
    cost: 15000,
    certification: 'Injection Molding Specialist',
    status: 'requested',
  },
  {
    id: 'tp-004',
    type: 'saudi-to-china',
    title: 'Supply Chain Management',
    titleAr: 'إدارة سلسلة التوريد',
    factory: 'Saudi Logistics → Shanghai Hub',
    field: 'Logistics',
    fieldAr: 'اللوجستيات',
    duration: '3 weeks',
    trainees: 10,
    language: 'English + Chinese',
    cost: 12000,
    certification: 'SCM Professional',
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-02-01',
  },
];

export default function TrainingPartnershipsPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [filterType, setFilterType] = useState<'all' | 'china-to-saudi' | 'saudi-to-china'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  const filteredPrograms = demoPrograms.filter(prog => {
    if (filterType !== 'all' && prog.type !== filterType) return false;
    if (filterStatus !== 'all' && prog.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
      case 'requested':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'active':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'completed':
        return 'bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: { en: 'Draft', ar: 'مسودة' },
      requested: { en: 'Requested', ar: 'مطلوب' },
      approved: { en: 'Approved', ar: 'موافق عليه' },
      active: { en: 'Active', ar: 'جاري' },
      completed: { en: 'Completed', ar: 'مكتمل' },
    };
    return labels[status as keyof typeof labels] || { en: status, ar: status };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'china-to-saudi': { en: '🇨🇳 → 🇸🇦 Training in China', ar: '🇨🇳 → 🇸🇦 تدريب في الصين' },
      'saudi-to-china': { en: '🇸🇦 → 🇨🇳 Experts to Saudi', ar: '🇸🇦 → 🇨🇳 خبراء للسعودية' },
    };
    return labels[type as keyof typeof labels] || { en: type, ar: type };
  };

  const activeCount = demoPrograms.filter(p => p.status === 'active').length;
  const completedCount = demoPrograms.filter(p => p.status === 'completed').length;
  const totalTrainees = demoPrograms.reduce((sum, p) => sum + p.trainees, 0);

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
            {currentLanguage === 'ar' ? 'برامج التدريب المتقاطع' : 'Cross-Training Programs'}
          </h1>
          <p className={cn('text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? 'تبادل الخبرات والمعرفة بين المصانع الصينية والسعودية'
              : 'Exchange expertise and knowledge between Chinese and Saudi factories'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'إجمالي البرامج' : 'Total Programs'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {demoPrograms.length}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'البرامج النشطة' : 'Active Programs'}
            </p>
            <p className={cn('text-3xl font-bold text-purple-400', isRTL && 'text-right')}>
              {activeCount}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'المتدربون' : 'Total Trainees'}
            </p>
            <p className={cn('text-3xl font-bold text-blue-400', isRTL && 'text-right')}>
              {totalTrainees}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'مكتملة' : 'Completed'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              {completedCount}
            </p>
          </div>
        </div>

        {/* Request Training Button */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {currentLanguage === 'ar' ? '+ طلب برنامج تدريب' : '+ Request Training Program'}
          </button>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'طلب برنامج تدريب جديد' : 'Request New Training Program'}
            </h2>
            <form className="space-y-6">
              {/* Training Type */}
              <div>
                <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'نوع التدريب' : 'Training Type'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={cn('flex items-center gap-3 p-4 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
                    <input type="radio" name="type" value="china-to-saudi" className="w-5 h-5 accent-[#c41e3a]" />
                    <span>{currentLanguage === 'ar' ? '🇨🇳 تدريب في الصين' : '🇨🇳 Training in China'}</span>
                  </label>
                  <label className={cn('flex items-center gap-3 p-4 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
                    <input type="radio" name="type" value="saudi-to-china" className="w-5 h-5 accent-[#c41e3a]" />
                    <span>{currentLanguage === 'ar' ? '🇸🇦 خبراء للسعودية' : '🇸🇦 Experts to Saudi'}</span>
                  </label>
                </div>
              </div>

              {/* Field */}
              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'مجال التدريب' : 'Training Field'}
                </label>
                <input
                  type="text"
                  placeholder={currentLanguage === 'ar' ? 'مثال: إدارة الجودة' : 'e.g., Quality Management'}
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                />
              </div>

              {/* Duration */}
              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'المدة' : 'Duration'}
                </label>
                <input
                  type="text"
                  placeholder={currentLanguage === 'ar' ? 'مثال: 3 أشهر' : 'e.g., 3 months'}
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                />
              </div>

              {/* Submit */}
              <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                <button type="submit" className="flex-1 px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  {currentLanguage === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-6 py-2 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium"
                >
                  {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'نوع التدريب' : 'Training Type'}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              <option value="china-to-saudi">{currentLanguage === 'ar' ? 'تدريب في الصين' : 'Training in China'}</option>
              <option value="saudi-to-china">{currentLanguage === 'ar' ? 'خبراء للسعودية' : 'Experts to Saudi'}</option>
            </select>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الحالة' : 'Status'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              <option value="draft">{currentLanguage === 'ar' ? 'مسودة' : 'Draft'}</option>
              <option value="requested">{currentLanguage === 'ar' ? 'مطلوب' : 'Requested'}</option>
              <option value="approved">{currentLanguage === 'ar' ? 'موافق عليه' : 'Approved'}</option>
              <option value="active">{currentLanguage === 'ar' ? 'جاري' : 'Active'}</option>
              <option value="completed">{currentLanguage === 'ar' ? 'مكتمل' : 'Completed'}</option>
            </select>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
            >
              <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                <div className={cn('flex-1', isRTL && 'text-right')}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      {currentLanguage === 'ar' ? program.titleAr : program.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-2">{program.factory}</p>
                  <div className={cn('text-sm text-[#d4a843] font-medium mb-3', isRTL && 'text-right')}>
                    {getTypeLabel(program.type)[currentLanguage as 'en' | 'ar']}
                  </div>
                </div>

                <span
                  className={cn(
                    'px-4 py-2 rounded-lg border font-semibold whitespace-nowrap',
                    getStatusColor(program.status)
                  )}
                >
                  {getStatusLabel(program.status)[currentLanguage as 'en' | 'ar']}
                </span>
              </div>

              <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4 mb-4', isRTL && 'text-right')}>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {currentLanguage === 'ar' ? 'المجال' : 'Field'}
                  </p>
                  <p className="font-medium">
                    {currentLanguage === 'ar' ? program.fieldAr : program.field}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {currentLanguage === 'ar' ? 'المدة' : 'Duration'}
                  </p>
                  <p className="font-medium">{program.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {currentLanguage === 'ar' ? 'المتدربون' : 'Trainees'}
                  </p>
                  <p className="font-medium">{program.trainees}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {currentLanguage === 'ar' ? 'التكلفة' : 'Cost'}
                  </p>
                  <p className="font-medium text-[#d4a843]">${program.cost.toLocaleString()}</p>
                </div>
              </div>

              <div className={cn('flex items-center gap-2 mb-4 pb-4 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                <span className="text-sm text-gray-400">
                  {currentLanguage === 'ar' ? 'اللغات:' : 'Languages:'}
                </span>
                <span className="font-medium">{program.language}</span>
              </div>

              <div className={cn('flex items-center gap-2 mb-4', isRTL && 'flex-row-reverse')}>
                <span className="text-sm text-gray-400">
                  {currentLanguage === 'ar' ? 'الشهادة:' : 'Certification:'}
                </span>
                <span className="font-medium text-green-400">{program.certification}</span>
              </div>

              {program.startDate && (
                <div className={cn('text-xs text-gray-500 mb-4', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'من' : 'From'} {program.startDate} {currentLanguage === 'ar' ? 'إلى' : 'to'} {program.endDate}
                </div>
              )}

              <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                <button className="flex-1 px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                  {currentLanguage === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </button>
                {program.status === 'requested' && (
                  <button className="flex-1 px-4 py-2 bg-green-600/20 border border-green-600 text-green-400 rounded hover:bg-green-600/30 transition-colors text-sm font-medium">
                    {currentLanguage === 'ar' ? 'الموافقة' : 'Approve'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
