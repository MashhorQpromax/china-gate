'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

type NotificationType = 'quotation' | 'message' | 'deal_update' | 'lc_lg' | 'approval' | 'inspection' | 'shipping' | 'partnership' | 'system' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  reference_type?: string;
  reference_id?: string;
}

const notificationIcons: Record<string, string> = {
  quotation: '📋',
  message: '💬',
  deal_update: '📊',
  lc_lg: '🏦',
  approval: '✅',
  inspection: '🔍',
  shipping: '🚢',
  partnership: '🏭',
  system: '⚙️',
  info: 'ℹ️',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | string>('all');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/notifications?page=${pageNum}&limit=20`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError(language === 'en' ? 'Please log in to view notifications' : 'يرجى تسجيل الدخول لعرض الإشعارات');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        setNotifications(json.data?.notifications || []);
        setUnreadCount(json.data?.unreadCount || 0);
        if (json.meta) {
          setTotalPages(json.meta.totalPages || 1);
        }
      } else {
        throw new Error(json.error || 'Failed to fetch');
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(language === 'en' ? 'Failed to load notifications' : 'فشل تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  // Filter notifications client-side by type
  const filtered = useMemo(() => {
    return selectedFilter === 'all'
      ? notifications
      : notifications.filter(n => n.type === selectedFilter);
  }, [notifications, selectedFilter]);

  // Mark single notification as read via PATCH
  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    setMarkingRead(id);

    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notification_ids: [id] }),
      });

      if (!res.ok) {
        // Revert on failure
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: false } : n))
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch {
      // Revert on error
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: false } : n))
      );
      setUnreadCount(prev => prev + 1);
    } finally {
      setMarkingRead(null);
    }
  };

  // Mark all as read via PATCH
  const handleMarkAllAsRead = async () => {
    // Optimistic update
    const prevNotifications = [...notifications];
    const prevUnread = unreadCount;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ all: true }),
      });

      if (!res.ok) {
        // Revert on failure
        setNotifications(prevNotifications);
        setUnreadCount(prevUnread);
      }
    } catch {
      // Revert on error
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
    }
  };

  // Format relative time from ISO string
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
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

  // Get icon for notification type (fallback to info)
  const getIcon = (type: string) => notificationIcons[type] || notificationIcons.info;

  return (
    <DashboardLayout
      user={{ name: 'User', initials: 'U' }}
      isAuthenticated={true}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'en' ? 'Notifications' : 'الإشعارات'}
            </h1>
            <p className="text-gray-400">
              {language === 'en'
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : `لديك ${unreadCount} إشعار${unreadCount !== 1 ? 'ات' : ''} غير مقروء`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'en' ? 'Mark All as Read' : 'تحديد الكل كمقروء'}
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
                    onChange={() => setSelectedFilter(type)}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300 text-sm">
                    {icon} {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
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
            {/* Loading State */}
            {loading && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">
                  {language === 'en' ? 'Loading notifications...' : 'جاري تحميل الإشعارات...'}
                </p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-[#1a1d23] border border-red-600 rounded-lg p-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchNotifications(page)}
                  className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            )}

            {/* Notifications */}
            {!loading && !error && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notif.read
                          ? 'bg-[#1a1d23] border-[#242830] hover:border-[#343a45]'
                          : 'bg-[#1a1d23] border-[#c41e3a] hover:border-red-600'
                      } ${markingRead === notif.id ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="text-3xl flex-shrink-0">
                          {getIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white">
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#c41e3a] rounded-full" />
                                <span className="text-xs text-[#c41e3a]">
                                  {language === 'en' ? 'New' : 'جديد'}
                                </span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {notif.message}
                          </p>
                          <p className="text-gray-600 text-xs mt-2">
                            {formatTime(notif.created_at)}
                          </p>
                        </div>

                        {/* Status Indicator */}
                        {!notif.read && (
                          <div className="w-3 h-3 bg-[#c41e3a] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm disabled:opacity-50"
                    >
                      {language === 'en' ? 'Previous' : 'السابق'}
                    </button>
                    <span className="px-4 py-2 text-gray-400 text-sm">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm disabled:opacity-50"
                    >
                      {language === 'en' ? 'Next' : 'التالي'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filtered.length === 0 && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <p className="text-4xl mb-4">🔔</p>
                <p className="text-gray-400">
                  {selectedFilter === 'all'
                    ? (language === 'en' ? 'No notifications yet' : 'لا توجد إشعارات بعد')
                    : (language === 'en' ? 'No notifications in this category' : 'لا توجد إشعارات في هذه الفئة')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
