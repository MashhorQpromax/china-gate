'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_LGS, DEMO_COMPANIES, DEMO_DEALS } from '@/lib/demo-data';
import { LGStatus } from '@/types';

interface LGDetailPageProps {
  params: {
    id: string;
  };
}

export default function LGDetailPage({ params }: LGDetailPageProps) {
  const lg = DEMO_LGS.find(l => l.id === params.id) || DEMO_LGS[0];
  const deal = DEMO_DEALS.find(d => d.id === lg.dealId);

  const lgStatusTimeline = [
    { status: LGStatus.DRAFT, label: 'Draft' },
    { status: LGStatus.REQUESTED, label: 'Workflow Approval' },
    { status: LGStatus.BANK_REVIEW, label: 'Applied' },
    { status: LGStatus.APPROVED, label: 'Issued' },
    { status: LGStatus.ISSUED, label: 'Active' },
    { status: LGStatus.CLAIMED, label: 'Amendment' },
    { status: LGStatus.RELEASED, label: 'Released' },
    { status: LGStatus.EXPIRED, label: 'Expired' },
  ];

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      BID_BOND: 'Bid Bond',
      PERFORMANCE_BOND: 'Performance Bond',
      ADVANCE_PAYMENT_GUARANTEE: 'Advance Payment Guarantee',
      CUSTOMS_GUARANTEE: 'Customs Guarantee',
      RETENTION_GUARANTEE: 'Retention Guarantee',
    };
    return typeLabels[type] || type;
  };

  const getStatusColor = (status: LGStatus) => {
    switch (status) {
      case LGStatus.ISSUED:
        return 'bg-green-500/20 text-green-300';
      case LGStatus.APPROVED:
        return 'bg-blue-500/20 text-blue-300';
      case LGStatus.BANK_REVIEW:
        return 'bg-yellow-500/20 text-yellow-300';
      case LGStatus.CLAIMED:
        return 'bg-orange-500/20 text-orange-300';
      case LGStatus.RELEASED:
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const daysUntilExpiry = Math.ceil((lg.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const expiryAlertLevel = daysUntilExpiry <= 3 ? 'critical' : daysUntilExpiry <= 7 ? 'warning' : daysUntilExpiry <= 15 ? 'caution' : 'normal';
  const expiryAlertColor = expiryAlertLevel === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-300' : expiryAlertLevel === 'warning' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : expiryAlertLevel === 'caution' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-green-500/20 border-green-500/50 text-green-300';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/lg" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to LGs
          </a>
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{lg.referenceNumber}</h1>
                <p className="text-gray-400 mt-2">{getTypeLabel(lg.type)}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">${(lg.amount / 1000000).toFixed(2)}M</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lg.status)}`}>
                  {lg.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Alert */}
        {daysUntilExpiry <= 30 && (
          <div className={`rounded-lg p-4 border ${expiryAlertColor}`}>
            <p className="font-semibold">⏰ Expiry Alert</p>
            <p className="text-sm mt-1">This LG expires in {daysUntilExpiry} days ({lg.expiryDate.toLocaleDateString()})</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Basic Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference:</span>
                <span className="text-white font-semibold">{lg.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deal:</span>
                <span className="text-white font-semibold">{deal?.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold">{getTypeLabel(lg.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beneficiary:</span>
                <span className="text-white font-semibold">{lg.beneficiary}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">💼 Claim Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Claim Condition:</span>
              </div>
              <p className="text-white text-sm">{lg.claimCondition}</p>
              {lg.amountClaimed && (
                <>
                  <div className="flex justify-between mt-3">
                    <span className="text-gray-400">Amount Claimed:</span>
                    <span className="text-white font-semibold">${(lg.amountClaimed / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Claim Date:</span>
                    <span className="text-white font-semibold">{lg.claimDate?.toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">💰 Financial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount</p>
              <p className="text-white font-semibold text-lg">${(lg.amount / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Currency</p>
              <p className="text-white font-semibold">{lg.currency}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount Available</p>
              <p className="text-green-400 font-semibold">${((lg.amount - (lg.amountClaimed || 0)) / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📅 Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Issue Date</p>
              <p className="text-white font-semibold">{lg.issueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
              <p className="text-white font-semibold">{lg.expiryDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Days Until Expiry</p>
              <p className={`font-semibold ${daysUntilExpiry <= 30 ? 'text-yellow-400' : 'text-green-400'}`}>{daysUntilExpiry} days</p>
            </div>
          </div>
        </div>

        {/* LG Status Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">📊 LG Status Timeline</h3>
          <div className="space-y-2">
            {lgStatusTimeline.map((item, idx) => {
              const currentStatusIndex = lgStatusTimeline.findIndex(s => s.status === lg.status);
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
                    {idx < lgStatusTimeline.length - 1 && <div className="w-0.5 h-8 bg-gray-700 mt-2" />}
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

        {/* Documents */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📄 Documents</h3>
          <div className="space-y-2 text-gray-400 py-6 text-center">
            <p className="text-sm">LG documents stored securely in system</p>
            <button className="mt-3 px-4 py-2 bg-[#c41e3a]/20 text-[#c41e3a] rounded-lg hover:bg-[#c41e3a]/30 transition-colors font-semibold border border-[#c41e3a]/50 text-sm">
              📥 Download Documents
            </button>
          </div>
        </div>

        {/* Workflow Status */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">✓ Workflow Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approval Status:</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">Approved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Verified By:</span>
              <span className="text-white font-semibold">Bank & Management</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Approval Date:</span>
              <span className="text-white font-semibold">{lg.issueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
