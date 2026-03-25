'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_LCS, DEMO_COMPANIES, DEMO_DEALS } from '@/lib/demo-data';
import { LCStatus } from '@/types';

interface LCDetailPageProps {
  params: {
    id: string;
  };
}

export default function LCDetailPage({ params }: LCDetailPageProps) {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const lc = DEMO_LCS.find(l => l.id === params.id) || DEMO_LCS[0];
  const deal = DEMO_DEALS.find(d => d.id === lc.dealId);
  const applicant = DEMO_COMPANIES.find(c => c.id === lc.buyerId);
  const beneficiary = DEMO_COMPANIES.find(c => c.id === lc.supplierId);

  const lcStatusTimeline = [
    { status: LCStatus.DRAFT, label: 'Draft' },
    { status: LCStatus.REQUESTED, label: 'Workflow Approval' },
    { status: LCStatus.BANK_RECEIVED, label: 'Applied' },
    { status: LCStatus.UNDER_REVIEW, label: 'Under Review' },
    { status: LCStatus.APPROVED, label: 'Issued' },
    { status: LCStatus.ACCEPTED, label: 'Advised' },
    { status: LCStatus.PAYMENT_MADE, label: 'Payment Released' },
    { status: LCStatus.EXPIRED, label: 'Closed' },
  ];

  const requiredDocuments = [
    { name: 'Commercial Invoice', code: 'CI' },
    { name: 'Packing List', code: 'PL' },
    { name: 'Bill of Lading', code: 'BL' },
    { name: 'Certificate of Origin', code: 'CO' },
    { name: 'Insurance Certificate', code: 'IC' },
    { name: 'Inspection Certificate', code: 'INSP' },
    { name: 'Fumigation Certificate', code: 'FC' },
    { name: 'SASO/SABER Certificate', code: 'SASO' },
    { name: 'Health Certificate', code: 'HC' },
    { name: 'Quality Report', code: 'QR' },
  ];

  const daysUntilExpiry = Math.ceil((lc.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const expiryAlertLevel = daysUntilExpiry <= 3 ? 'critical' : daysUntilExpiry <= 7 ? 'warning' : daysUntilExpiry <= 15 ? 'caution' : 'normal';
  const expiryAlertColor = expiryAlertLevel === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-300' : expiryAlertLevel === 'warning' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : expiryAlertLevel === 'caution' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-green-500/20 border-green-500/50 text-green-300';

  const getStatusColor = (status: LCStatus) => {
    switch (status) {
      case LCStatus.ISSUED:
        return 'bg-green-500/20 text-green-300';
      case LCStatus.APPROVED:
        return 'bg-blue-500/20 text-blue-300';
      case LCStatus.UNDER_REVIEW:
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/lc" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to LCs
          </a>
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{lc.referenceNumber}</h1>
                <p className="text-gray-400 mt-2">{applicant?.nameEn} → {beneficiary?.nameEn}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">${(lc.amount / 1000000).toFixed(2)}M</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lc.status)}`}>
                  {lc.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Alert */}
        {daysUntilExpiry <= 30 && (
          <div className={`rounded-lg p-4 border ${expiryAlertColor}`}>
            <p className="font-semibold">⏰ Expiry Alert</p>
            <p className="text-sm mt-1">This LC expires in {daysUntilExpiry} days ({lc.expiryDate.toLocaleDateString()})</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Basic Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference:</span>
                <span className="text-white font-semibold">{lc.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deal:</span>
                <span className="text-white font-semibold">{deal?.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold">{lc.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipments Required:</span>
                <span className="text-white font-semibold">{lc.shipmentsRequired}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">💼 Parties</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Applicant</p>
                <p className="text-white font-semibold">{applicant?.nameEn}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Beneficiary</p>
                <p className="text-white font-semibold">{beneficiary?.nameEn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">💰 Financial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount</p>
              <p className="text-white font-semibold text-lg">${(lc.amount / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Currency</p>
              <p className="text-white font-semibold">{lc.currency}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount Used</p>
              <p className="text-white font-semibold">${(lc.amountUsed / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount Available</p>
              <p className="text-green-400 font-semibold">${((lc.amount - lc.amountUsed) / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </div>

        {/* Shipping & Dates */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">🚢 Shipping Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Issue Date</p>
              <p className="text-white font-semibold">{lc.issueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
              <p className="text-white font-semibold">{lc.expiryDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Days Until Expiry</p>
              <p className={`font-semibold ${daysUntilExpiry <= 30 ? 'text-yellow-400' : 'text-green-400'}`}>{daysUntilExpiry} days</p>
            </div>
          </div>
        </div>

        {/* LC Status Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">📊 LC Status Timeline</h3>
          <div className="space-y-2">
            {lcStatusTimeline.map((item, idx) => {
              const currentStatusIndex = lcStatusTimeline.findIndex(s => s.status === lc.status);
              const isCompleted = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={item.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                            ? 'bg-[#c41e3a] animate-pulse'
                            : 'bg-gray-600'
                      }`}
                    />
                    {idx < lcStatusTimeline.length - 1 && <div className="w-0.5 h-8 bg-gray-700 mt-2" />}
                  </div>
                  <div className="pt-1 pb-4">
                    <p className={`font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📄 Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {requiredDocuments.map((doc, idx) => {
              const isUploaded = uploadedDocs.includes(doc.code);
              return (
                <label key={doc.code} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isUploaded ? 'bg-green-500/10 border-green-500/50' : 'bg-[#0c0f14] border-gray-700 hover:border-[#c41e3a]/50'}`}>
                  <input type="checkbox" checked={isUploaded} readOnly className="w-4 h-4" />
                  <div>
                    <p className={`font-semibold ${isUploaded ? 'text-green-400' : 'text-white'}`}>{doc.name}</p>
                    <p className="text-gray-400 text-xs">{doc.code}</p>
                  </div>
                  {isUploaded && <span className="ml-auto text-green-400">✓</span>}
                </label>
              );
            })}
          </div>
          <button className="w-full px-4 py-2 bg-[#c41e3a]/20 text-[#c41e3a] rounded-lg hover:bg-[#c41e3a]/30 transition-colors font-semibold border border-[#c41e3a]/50">
            📤 Upload Documents
          </button>
        </div>

        {/* Workflow Approval Status */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">✓ Workflow Approval Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approval Status:</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">Approved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approved By:</span>
              <span className="text-white font-semibold">Management Team</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approval Date:</span>
              <span className="text-white font-semibold">{lc.issueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Amendment History */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📝 Amendment History</h3>
          <div className="text-gray-400 py-8 text-center">
            <p className="text-sm">No amendments on record</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
