'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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

export default function TrainingPartnershipsPage() {
  const [isRTL, setIsRTL] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar' | 'zh'>('en');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
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
      const token = localStorage.getItem('access_token');

      const response = await fetch('/api/partnerships?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partnerships');
      }

      const result = await response.json();
      if (result.success) {
        const allPartnerships = result.data || [];
        const trainingPartnerships = allPartnerships.filter(
          (p: Partnership) => p.partnership_type !== 'manufacturing' && p.partnership_type !== 'labor_lending'
        );
        setPartnerships(trainingPartnerships);
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
    if (filterType !== 'all' && p.partnership_type !== filterType) return false;
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
        return 'bg-purple-900/30 text-purple-400 border-purple-700';
      case 'suspended':
        return 'bg-orange-900/30 text-orange-400 border-orange-700';
      case 'terminated':
        return 'bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/50';
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
      active: { en: 'Active', ar: 'جاري' },
      suspended: { en: 'Suspended', ar: 'معلق' },
      terminated: { en: 'Completed', ar: 'مكتمل' },
    };
    return labels[status] || { en: status, ar: status };
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      distribution: { en: 'Distribution', ar: 'التوزيع' },
      joint_venture: { en: 'Joint Venture', ar: 'مشروع مشترك' },
      oem: { en: 'OEM', ar: 'تصنيع حسب الطلب' },
      odm: { en: 'ODM', ar: 'التصميم والتصنيع' },
    };
    return labels[type] || { en: type, ar: type };
  };

  const activeCount = partnerships.filter(p => p.status === 'active').length;
  const completedCount = partnerships.filter(p => p.status === 'terminated').length;
  const totalPartnerships = partnerships.length;

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
            {currentLanguage === 'ar' ? 'برامج التدريب والتطوير' : 'Training & Development Programs'}
          </h1>
          <p className={cn('text-gray-400', isRTL && 'text-right')}>
            {currentLanguage === 'ar'
              ? 'شراكات التدريب والتطوير المتقاطعة بين الصين والسعودية'
              : 'Cross-border training and development partnerships between China and Saudi Arabia'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'إجمالي البرامج' : 'Total Programs'}
            </p>
            <p className={cn('text-3xl font-bold', isRTL && 'text-right')}>
              {totalPartnerships}
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
              {currentLanguage === 'ar' ? 'المكتملة' : 'Completed'}
            </p>
            <p className={cn('text-3xl font-bold text-[#d4a843]', isRTL && 'text-right')}>
              {completedCount}
            </p>
          </div>

          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <p className={cn('text-sm text-gray-400 mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}
            </p>
            <p className={cn('text-3xl font-bold text-blue-400', isRTL && 'text-right')}>
              4.7★
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {currentLanguage === 'ar' ? '+ طلب برنامج تدريب' : '+ Request Training Program'}
          </button>
        </div>

        {showRequestForm && (
          <div className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg">
            <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'طلب برنامج تدريب جديد' : 'Request New Training Program'}
            </h2>
            <form className="space-y-6">
              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'نوع الشراكة' : 'Partnership Type'}
                </label>
                <select
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                >
                  <option value="distribution">{currentLanguage === 'ar' ? 'التوزيع' : 'Distribution'}</option>
                  <option value="joint_venture">{currentLanguage === 'ar' ? 'مشروع مشترك' : 'Joint Venture'}</option>
                  <option value="oem">{currentLanguage === 'ar' ? 'تصنيع حسب الطلب' : 'OEM'}</option>
                  <option value="odm">{currentLanguage === 'ar' ? 'التصميم والتصنيع' : 'ODM'}</option>
                </select>
              </div>

              <div>
                <label className={cn('block font-semibold mb-2', isRTL && 'text-right')}>
                  {currentLanguage === 'ar' ? 'عنوان البرنامج' : 'Program Title'}
                </label>
                <input
                  type="text"
                  placeholder={currentLanguage === 'ar' ? 'مثال: برنامج التدريب المتقدم' : 'e.g., Advanced Training Program'}
                  className={cn('w-full px-4 py-2 bg-[#0c0f14] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none', isRTL && 'text-right')}
                />
              </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isRTL && 'text-right')}>
              {currentLanguage === 'ar' ? 'نوع الشراكة' : 'Partnership Type'}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1d23] border border-[#242830] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'الكل' : 'All'}</option>
              <option value="distribution">{currentLanguage === 'ar' ? 'التوزيع' : 'Distribution'}</option>
              <option value="joint_venture">{currentLanguage === 'ar' ? 'مشروع مشترك' : 'Joint Venture'}</option>
              <option value="oem">{currentLanguage === 'ar' ? 'تصنيع حسب الطلب' : 'OEM'}</option>
              <option value="odm">{currentLanguage === 'ar' ? 'التصميم والتصنيع' : 'ODM'}</option>
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
              <option value="inquiry">{currentLanguage === 'ar' ? 'استفسار' : 'Inquiry'}</option>
              <option value="under_discussion">{currentLanguage === 'ar' ? 'تحت النقاش' : 'Under Discussion'}</option>
              <option value="agreement_signed">{currentLanguage === 'ar' ? 'تم التوقيع' : 'Agreement Signed'}</option>
              <option value="active">{currentLanguage === 'ar' ? 'جاري' : 'Active'}</option>
              <option value="terminated">{currentLanguage === 'ar' ? 'مكتمل' : 'Completed'}</option>
            </select>
          </div>
        </div>

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
            {filteredPartnerships.length === 0 ? (
              <div className="p-12 text-center bg-[#1a1d23] border border-[#242830] rounded-lg">
                <p className="text-gray-400 mb-4">
                  {currentLanguage === 'ar' ? 'لا توجد برامج تدريب' : 'No training programs found'}
                </p>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {currentLanguage === 'ar' ? '+ إنشاء الأول' : '+ Create One'}
                </button>
              </div>
            ) : (
              filteredPartnerships.map((program) => (
                <div
                  key={program.id}
                  className="p-6 bg-[#1a1d23] border border-[#242830] rounded-lg hover:border-[#c41e3a] transition-all"
                >
                  <div className={cn('flex items-start justify-between gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                    <div className={cn('flex-1', isRTL && 'text-right')}>
                      <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
                      <p className="text-gray-400 mb-2">{program.partner_name}</p>
                      <div className={cn('text-sm text-[#d4a843] font-medium', isRTL && 'text-right')}>
                        {getTypeLabel(program.partnership_type)[currentLanguage as 'en' | 'ar']}
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

                  <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 mb-4', isRTL && 'text-right')}>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        {currentLanguage === 'ar' ? 'الرقم المرجعي' : 'Reference'}
                      </p>
                      <p className="font-medium text-sm">{program.reference_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        {currentLanguage === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                      </p>
                      <p className="font-medium text-sm">
                        {program.start_date ? new Date(program.start_date).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        {currentLanguage === 'ar' ? 'الوصف' : 'Description'}
                      </p>
                      <p className="font-medium text-sm line-clamp-1">{program.description || 'N/A'}</p>
                    </div>
                  </div>

                  <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                    <button className="flex-1 px-4 py-2 bg-[#c41e3a]/20 border border-[#c41e3a] text-[#c41e3a] rounded hover:bg-[#c41e3a]/30 transition-colors text-sm font-medium">
                      {currentLanguage === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                    {program.status === 'inquiry' || program.status === 'under_discussion' ? (
                      <button className="flex-1 px-4 py-2 bg-green-600/20 border border-green-600 text-green-400 rounded hover:bg-green-600/30 transition-colors text-sm font-medium">
                        {currentLanguage === 'ar' ? 'الموافقة' : 'Approve'}
                      </button>
                    ) : (
                      <button className="flex-1 px-4 py-2 bg-[#d4a843]/20 border border-[#d4a843] text-[#d4a843] rounded hover:bg-[#d4a843]/30 transition-colors text-sm font-medium">
                        {currentLanguage === 'ar' ? 'تقييم' : 'Rate'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
