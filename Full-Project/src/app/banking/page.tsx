'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AccountCard from '@/components/banking/AccountCard';
import TransactionList from '@/components/banking/TransactionList';
import { Currency } from '@/types';

type ModalType = 'WIRE' | 'LC' | 'LG' | 'EXCHANGE' | 'STATEMENT' | null;

export default function BankingPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const quickActions = [
    { id: 'wire', en: 'Wire Transfer', ar: 'تحويل دولي', icon: '💸' },
    { id: 'lc', en: 'Open LC', ar: 'فتح LC', icon: '📋' },
    { id: 'lg', en: 'Open LG', ar: 'فتح LG', icon: '🛡️' },
    { id: 'payment', en: 'Pay Invoices', ar: 'سداد فواتير', icon: '✅' },
    { id: 'statement', en: 'Statement', ar: 'كشف حساب', icon: '📊' },
    { id: 'exchange', en: 'Currency Exchange', ar: 'صرف عملات', icon: '💱' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Integrated Banking</h1>
          <p className="text-gray-400 mt-1">Manage your accounts, transfers, and banking services</p>
        </div>

        {/* Demo Mode Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Demo Mode Active</p>
            <p className="text-yellow-200 text-xs mt-1">
              هذه الخدمة ستُربط مباشرة مع بنك الراجحي — حالياً: نسخة تجريبية
            </p>
            <p className="text-yellow-200 text-xs mt-2">
              This service will be directly integrated with Al-Rajhi Bank. Currently in demo mode with placeholder data.
            </p>
          </div>
        </div>

        {/* Account Card */}
        <AccountCard
          balance={1250000}
          baseCurrency={Currency.SAR}
          bankName="Al-Rajhi Bank"
          accountNumber="SA1234567890123456789"
          status="DEMO"
          lastUpdated={new Date()}
        />

        {/* Quick Actions */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveModal(action.id.toUpperCase() as ModalType)}
                className="bg-[#0c0f14] border border-gray-700 hover:border-[#c41e3a] rounded-lg p-4 transition-all hover:bg-[#1a1f2b] group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                <p className="text-white text-sm font-semibold text-left">{action.en}</p>
                <p className="text-gray-400 text-xs text-left">{action.ar}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bank Connection Button */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <button className="w-full px-6 py-3 bg-gradient-to-r from-[#c41e3a] to-[#d4a843] text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2">
            🔗 طلب ربط حسابي البنكي
          </button>
          <p className="text-gray-400 text-xs mt-3 text-center">Request to connect your bank account for real transactions</p>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Recent Transactions</h3>
          <TransactionList
            onExportPDF={() => console.log('Export PDF')}
            onExportExcel={() => console.log('Export Excel')}
          />
        </div>

        {/* Banking Services Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">🌐</div>
            <h4 className="text-white font-semibold mb-2">International Wire Transfers</h4>
            <p className="text-gray-400 text-sm">Fast and secure wire transfers to suppliers worldwide with real-time tracking</p>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">📋</div>
            <h4 className="text-white font-semibold mb-2">Letter of Credit</h4>
            <p className="text-gray-400 text-sm">Issue and manage letters of credit for secure trade financing and payment guarantees</p>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">💱</div>
            <h4 className="text-white font-semibold mb-2">Multi-Currency Support</h4>
            <p className="text-gray-400 text-sm">Trade in multiple currencies with competitive exchange rates and real-time conversion</p>
          </div>
        </div>

        {/* Modals */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0c0f14] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#1a1f2b] border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-white font-bold text-xl">
                  {activeModal === 'WIRE' && 'International Wire Transfer'}
                  {activeModal === 'LC' && 'Open Letter of Credit'}
                  {activeModal === 'LG' && 'Open Letter of Guarantee'}
                  {activeModal === 'EXCHANGE' && 'Currency Exchange'}
                  {activeModal === 'STATEMENT' && 'Bank Statement'}
                  {activeModal === 'PAYMENT' && 'Pay Invoices'}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {activeModal === 'WIRE' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Wire Transfer Form</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}

                {activeModal === 'LC' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Letter of Credit Request</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}

                {activeModal === 'LG' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Letter of Guarantee Request</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}

                {activeModal === 'EXCHANGE' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Currency Exchange</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}

                {activeModal === 'STATEMENT' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Bank Statement</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}

                {activeModal === 'PAYMENT' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Pay Invoices</p>
                    <p className="text-gray-500 text-sm">This feature will be available in the next phase of integration</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-[#1a1f2b] border-t border-gray-700 p-6 flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
