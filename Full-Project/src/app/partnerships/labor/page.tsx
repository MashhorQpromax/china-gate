'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';

interface Technician {
  id: string;
  name: string;
  specialization: string;
  specializationAr: string;
  experience: number;
  certifications: string[];
  languages: string[];
  availableDuration: string;
  monthlyCost: number;
  rating: number;
  country: string;
}

interface LaborAgreement {
  id: string;
  technicianId: string;
  factory: string;
  startDate: string;
  endDate?: string;
  status: 'requested' | 'matched' | 'visa-processing' | 'arrived' | 'working' | 'ended' | 'review';
  accommodationBy: 'factory' | 'supplier';
  rating?: number;
}

const demoTechnicians: Technician[] = [
  {
    id: 't-001',
    name: 'Wei Chen',
    specialization: 'Electronics Assembly',
    specializationAr: 'تجميع إلكترونيات',
    experience: 8,
    certifications: ['ISO 9001', 'IPC-A-610'],
    languages: ['Mandarin', 'English'],
    availableDuration: '6-12 months',
    monthlyCost: 2500,
    rating: 4.8,
    country: 'China',
  },
  {
    id: 't-002',
    name: 'Liu Yang',
    specialization: 'Plastic Injection Molding',
    specializationAr: 'حقن البلاستيك',
    experience: 12,
    certifications: ['ISO 13485', 'Injection Molding Specialist'],
    languages: ['Mandarin', 'Cantonese'],
    availableDuration: '3-6 months',
    monthlyCost: 3000,
    rating: 4.9,
    country: 'China',
  },
  {
    id: 't-003',
    name: 'Zhang Ming',
    specialization: 'Quality Control & Testing',
    specializationAr: 'مراقبة الجودة والاختبار',
    experience: 10,
    certifications: ['AQL Certification', 'Six Sigma Green Belt'],
    languages: ['Mandarin', 'English'],
    availableDuration: '6-18 months',
    monthlyCost: 2800,
    rating: 4.7,
    country: 'China',
  },
  {
    id: 't-004',
    name: 'Huang Fang',
    specialization: 'Production Line Optimization',
    specializationAr: 'تحسين خط الإنتاج',
    experience: 15,
    certifications: ['Lean Manufacturing', 'Six Sigma Black Belt'],
    languages: ['Mandarin', 'English', 'Spanish'],
    availableDuration: '9-18 months',
    monthlyCost: 3500,
    rating: 4.9,
    country: 'China',
  },
  {
    id: 't-005',
    name: 'Wang Li',
    specialization: 'Maintenance & Equipment',
    specializationAr: 'الصيانة والمعدات',
    experience: 9,
    certifications: ['Mechanical Engineering', 'PLC Programming'],
    languages: ['Mandarin', 'English'],
    availableDuration: '3-12 months',
    monthlyCost: 2600,
    rating: 4.6,
    country: 'China',
  },
];

const demoAgreements: LaborAgreement[] = [
  {
    id: 'la-001',
    technicianId: 't-001',
    factory: 'Saudi Manufacturing Co.',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    status: 'working',
    accommodationBy: 'factory',
    rating: 4.8,
  },
  {
    id: 'la-002',
    technicianId: 't-003',
    factory: 'Gulf Industrial Group',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    status: 'working',
    accommodationBy: 'supplier',
    rating: undefined,
  },
  {
    id: 'la-003',
    technicianId: 't-004',
    factory: 'Dammam Precision Works',
    startDate: '2024-03-10',
    status: 'visa-processing',
    accommodationBy: 'factory',
    rating: undefined,
  },
];

