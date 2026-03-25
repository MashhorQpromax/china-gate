'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'CHINA GATE',
    description: 'International B2B E-commerce Platform for Manufacturing & Trade',
    currency: 'USD',
    language: 'English',
    commissionRate: 2.5,
    commissionType: 'percentage',
    enablePartnerships: true,
    enableBankingDemo: true,
    enableQualityTracking: true,
  });

  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData(settings);
    setSaved(false);
  };

  return (
    <DashboardLayout
      user={{ name: 'Admin', initials: 'AD' }}
      isAuthenticated={true}
      userRole="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
          <p className="text-gray-400">Configure global platform settings and features</p>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400 font-semibold">✓ Settings saved successfully!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#242830] space-x-8">
          {['general', 'commission', 'features', 'api'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-[#c41e3a] border-b-[#c41e3a]'
                  : 'text-gray-400 border-b-transparent hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Platform Name</label>
              <input
                type="text"
                value={formData.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Platform Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Default Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="SAR">Saudi Riyal (SAR)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                  <option value="CNY">Chinese Yuan (CNY)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Default Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Chinese">Chinese (中文)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Commission Settings */}
        {activeTab === 'commission' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Commission Type</label>
                <select
                  value={formData.commissionType}
                  onChange={(e) => handleInputChange('commissionType', e.target.value)}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Commission Rate ({formData.commissionType === 'percentage' ? '%' : 'per deal'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                Current commission structure: {formData.commissionRate}
                {formData.commissionType === 'percentage' ? '%' : ' USD'} per deal
              </p>
            </div>

            <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
              <p className="text-gray-400 text-sm font-semibold mb-3">Coming Soon: Advanced Commission Settings</p>
              <ul className="text-gray-500 text-sm space-y-2">
                <li>• Tiered commission rates based on deal value</li>
                <li>• Buyer vs Supplier commission split</li>
                <li>• Regional commission variations</li>
                <li>• Volume-based discounts</li>
              </ul>
            </div>
          </div>
        )}

        {/* Feature Toggles */}
        {activeTab === 'features' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <div>
                  <p className="font-semibold text-white">Partnership Program</p>
                  <p className="text-gray-400 text-sm">Enable labor lending and manufacturing partnerships</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enablePartnerships}
                    onChange={(e) => handleInputChange('enablePartnerships', e.target.checked)}
                    className="w-5 h-5 accent-[#c41e3a]"
                  />
                  <span className={`ml-2 ${formData.enablePartnerships ? 'text-green-400' : 'text-gray-400'}`}>
                    {formData.enablePartnerships ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <div>
                  <p className="font-semibold text-white">Banking Integration (Demo)</p>
                  <p className="text-gray-400 text-sm">Enable Rajhi Bank LC/LG demo feature</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableBankingDemo}
                    onChange={(e) => handleInputChange('enableBankingDemo', e.target.checked)}
                    className="w-5 h-5 accent-[#c41e3a]"
                  />
                  <span className={`ml-2 ${formData.enableBankingDemo ? 'text-green-400' : 'text-gray-400'}`}>
                    {formData.enableBankingDemo ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <div>
                  <p className="font-semibold text-white">Quality Tracking</p>
                  <p className="text-gray-400 text-sm">Enable quality inspection and dispute resolution</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableQualityTracking}
                    onChange={(e) => handleInputChange('enableQualityTracking', e.target.checked)}
                    className="w-5 h-5 accent-[#c41e3a]"
                  />
                  <span className={`ml-2 ${formData.enableQualityTracking ? 'text-green-400' : 'text-gray-400'}`}>
                    {formData.enableQualityTracking ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <p className="font-semibold text-white mb-2">🔌 Rajhi Bank API</p>
                <p className="text-gray-400 text-sm mb-3">Status: <span className="text-yellow-400">Coming Soon</span></p>
                <button className="px-4 py-2 border border-[#242830] text-white rounded-lg text-sm cursor-not-allowed opacity-50">
                  Configure API Keys
                </button>
              </div>

              <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <p className="font-semibold text-white mb-2">📊 FASAH Integration</p>
                <p className="text-gray-400 text-sm mb-3">Status: <span className="text-yellow-400">Coming Soon</span></p>
                <button className="px-4 py-2 border border-[#242830] text-white rounded-lg text-sm cursor-not-allowed opacity-50">
                  Configure API Keys
                </button>
              </div>

              <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <p className="font-semibold text-white mb-2">🛒 Alibaba Integration</p>
                <p className="text-gray-400 text-sm mb-3">Status: <span className="text-yellow-400">Coming Soon</span></p>
                <button className="px-4 py-2 border border-[#242830] text-white rounded-lg text-sm cursor-not-allowed opacity-50">
                  Configure API Keys
                </button>
              </div>

              <div className="p-4 bg-[#0c0f14] rounded-lg border border-[#242830]">
                <p className="font-semibold text-white mb-2">💳 Payment Gateway</p>
                <p className="text-gray-400 text-sm mb-3">Status: <span className="text-yellow-400">Coming Soon</span></p>
                <button className="px-4 py-2 border border-[#242830] text-white rounded-lg text-sm cursor-not-allowed opacity-50">
                  Configure API Keys
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Buttons */}
        {(activeTab === 'general' || activeTab === 'commission' || activeTab === 'features') && (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
