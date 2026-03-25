'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PartnershipRequestForm from '@/components/partnerships/PartnershipRequestForm';
import PartnershipOfferCard from '@/components/partnerships/PartnershipOfferCard';
import { cn } from '@/lib/utils';

interface PartnershipRequest {
  id: string;
  factoryName: string;
  product: string;
  gapQuantity: number;
  qualityStandards: string[];
  duration: string;
  status: 'open' | 'matched' | 'negotiating' | 'active' | 'completed';
  createdAt: string;
}

interface PartnershipOffer {
  id: string;
  supplierName: string;
  rating: number;
  capacityOffered: number;
  pricePerUnit: number;
  startTimeline: string;
  trainingReady: boolean;
  availableTechnicians: number;
  certifications: string[];
  requestId: string;
}

const demoRequests: PartnershipRequest[] = [
  {
    id: 'pr-001',
    factoryName: 'Saudi Manufacturing Co.',
    product: 'Electronic Components',
    gapQuantity: 50000,
    qualityStandards: ['ISO 9001', 'IEC 60062'],
    duration: '1 year',
    status: 'open',
    createdAt: '2024-03-20',
  },
  {
    id: 'pr-002',
    factoryName: 'Gulf Industrial Group',
    product: 'Plastic Injection Parts',
    gapQuantity: 120000,
    qualityStandards: ['SASO', 'ISO 13485'],
    duration: 'Open',
    status: 'matched',
    createdAt: '2024-03-15',
  },
  {
    id: 'pr-003',
    factoryName: 'Dammam Precision Works',
    product: 'Metal Fabrication',
    gapQuantity: 30000,
    qualityStandards: ['ISO 9001', 'ASTM'],
    duration: '6 months',
    status: 'negotiating',
    createdAt: '2024-03-10',
  },
];

const demoOffers: PartnershipOffer[] = [
  {
    id: 'po-001',
    supplierName: 'Shanghai Electronics Pro',
    rating: 4.8,
    capacityOffered: 60000,
    pricePerUnit: 12.5,
    startTimeline: '2 weeks',
    trainingReady: true,
    availableTechnicians: 5,
    certifications: ['ISO 9001', 'IEC 60062', 'CE'],
    requestId: 'pr-001',
  },
  {
    id: 'po-002',
    supplierName: 'Guangzhou Plastics Ltd',
    rating: 4.6,
    capacityOffered: 150000,
    pricePerUnit: 8.75,
    startTimeline: '3 weeks',
    trainingReady: true,
    availableTechnicians: 8,
    certifications: ['ISO 13485', 'FDA', 'SASO'],
    requestId: 'pr-002',
  },
  {
    id: 'po-003',
    supplierName: 'Wuhan Steel Solutions',
    rating: 4.5,
    capacityOffered: 50000,
    pricePerUnit: 18.0,
    startTimeline: '4 weeks',
    trainingReady: false,
    availableTechnicians: 3,
    certifications: ['ISO 9001', 'ASTM', 'GB/T'],
    requestId: 'pr-003',
  },
];

export default function ManufacturingPartnershipsPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [viewMode, setViewMode] = useState<'requests' | 'offers'>('requests');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  const filteredRequests = demoRequests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'matched':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'negotiating':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'active':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'completed':
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: { en: 'Open', ar: 'مفتوح' },
      matched: { en: 'Matched', ar: 'موافق' },
      negotiating: { en: 'Negotiating', ar: 'تحت المفاوضة' },
      active: { en: 'Active', ar: 'نشط' },
      completed: { en: 'Completed', ar: 'مكتمل' },
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
            {currentLanguage === 'ar' ? 'وسّع إنتاجك' : 'Expand Your Production'}
          </h1>
          <p className={cn('text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? 'أنشئ شراكات إنتاجية مع موردين صينيين موثوقين'
              : 'Create manufacturing partnerships with reliable Chinese suppliers'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الشراكات النشطة' : 'Active Partnerships'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>18</p>
            <p className={cn('text-sm text-green-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? '3+ جديدة هذا الشهر' : '3+ new this month'}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'العمال المعارون' : 'Workers on Loan'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              245
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'من 8 مصانع صينية' : 'from 8 Chinese plants'}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'برامج التدريب' : 'Training Programs'}
            </p>
            <p className={cn('text-3xl font-bold text-blue-400', isRTL && 'text-right')}>
              12
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? '6 قيد التقدم' : '6 in progress'}
            </p>
          </div>
        </div>

        {/* View Toggle and Action Button */}
        <div className={cn('flex gap-4 items-center justify-between flex-wrap', isRTL && 'flex-row-reverse')}>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('requests')}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'requests'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-[#c41e3a]'
              )}
            >
              {currentLanguage === 'ar' ? 'طلبات الشراكة' : 'Partnership Requests'}
            </button>
            <button
              onClick={() => setViewMode('offers')}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-colors',
                viewMode === 'offers'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#0c0f14] border border-[#242830] text-gray-300 hover:border-[#c41e3a]'
              )}
            >
              {currentLanguage === 'ar' ? 'العروض المتاحة' : 'Available Offers'}
            </button>
          </div>

          {viewMode === 'requests' && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {currentLanguage === 'ar' ? '+ طلب شراكة جديد' : '+ New Partnership Request'}
            </button>
          )}
        </div>

        {/* Partnership Request Form */}
        {showRequestForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'إنشاء طلب شراكة جديد' : 'Create New Partnership Request'}
            </h2>
            <PartnershipRequestForm
              currentLanguage={currentLanguage}
              isRTL={isRTL}
            />
          </div>
        )}

        {/* Requests View */}
        {viewMode === 'requests' && (
          <div className="space-y-4">
            {/* Filter */}
            <div>
              <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
                {currentLanguage === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-60 px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
              >
                <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
                <option value="open">{currentLanguage === 'ar' ? 'مفتوح' : 'Open'}</option>
                <option value="matched">{currentLanguage === 'ar' ? 'موافق' : 'Matched'}</option>
                <option value="negotiating">{currentLanguage === 'ar' ? 'تحت المفاوضة' : 'Negotiating'}</option>
                <option value="active">{currentLanguage === 'ar' ? 'نشط' : 'Active'}</option>
              </select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
                >
                  <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                    <div className={cn('flex-1', isRTL && 'text-right')}>
                      <h3 className="text-lg font-semibold mb-2">{request.factoryName}</h3>
                      <p className="text-gray-400 mb-3">{request.product}</p>
                      <div className={cn('flex gap-4 flex-wrap', isRTL && 'flex-row-reverse')}>
                        <span className="text-sm text-gray-400">
                          {currentLanguage === 'ar' ? 'الفجوة:' : 'Gap:'} {request.gapQuantity.toLocaleString()} {currentLanguage === 'ar' ? 'وحدة/الشهر' : 'units/month'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {currentLanguage === 'ar' ? 'المدة:' : 'Duration:'} {request.duration}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'px-4 py-2 rounded-lg border font-semibold whitespace-nowrap',
                        getStatusColor(request.status)
                      )}
                    >
                      {getStatusLabel(request.status)[currentLanguage as 'en' | 'ar']}
                    </span>
                  </div>

                  <div className={cn('flex items-center gap-2 mb-4', isRTL && 'flex-row-reverse')}>
                    <span className="text-sm text-gray-400">
                      {currentLanguage === 'ar' ? 'معايير الجودة:' : 'Quality Standards:'}
                    </span>
                    <div className={cn('flex gap-2 flex-wrap', isRTL && 'flex-row-reverse')}>
                      {request.qualityStandards.map((std) => (
                        <span
                          key={std}
                          className="px-3 py-1 bg-[#0c0f14] border border-[#242830] rounded-full text-xs text-gray-300"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                    <button className="px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                      {currentLanguage === 'ar' ? 'عرض العروض' : 'View Offers'}
                    </button>
                    <button className="px-4 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded hover:bg-[#d4a843]/30 transition-colors text-sm font-medium">
                      {currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers View */}
        {viewMode === 'offers' && (
          <div className="space-y-6">
            <div className={cn('p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-blue-400 text-sm', isRTL && 'text-right')}>
              {currentLanguage === 'ar'
                ? 'عروض متاحة من الموردين الصينيين استجابة لطلبات شراكتك'
                : 'Available offers from Chinese suppliers in response to your partnership requests'}
            </div>

            {demoOffers.map((offer) => (
              <PartnershipOfferCard
                key={offer.id}
                offer={offer}
                currentLanguage={currentLanguage}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
