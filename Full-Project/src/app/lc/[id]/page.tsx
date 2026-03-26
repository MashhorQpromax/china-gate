'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LCDetail {
  id: string;
  reference_number: string;
  deal_id: string;
  buyer_id: string;
  supplier_id: string;
  issuing_bank: string;
  advising_bank: string | null;
  lc_type: string;
  amount: number;
  currency: string;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  latest_shipment_date: string | null;
  description: string | null;
  partial_shipment_allowed: boolean;
  transshipment_allowed: boolean;
  created_at: string;
  updated_at: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-300',
  requested: 'bg-yellow-500/20 text-yellow-300',
  under_review: 'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-blue-500/20 text-blue-300',
  issued: 'bg-green-500/20 text-green-300',
  accepted: 'bg-green-500/20 text-green-300',
  amendment_requested: 'bg-orange-500/20 text-orange-300',
  amended: 'bg-blue-500/20 text-blue-300',
  payment_made: 'bg-emerald-500/20 text-emerald-300',
  expired: 'bg-red-500/20 text-red-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

const lcStatusTimeline = [
  { status: 'draft', label: 'Draft' },
  { status: 'requested', label: 'Workflow Approval' },
  { status: 'under_review', label: 'Under Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'issued', label: 'Issued' },
  { status: 'accepted', label: 'Accepted' },
  { status: 'payment_made', label: 'Payment Released' },
  { status: 'expired', label: 'Closed' },
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

export default function LCDetailPage() {
  const params = useParams();
  const lcId = params?.id as string;

  const [lc, setLc] = useState<LCDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLC = useCallback(async () => {
    if (!lcId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/lc/${lcId}`, {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view this letter of credit');
          return;
        }
        if (res.status === 404) {
          setError('Letter of credit not found');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setLc(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch LC:', err);
      setError('Failed to load letter of credit');
    } finally {
      setLoading(false);
    }
  }, [lcId]);

  useEffect(() => {
    fetchLC();
  }, [fetchLC]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading letter of credit...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lc) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-3">{error || 'Letter of credit not found'}</p>
          <div className="flex gap-3 justify-center">
            <a href="/lc" className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] text-sm">Back to LCs</a>
            <button onClick={fetchLC} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getDaysUntilExpiry = (): number | null => {
    if (!lc.expiry_date) return null;
    return Math.ceil((new Date(lc.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const expiryAlertLevel = daysUntilExpiry === null ? 'normal' : daysUntilExpiry <= 3 ? 'critical' : daysUntilExpiry <= 7 ? 'warning' : daysUntilExpiry <= 15 ? 'caution' : 'normal';
  const expiryAlertColor = expiryAlertLevel === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-300' : expiryAlertLevel === 'warning' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : expiryAlertLevel === 'caution' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-green-500/20 border-green-500/50 text-green-300';

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
                <h1 className="text-3xl font-bold text-white">{lc.reference_number}</h1>
                <p className="text-gray-400 mt-2">{(lc.lc_type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">{formatCurrency(lc.amount, lc.currency)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[lc.status] || 'bg-gray-500/20 text-gray-300'}`}>
                  {(lc.status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
                ? `This LC has expired (${new Date(lc.expiry_date!).toLocaleDateString()})`
                : `This LC expires in ${daysUntilExpiry} days (${new Date(lc.expiry_date!).toLocaleDateString()})`
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
                <span className="text-white font-semibold">{lc.reference_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-semibold capitalize">{(lc.lc_type || '').replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Partial Shipment:</span>
                <span className={`font-semibold ${lc.partial_shipment_allowed ? 'text-green-400' : 'text-red-400'}`}>
                  {lc.partial_shipment_allowed ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transshipment:</span>
                <span className={`font-semibold ${lc.transshipment_allowed ? 'text-green-400' : 'text-red-400'}`}>
                  {lc.transshipment_allowed ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Banking Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Issuing Bank:</span>
                <span className="text-white font-semibold">{lc.issuing_bank}</span>
              </div>
              {lc.advising_bank && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Advising Bank:</span>
                  <span className="text-white font-semibold">{lc.advising_bank}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Amount</p>
              <p className="text-white font-semibold text-lg">{formatCurrency(lc.amount, lc.currency)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Currency</p>
              <p className="text-white font-semibold">{lc.currency}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-white font-semibold capitalize">{(lc.status || '').replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Important Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lc.issue_date && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Issue Date</p>
                <p className="text-white font-semibold">{new Date(lc.issue_date).toLocaleDateString()}</p>
              </div>
            )}
            {lc.expiry_date && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
                <p className="text-white font-semibold">{new Date(lc.expiry_date).toLocaleDateString()}</p>
              </div>
            )}
            {lc.latest_shipment_date && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Latest Shipment Date</p>
                <p className="text-white font-semibold">{new Date(lc.latest_shipment_date).toLocaleDateString()}</p>
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

        {/* LC Status Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">LC Status Timeline</h3>
          <div className="space-y-2">
            {lcStatusTimeline.map((item, idx) => {
              const currentStatusIndex = lcStatusTimeline.findIndex(s => s.status === lc.status);
              const isCompleted = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={item.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[#c41e3a] animate-pulse' : 'bg-gray-600'}`} />
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
          <h3 className="text-lg font-semibold text-white mb-4">Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc) => (
              <div key={doc.code} className="flex items-center gap-3 p-3 rounded-lg border bg-[#0c0f14] border-gray-700">
                <div>
                  <p className="text-white font-semibold">{doc.name}</p>
                  <p className="text-gray-400 text-xs">{doc.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {lc.description && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{lc.description}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
