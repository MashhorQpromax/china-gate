'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

type NotificationType = 'quotation' | 'message' | 'deal_update' | 'lc_lg' | 'approval' | 'inspection' | 'shipping' | 'partnership';

interface Notification {
  id: string;
  type: NotificationType;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

const notificationIcons: Record<NotificationType, string> = {
  quotation: '📋',
  message: '💬',
  deal_update: '📊',
  lc_lg: '🏦',
  approval: '✅',
  inspection: '🔍',
  shipping: '🚢',
  partnership: '🏭',
};

const demoNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'quotation',
    titleEn: 'New Quotation Received',
    titleAr: 'تم استقبال عرض سعر جديد',
    descriptionEn: 'Ahmed Al-Rashid sent a quotation for 5000 tons of steel pipes',
    descriptionAr: 'أرسل أحمد الراشد عرض سعر لـ 5000 طن من الأنابيب المعدنية',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
  },
  {
    id: 'notif-002',
    type: 'message',
    titleEn: 'New Message',
    titleAr: 'رسالة جديدة',
    descriptionEn: 'Sarah Chen sent you a message about the quality inspection',
    descriptionAr: 'أرسلت لك سارة تشن رسالة حول فحص الجودة',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: 'notif-003',
    type: 'deal_update',
    titleEn: 'Deal Stage Updated',
    titleAr: 'تم تحديث مرحلة الصفقة',
    descriptionEn: 'Deal #2024-001 moved to Quality Inspection stage',
    descriptionAr: 'انتقلت الصفقة #2024-001 إلى مرحلة فحص الجودة',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
  {
    id: 'notif-004',
    type: 'lc_lg',
    titleEn: 'LC/LG Status Changed',
    titleAr: 'تغير حالة الاعتماد المستندي',
    descriptionEn: 'Your letter of credit for Deal #2024-005 has been confirmed by the bank',
    descriptionAr: 'تم تأكيد الاعتماد المستندي الخاص بك للصفقة #2024-005 من قبل البنك',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: true,
  },
  {
    id: 'notif-005',
    type: 'approval',
    titleEn: 'Workflow Approval Needed',
    titleAr: 'يتطلب موافقة سير العمل',
    descriptionEn: 'Your purchase request for electronics needs approval from the manager',
    descriptionAr: 'يتطلب طلب الشراء الخاص بك للإلكترونيات موافقة المدير',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true,
  },
  {
    id: 'notif-006',
    type: 'inspection',
    titleEn: 'Quality Inspection Update',
    titleAr: 'تحديث فحص الجودة',
    descriptionEn: 'Quality inspection completed. 98% pass rate on shipment from Zhejiang',
    descriptionAr: 'اكتمل فحص الجودة. معدل نجاح 98% على الشحنة من Zhejiang',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isRead: true,
  },
  {
    id: 'notif-007',
    type: 'shipping',
    titleEn: 'Shipping Alert',
    titleAr: 'تنبيه الشحن',
    descriptionEn: 'Your shipment has arrived at the port of Dubai. Processing in progress.',
    descriptionAr: 'وصلت شحنتك إلى ميناء دبي. المعالجة جارية.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
  },
  {
    id: 'notif-008',
    type: 'partnership',
    titleEn: 'Partnership Request',
    titleAr: 'طلب شراكة',
    descriptionEn: 'Zhejiang Heavy Industries sent you a partnership offer for labor lending',
    descriptionAr: 'أرسلت إليك Zhejiang Heavy Industries عرض شراكة لتأجير العمالة',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true,
  },
  {
    id: 'notif-009',
    type: 'quotation',
    titleEn: 'New Quotation Received',
    titleAr: 'تم استقبال عرض سعر جديد',
    descriptionEn: 'Shanghai Electronics sent quotation for 50000 electronic capacitors',
    descriptionAr: 'أرسلت Shanghai Electronics عرض سعر لـ 50000 مكثف إلكتروني',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: true,
  },
  {
    id: 'notif-010',
    type: 'deal_update',
    titleEn: 'Deal Completed',
    titleAr: 'اكتملت الصفقة',
    descriptionEn: 'Deal #2024-003 has been successfully completed',
    descriptionAr: 'اكتملت الصفقة #2024-003 بنجاح',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [selectedFilter, setSelectedFilter] = useState<'all' | NotificationType>('all');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const filtered = useMemo(() => {
    return selectedFilter === 'all'
      ? notifications
      : notifications.filter(n => n.type === selectedFilter);
  }, [notifications, selectedFilter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return language === 'en' ? 'Just now' : 'للتو';
    if (minutes < 60) return language === 'en' ? `${minutes}m ago` : `منذ ${minutes} دقيقة`;
    if (hours < 24) return language === 'en' ? `${hours}h ago` : `منذ ${hours} ساعة`;
    if (days < 7) return language === 'en' ? `${days}d ago` : `منذ ${days} يوم`;
    return language === 'en' ? date.toLocaleDateString() : date.toLocaleDateString('ar-SA');
  };

  return (
    <DashboardLayout
      user={{ name: 'User', initials: 'U' }}
      isAuthenticated={true}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">
              {language === 'en'
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : `لديك ${unreadCount} إشعار${unreadCount !== 1 ? 'ات' : ''} غير مقروء`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm"
            >
              {language === 'en' ? 'Mark All as Read' : 'تحديد الكل كمقروء'}
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              {language === 'en' ? 'Clear All' : 'حذف الكل'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">
                {language === 'en' ? 'Filter by Type' : 'تصفية حسب النوع'}
              </h3>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <input
                  type="radio"
                  checked={selectedFilter === 'all'}
                  onChange={() => setSelectedFilter('all')}
                  className="w-4 h-4 accent-[#c41e3a]"
                />
                <span className="text-gray-300 text-sm">{language === 'en' ? 'All' : 'الكل'}</span>
              </label>
              {Object.entries(notificationIcons).map(([type, icon]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedFilter === type}
                    onChange={() => setSelectedFilter(type as NotificationType)}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300 text-sm">
                    {icon} {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-white text-sm">Language</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                    language === 'en'
                      ? 'bg-[#c41e3a] text-white'
                      : 'bg-[#0c0f14] border border-[#242830] text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                    language === 'ar'
                      ? 'bg-[#c41e3a] text-white'
                      : 'bg-[#0c0f14] border border-[#242830] text-gray-400 hover:text-white'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notif.isRead
                          ? 'bg-[#1a1d23] border-[#242830] hover:border-[#343a45]'
                          : 'bg-[#1a1d23] border-[#c41e3a] hover:border-red-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="text-3xl flex-shrink-0">
                          {notificationIcons[notif.type]}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white">
                              {language === 'en' ? notif.titleEn : notif.titleAr}
                            </h3>
                            {!notif.isRead && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#c41e3a] rounded-full" />
                                <span className="text-xs text-[#c41e3a]">New</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {language === 'en' ? notif.descriptionEn : notif.descriptionAr}
                          </p>
                          <p className="text-gray-600 text-xs mt-2">
                            {formatTime(notif.timestamp)}
                          </p>
                        </div>

                        {/* Status Indicator */}
                        {!notif.isRead && (
                          <div className="w-3 h-3 bg-[#c41e3a] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <p className="text-gray-400">
                  {language === 'en'
                    ? 'No notifications in this category'
                    : 'لا توجد إشعارات في هذه الفئة'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
