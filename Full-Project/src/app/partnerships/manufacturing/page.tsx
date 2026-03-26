'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PartnershipRequestForm from '@/components/partnerships/PartnershipRequestForm';
import { cn } from '@/lib/utils';

interface Partnership {
  id: string;
  reference_number: string;
  initiator_id: string;
  partner_id: string;
  initiator_name: string;
  partner_name: string;
  partnership_type: string;
  title: string;
  description: string;
  terms: string;
  agreement_document_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ManufacturingPartnershipsPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [viewMode, setViewMode] = useState<'requests' | 'offers'>('requests');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (lang: 'en' | 'ar' | 'zh') => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
  };

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/partnerships?type=manufacturing&limit=50', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partnerships');
      }

      const result = await response.json();
      if (result.success) {
        setPartnerships(result.data || []);
      } else {
        setError(result.error?.message || 'Failed to fetch partnerships');
      }
    } catch (err) {
      console.error('Error fetching partnerships:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredPartnerships = partnerships.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      case 'under_discussion':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'agreement_sent':
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'agreement_signed':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'active':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'suspended':
        return 'bg-orange-900/30 text-orange-400 border-orange-700';
      case 'terminated':
        return 'bg-red-900/30 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      inquiry: { en: 'Inquiry', ar: 'استفسار' },
      under_discussion: { en: 'Under Discussion', ar: 'تحت النقاش' },
      agreement_sent: { en: 'Agreement Sent', ar: 'تم إرسال الاتفاق' },
      agreement_signed: { en: 'Agreement Signed', ar: 'تم توقيع الاتفاق' },
      active: { en: 'Active', ar: 'نشط' },
      suspended: { en: 'Suspended', ar: 'معلق' },
      terminated: { en: 'Terminated', ar: 'منتهي' },
    };
    return labels[status] || { en: status, ar: status };
  };

  if (loading) {
    return (
      <DashboardLayout
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#c41e3a]"></div>
            <p className="text-gray-400 mt-4">
              {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'الشراكات النشطة' : 'Active Partnerships'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {partnerships.filter(p => p.status === 'active').length}
            </p>
            <p className={cn('text-sm text-green-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'من إجمالي الشراكات' : 'of total partnerships'}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'جميع الشراكات' : 'Total Partnerships'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              {partnerships.length}
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'من جميع الحالات' : 'all statuses'}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'قيد المناقشة' : 'Under Discussion'}
            </p>
            <p className={cn('text-3xl font-bold text-blue-400', isRTL && 'text-right')}>
              {partnerships.filter(p => p.status === 'under_discussion').length}
            </p>
            <p className={cn('text-sm text-gray-400 mt-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'شراكات نشطة' : 'active discussions'}
            </p>
          </div>
        </div>

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

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchPartnerships}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
            >
              {currentLanguage === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {!error && (
          <div className="space-y-4">
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
                <option value="inquiry">{currentLanguage === 'ar' ? 'استفسار' : 'Inquiry'}</option>
                <option value="under_discussion">{currentLanguage === 'ar' ? 'تحت النقاش' : 'Under Discussion'}</option>
                <option value="agreement_sent">{currentLanguage === 'ar' ? 'تم إرسال الاتفاق' : 'Agreement Sent'}</option>
                <option value="agreement_signed">{currentLanguage === 'ar' ? 'تم توقيع الاتفاق' : 'Agreement Signed'}</option>
                <option value="active">{currentLanguage === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="suspended">{currentLanguage === 'ar' ? 'معلق' : 'Suspended'}</option>
                <option value="terminated">{currentLanguage === 'ar' ? 'منتهي' : 'Terminated'}</option>
              </select>
            </div>

            {filteredPartnerships.length === 0 ? (
              <div className="p-12 text-center bg-[#1a1d23] border border-[#242830] rounded-lg">
                <p className="text-gray-400 mb-4">
                  {currentLanguage === 'ar' ? 'لا توجد شراكات' : 'No partnerships found'}
                </p>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {currentLanguage === 'ar' ? '+ إنشاء الأول' : '+ Create One'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPartnerships.map((partnership) => (
                  <div
                    key={partnership.id}
                    className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
                  >
                    <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                      <div className={cn('flex-1', isRTL && 'text-right')}>
                        <h3 className="text-lg font-semibold mb-2">{partnership.reference_number}</h3>
                        <p className="text-gray-400 mb-2">{partnership.title}</p>
                        <div className={cn('flex gap-4 flex-wrap text-sm text-gray-400', isRTL && 'flex-row-reverse')}>
                          <span>{partnership.partner_name}</span>
                          <span>{partnership.partnership_type}</span>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'px-4 py-2 rounded-lg border font-semibold whitespace-nowrap',
                          getStatusColor(partnership.status)
                        )}
                      >
                        {getStatusLabel(partnership.status)[currentLanguage as 'en' | 'ar']}
                      </span>
                    </div>

                    <div className={cn('flex items-center gap-2 mb-4 pb-4 border-b border-[#242830]', isRTL && 'flex-row-reverse')}>
                      <span className="text-xs text-gray-400">
                        {currentLanguage === 'ar' ? 'تم الإنشاء:' : 'Created:'}
                      </span>
                      <span className="text-sm font-medium">{new Date(partnership.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                      <button className="px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                        {currentLanguage === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </button>
                      <button className="px-4 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded hover:bg-[#d4a843]/30 transition-colors text-sm font-medium">
                        {currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
