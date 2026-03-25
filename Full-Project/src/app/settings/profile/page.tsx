'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [saved, setSaved] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Ahmed',
    lastName: 'Al-Rashid',
    email: 'ahmed.rashid@example.com',
    phone: '+966 55 123 4567',
    country: 'Saudi Arabia',
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Rashid Trading Company',
    companyType: 'buyer',
    registrationNumber: 'SA-2024-001',
    industry: 'General Trading',
    website: 'www.rashidtrading.com',
    address: '123 Business Street, Riyadh',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailQuotations: true,
    emailMessages: true,
    emailDeals: true,
    emailPayments: true,
    emailDisputes: true,
    pushNotifications: true,
    smsAlerts: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'dark',
    timezone: 'UTC+03:00',
    currency: 'USD',
  });

  const handleSavePersonal = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveCompany = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePassword = () => {
    if (password.new === password.confirm) {
      setSaved(true);
      setPassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const labels = {
    en: {
      personal: 'Personal Information',
      company: 'Company Information',
      password: 'Change Password',
      notifications: 'Notifications',
      preferences: 'Preferences',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      country: 'Country',
      companyName: 'Company Name',
      companyType: 'Company Type',
      registrationNumber: 'Registration Number',
      industry: 'Industry',
      website: 'Website',
      address: 'Address',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      emailQuotations: 'Email notifications for new quotations',
      emailMessages: 'Email notifications for messages',
      emailDeals: 'Email notifications for deal updates',
      emailPayments: 'Email notifications for payments',
      emailDisputes: 'Email notifications for disputes',
      pushNotifications: 'Push notifications (mobile)',
      smsAlerts: 'SMS alerts for critical updates',
      language: 'Language',
      theme: 'Theme',
      timezone: 'Timezone',
      currency: 'Currency',
      saveChanges: 'Save Changes',
      deleteAccount: 'Delete Account',
      confirmation: 'Are you sure? This action cannot be undone.',
    },
    ar: {
      personal: 'المعلومات الشخصية',
      company: 'معلومات الشركة',
      password: 'تغيير كلمة المرور',
      notifications: 'الإشعارات',
      preferences: 'التفضيلات',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      country: 'الدولة',
      companyName: 'اسم الشركة',
      companyType: 'نوع الشركة',
      registrationNumber: 'رقم التسجيل',
      industry: 'الصناعة',
      website: 'الموقع الإلكتروني',
      address: 'العنوان',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      emailQuotations: 'إشعارات البريد الإلكتروني للعروض الجديدة',
      emailMessages: 'إشعارات البريد الإلكتروني للرسائل',
      emailDeals: 'إشعارات البريد الإلكتروني لتحديثات الصفقات',
      emailPayments: 'إشعارات البريد الإلكتروني للدفع',
      emailDisputes: 'إشعارات البريد الإلكتروني للنزاعات',
      pushNotifications: 'إشعارات دفع (الهاتف المحمول)',
      smsAlerts: 'تنبيهات SMS للتحديثات الحرجة',
      language: 'اللغة',
      theme: 'المظهر',
      timezone: 'المنطقة الزمنية',
      currency: 'العملة',
      saveChanges: 'حفظ التغييرات',
      deleteAccount: 'حذف الحساب',
      confirmation: 'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.',
    },
  };

  const l = labels[language];

  return (
    <DashboardLayout
      user={{ name: 'Ahmed Al-Rashid', initials: 'AR' }}
      isAuthenticated={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
            </h1>
            <p className="text-gray-400">
              {language === 'en' ? 'Manage your profile and preferences' : 'إدارة ملفك الشخصي والتفضيلات'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded ${
                language === 'en'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#1a1d23] border border-[#242830] text-gray-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded ${
                language === 'ar'
                  ? 'bg-[#c41e3a] text-white'
                  : 'bg-[#1a1d23] border border-[#242830] text-gray-300 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400 font-semibold">✓ {language === 'en' ? 'Changes saved successfully!' : 'تم حفظ التغييرات بنجاح!'}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#242830] space-x-8 overflow-x-auto">
          {['personal', 'company', 'password', 'notifications', 'preferences'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#c41e3a] border-b-[#c41e3a]'
                  : 'text-gray-400 border-b-transparent hover:text-white'
              }`}
            >
              {language === 'en'
                ? l[tab as keyof typeof l]
                : l[tab as keyof typeof l]}
            </button>
          ))}
        </div>

        {/* Personal Information */}
        {activeTab === 'personal' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.firstName}</label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.lastName}</label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.email}</label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.phone}</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.country}</label>
                <input
                  type="text"
                  value={personalInfo.country}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSavePersonal}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {l.saveChanges}
              </button>
            </div>
          </div>
        )}

        {/* Company Information */}
        {activeTab === 'company' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.companyName}</label>
              <input
                type="text"
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.companyType}</label>
                <select
                  value={companyInfo.companyType}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, companyType: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                  <option value="manufacturer">Manufacturer</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.registrationNumber}</label>
                <input
                  type="text"
                  value={companyInfo.registrationNumber}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.industry}</label>
              <input
                type="text"
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.website}</label>
                <input
                  type="url"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.address}</label>
              <textarea
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                rows={3}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveCompany}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {l.saveChanges}
              </button>
            </div>
          </div>
        )}

        {/* Password */}
        {activeTab === 'password' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6 max-w-md">
            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.currentPassword}</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.newPassword}</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{l.confirmPassword}</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSavePassword}
                disabled={!password.current || !password.new || password.new !== password.confirm}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
              >
                {l.saveChanges}
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 p-3 rounded bg-[#0c0f14] border border-[#242830] cursor-pointer hover:border-[#c41e3a] transition-colors">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-5 h-5 accent-[#c41e3a]"
                />
                <span className="text-white">{l[key as keyof typeof l]}</span>
              </label>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSavePreferences}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {l.saveChanges}
              </button>
            </div>
          </div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.language}</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.theme}</label>
                <select
                  value={preferences.theme}
                  disabled
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none opacity-50 cursor-not-allowed"
                >
                  <option value="dark">Dark (Current)</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.timezone}</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="UTC+00:00">UTC+00:00</option>
                  <option value="UTC+03:00">UTC+03:00</option>
                  <option value="UTC+08:00">UTC+08:00</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">{l.currency}</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="SAR">SAR (ر.س)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSavePreferences}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {l.saveChanges}
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {(activeTab === 'personal' || activeTab === 'company') && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Danger Zone</h3>
            <p className="text-gray-400 mb-4">
              {language === 'en'
                ? 'Permanently delete your account and all associated data. This action cannot be undone.'
                : 'احذف حسابك وجميع البيانات المرتبطة به بشكل دائم. لا يمكن التراجع عن هذا الإجراء.'}
            </p>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              {l.deleteAccount}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