export default function LaborPartnershipsPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [viewMode, setViewMode] = useState<'available' | 'active'>('available');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  const filteredTechnicians = demoTechnicians.filter(tech => {
    if (selectedSpecialization !== 'all' && tech.specialization !== selectedSpecialization) return false;
    return true;
  });

  const uniqueSpecializations = Array.from(
    new Set(demoTechnicians.map(t => t.specialization))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'matched':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'visa-processing':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'arrived':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'working':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'ended':
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
      case 'review':
        return 'bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      requested: { en: 'Requested', ar: 'مطلوب' },
      matched: { en: 'Matched', ar: 'موافق' },
      'visa-processing': { en: 'Visa Processing', ar: 'معالجة التأشيرة' },
      arrived: { en: 'Arrived', ar: 'وصل' },
      working: { en: 'Working', ar: 'يعمل' },
      ended: { en: 'Ended', ar: 'انتهى' },
      review: { en: 'Post Review', ar: 'تقييم بعدي' },
    };
    return labels[status as keyof typeof labels] || { en: status, ar: status };
  };

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
            {currentLanguage === 'ar' ? 'إعارة العمالة المهنية' : 'Skilled Labor Lending'}
          </h1>
          <p className={cn('text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? 'استقطب فنيين وخبراء صينيين مؤهلين لتحسين إنتاجك'
              : 'Access qualified Chinese technicians and experts to enhance your production'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'فنيون متاحون' : 'Available Technicians'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {demoTechnicians.length}
            </p>
            <p className={cn('text-sm text-green-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'من تخصصات متعددة' : 'Multiple specializations'}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'اتفاقيات نشطة' : 'Active Agreements'}
            </p>
            <p className={cn('text-3xl font-bold text-purple-400', isRTL && 'text-right')}>
              {demoAgreements.filter(a => a.status === 'working').length}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              4.8★
            </p>
          </div>
        </div>

        {/* View Toggle and Request Button */}
        <div className={cn('flex gap-4 items-center justify-between flex-wrap', isRTL && 'flex-row-reverse')}>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('available')}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'available'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-[#c41e3a]'
              )}
            >
              {currentLanguage === 'ar' ? 'الفنيون المتاحون' : 'Available Technicians'}
            </button>
            <button
              onClick={() => setViewMode('active')}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'active'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-[#c41e3a]'
              )}
            >
              {currentLanguage === 'ar' ? 'الاتفاقيات النشطة' : 'Active Agreements'}
            </button>
          </div>

          {viewMode === 'available' && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {currentLanguage === 'ar' ? '+ طلب فنيين' : '+ Request Technicians'}
            </button>
          )}
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'طلب فنيين' : 'Request Technicians'}
            </h2>
            <form className="space-y-6">
              {/* Number of Technicians */}
              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'عدد الفنيين' : 'Number of Technicians'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="1"
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                />
              </div>

              {/* Specializations */}
              <div>
                <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'التخصصات المطلوبة' : 'Required Specializations'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {uniqueSpecializations.map((spec) => (
                    <label
                      key={spec}
                      className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}
                    >
                      <input type="checkbox" className="w-5 h-5 accent-[#c41e3a]" />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'المدة المطلوبة' : 'Required Duration'}
                </label>
                <select
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>18+ months</option>
                </select>
              </div>

              {/* Accommodation */}
              <div>
                <label className={cn('block font-semibold mb-3', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'الإقامة' : 'Accommodation'}
                </label>
                <div className="space-y-3">
                  <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
                    <input type="radio" name="accommodation" value="provided" className="w-5 h-5 accent-[#c41e3a]" />
                    <span>{currentLanguage === 'ar' ? 'نوفر نحن الإقامة' : 'We provide accommodation'}</span>
                  </label>
                  <label className={cn('flex items-center gap-3 p-3 bg-[#0c0f14] border border-[#242830] rounded-lg cursor-pointer hover:border-[#c41e3a]', isRTL && 'flex-row-reverse')}>
                    <input type="radio" name="accommodation" value="required" className="w-5 h-5 accent-[#c41e3a]" />
                    <span>{currentLanguage === 'ar' ? 'نطلب إقامة من المورد' : 'Request from supplier'}</span>
                  </label>
                </div>
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

        {/* Available Technicians View */}
        {viewMode === 'available' && (
          <div className="space-y-4">
            {/* Filter */}
            <div>
              <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
                {currentLanguage === 'ar' ? 'التخصص' : 'Specialization'}
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full md:w-80 px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
              >
                <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Technicians Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
                >
                  {/* Header */}
                  <div className={cn('flex items-start justify-between mb-4', isRTL && 'flex-row-reverse')}>
                    <div className={cn('flex-1', isRTL && 'text-right')}>
                      <h3 className="text-lg font-semibold mb-1">{tech.name}</h3>
                      <p className="text-[#d4a843] font-medium">
                        {currentLanguage === 'ar' ? tech.specializationAr : tech.specialization}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex text-[#d4a843]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(tech.rating / 1) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">{tech.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-[#242830]">
                    <div className={cn('flex justify-between text-sm', isRTL && 'flex-row-reverse')}>
                      <span className="text-gray-400">
                        {currentLanguage === 'ar' ? 'الخبرة' : 'Experience'}
                      </span>
                      <span className="font-medium">{tech.experience} {currentLanguage === 'ar' ? 'سنوات' : 'years'}</span>
                    </div>

                    <div className={cn('flex justify-between text-sm', isRTL && 'flex-row-reverse')}>
                      <span className="text-gray-400">
                        {currentLanguage === 'ar' ? 'المدة المتاحة' : 'Available Duration'}
                      </span>
                      <span className="font-medium">{tech.availableDuration}</span>
                    </div>

                    <div className={cn('flex justify-between text-sm', isRTL && 'flex-row-reverse')}>
                      <span className="text-gray-400">
                        {currentLanguage === 'ar' ? 'التكلفة الشهرية' : 'Monthly Cost'}
                      </span>
                      <span className="font-medium text-[#d4a843]">${tech.monthlyCost}</span>
                    </div>
                  </div>

                  {/* Certifications and Languages */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className={cn('text-xs text-gray-400 mb-2', isRTL && 'text-right')}>
                        {currentLanguage === 'ar' ? 'الشهادات' : 'Certifications'}
                      </p>
                      <div className={cn('flex flex-wrap gap-2', isRTL && 'flex-row-reverse')}>
                        {tech.certifications.map((cert) => (
                          <span key={cert} className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-700">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className={cn('text-xs text-gray-400 mb-2', isRTL && 'text-right')}>
                        {currentLanguage === 'ar' ? 'اللغات' : 'Languages'}
                      </p>
                      <div className={cn('flex flex-wrap gap-2', isRTL && 'flex-row-reverse')}>
                        {tech.languages.map((lang) => (
                          <span key={lang} className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-700">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Request Button */}
                  <button className="w-full px-4 py-2 bg-[#c41e3a] text-white rounded hover:bg-red-700 transition-colors font-medium">
                    {currentLanguage === 'ar' ? '+ طلب هذا الفني' : '+ Request This Technician'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Agreements View */}
        {viewMode === 'active' && (
          <div className="space-y-4">
            {demoAgreements.map((agreement) => {
              const tech = demoTechnicians.find(t => t.id === agreement.technicianId);
              if (!tech) return null;

              return (
                <div
                  key={agreement.id}
                  className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
                >
                  <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                    <div className={cn('flex-1', isRTL && 'text-right')}>
                      <h3 className="text-lg font-semibold mb-1">{tech.name}</h3>
                      <p className="text-[#d4a843] font-medium mb-2">
                        {currentLanguage === 'ar' ? tech.specializationAr : tech.specialization}
                      </p>
                      <p className="text-gray-400 text-sm mb-2">{agreement.factory}</p>
                      <p className={cn('text-xs text-gray-500', isRTL && 'text-right')}>
                        {currentLanguage === 'ar' ? 'من' : 'From'} {agreement.startDate} {agreement.endDate ? `${currentLanguage === 'ar' ? 'إلى' : 'to'} ${agreement.endDate}` : ''}
                      </p>
                    </div>

                    <span
                      className={cn(
                        'px-4 py-2 rounded-lg border font-semibold whitespace-nowrap',
                        getStatusColor(agreement.status)
                      )}
                    >
                      {getStatusLabel(agreement.status)[currentLanguage as 'en' | 'ar']}
                    </span>
                  </div>

                  <div className={cn('flex items-center gap-6 mb-4 pb-4 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                    <div>
                      <p className={cn('text-xs text-gray-400 mb-1', isRTL && 'text-right')}>
                        {currentLanguage === 'ar' ? 'الإقامة' : 'Accommodation'}
                      </p>
                      <p className={cn('font-medium', isRTL && 'text-right')}>
                        {agreement.accommodationBy === 'factory'
                          ? currentLanguage === 'ar' ? 'من المصنع' : 'By Factory'
                          : currentLanguage === 'ar' ? 'من المورد' : 'By Supplier'}
                      </p>
                    </div>

                    {agreement.rating && (
                      <div>
                        <p className={cn('text-xs text-gray-400 mb-1', isRTL && 'text-right')}>
                          {currentLanguage === 'ar' ? 'التقييم' : 'Rating'}
                        </p>
                        <div className="flex text-[#d4a843]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(agreement.rating! / 1) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                    <button className="flex-1 px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                      {currentLanguage === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                    {agreement.status === 'ended' && (
                      <button className="flex-1 px-4 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded hover:bg-[#d4a843]/30 transition-colors text-sm font-medium">
                        {currentLanguage === 'ar' ? 'تقديم تقييم' : 'Submit Review'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
