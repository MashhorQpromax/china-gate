'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LGDetail {
  id: string;
  reference_number: string;
  deal_id: string;
  requester_id: string;
  beneficiary_id: string;
  issuing_bank: string;
  lg_type: string;
  amount: number;
  currency: string;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  beneficiary_name: string | null;
  claim_condition: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function getAuthHeaders(): Record<string, string> {
  // httpOnly cookies are sent automatically with fetch when credentials: 'include' is set
  return {};
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-300',
  requested: 'bg-yellow-500/20 text-yellow-300',
  bank_review: 'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-blue-500/20 text-blue-300',
  issued: 'bg-green-500/20 text-green-300',
  claimed: 'bg-orange-500/20 text-orange-300',
  released: 'bg-emerald-500/20 text-emerald-300',
  expired: 'bg-red-500/20 text-red-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

const typeLabels: Record<string, string> = {
  bid_bond: 'Bid Bond',
  performance_bond: 'Performance Bond',
  advance_payment_guarantee: 'Advance Payment Guarantee',
  customs_guarantee: 'Customs Guarantee',
  retention_guarantee: 'Retention Guarantee',
};

const lgStatusTimeline = [
  { status: 'draft', label: 'Draft' },
  { status: 'requested', label: 'Workflow Approval' },
  { status: 'bank_review', label: 'Bank Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'issued', label: 'Active' },
  { status: 'claimed', label: 'Claimed' },
  { status: 'released', label: 'Released' },
  { status: 'expired', label: 'Expired' },
];

export default function LGDetailPage() {
  const params = useParams();
  const lgId = params?.id as string;

  const [lg, setLg] = useState<LGDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLG = useCallback(async () => {
    if (!lgId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/lg/${lgId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view this letter of guarantee');
          return;
        }
        if (res.status === 404) {
          setError('Letter of guarantee not found');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setLg(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch LG:', err);
      setError('Failed to load letter of guarantee');
    } finally {
      setLoading(false);
    }
  }, [lgId]);

  useEffect(() => {
    fetchLG();
  }, [fetchLG]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading letter of guarantee...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lg) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-3">{error || 'Letter of guarantee not found'}</p>
          <div className="flex gap-3 justify-center">
            <a href="/lg" className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] text-sm">Back to LGs</a>
            <button onClick={fetchLG} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getDaysUntilExpiry = (): number | null => {
    if (!lg.expiry_date) return null;
    return Math.ceil((new Date(lg.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const expiryAlertLevel = daysUntilExpiry === null ? 'normal' : daysUntilExpiry <= 3 ? 'critical' : daysUntilExpiry <= 7 ? 'warning' : daysUntilExpiry <= 15 ? 'caution' : 'normal';
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
                <h1 className="text-3xl font-bold text-white">{lg.reference_number}</h1>
                <p className="text-gray-400 mt-2">{typeLabels[lg.lg_type] || lg.lg_type}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">{formatCurrency(lg.amount, lg.currency)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[lg.status] || 'bg-gray-500/20 text-gray-300'}`}>
                  {(lg.status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Alert */}
        {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
          <div className={`rounded-lg p-4 border ${expiryAlertColor}`}>
            <p className="font-semibold">Expiry Alert</p>
            <p className="text-sm mt-1">
              {daysUntilExpiry <= 0
                ? `This LG has expired (${new Date(lg.expiry_date!).toLocaleDateString()})`
                : `This LG expires in ${daysUntilExpiry} days (${new Date(lg.expiry_date!).toLocaleDateString()})`
              }
            </p>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference:</span>
                <span className="text-white font-semibold">{lg.reference_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold">{typeLabels[lg.lg_type] || lg.lg_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beneficiary:</span>
                <span className="text-white font-semibold">{lg.beneficiary_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issuing Bank:</span>
                <span className="text-white font-semibold">{lg.issuing_bank}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Claim Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Claim Condition:</span>
              </div>
              <p className="text-white text-sm">{lg.claim_condition || 'No specific claim condition defined'}</p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount</p>
              <p className="text-white font-semibold text-lg">{formatCurrency(lg.amount, lg.currency)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Currency</p>
              <p className="text-white font-semibold">{lg.currency}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-white font-semibold capitalize">{(lg.status || '').replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Important Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lg.issue_date && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Issue Date</p>
                <p className="text-white font-semibold">{new Date(lg.issue_date).toLocaleDateString()}</p>
              </div>
            )}
            {lg.expiry_date && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
                <p className="text-white font-semibold">{new Date(lg.expiry_date).toLocaleDateString()}</p>
              </div>
            )}
            {daysUntilExpiry !== null && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Days Until Expiry</p>
                <p className={`font-semibold ${daysUntilExpiry <= 0 ? 'text-red-400' : daysUntilExpiry <= 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LG Status Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">LG Status Timeline</h3>
          <div className="space-y-2">
            {lgStatusTimeline.map((item, idx) => {
              const currentStatusIndex = lgStatusTimeline.findIndex(s => s.status === lg.status);
              const isCompleted = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={item.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[#c41e3a] animate-pulse' : 'bg-gray-600'}`} />
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

        {/* Description */}
        {lg.description && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{lg.description}</p>
          </div>
        )}

        {/* Documents */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
          <div className="text-gray-400 py-6 text-center">
            <p className="text-sm">LG documents stored securely in system</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
