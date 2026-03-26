'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DealDetail {
  id: string;
  reference_number: string;
  buyer_id: string;
  supplier_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  incoterm: string | null;
  payment_terms: string | null;
  shipping_port: string | null;
  destination_port: string | null;
  shipping_method: string | null;
  expected_delivery_date: string | null;
  stage: string;
  stage_history: Array<{ stage?: string; from?: string; to?: string; timestamp: string; note?: string }>;
  created_at: string;
  updated_at: string;
  buyer?: { full_name_en: string; company_name: string; country: string; city: string; phone: string; email: string };
  supplier?: { full_name_en: string; company_name: string; country: string; city: string; phone: string; email: string };
  timeline: Array<{ id: string; action: string; description: string; old_value: string | null; new_value: string | null; created_at: string }>;
  shipments: Array<{ id: string; reference_number: string; status: string; carrier_name: string; estimated_arrival: string | null }>;
  letters_of_credit: Array<{ id: string; reference_number: string; amount: number; currency: string; status: string; lc_type: string }>;
  quality_inspections: Array<{ id: string; status: string; result: string | null; created_at: string }>;
}


function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const stageOrder = [
  'negotiation', 'quotation_sent', 'quotation_review', 'quotation_accepted',
  'po_issued', 'po_confirmed', 'production_start', 'production_inspection',
  'ready_for_shipment', 'lc_issued', 'goods_shipped', 'goods_in_transit',
  'port_arrived', 'customs_clearance', 'delivery', 'completed',
];

const stageLabels: Record<string, string> = {
  negotiation: 'Negotiation',
  quotation_sent: 'Quote Sent',
  quotation_review: 'Quote Review',
  quotation_accepted: 'Quote Accepted',
  po_issued: 'PO Issued',
  po_confirmed: 'PO Confirmed',
  production_start: 'Production',
  production_inspection: 'Quality Check',
  ready_for_shipment: 'Ready to Ship',
  lc_issued: 'LC Issued',
  goods_shipped: 'Shipped',
  goods_in_transit: 'In Transit',
  port_arrived: 'Port Arrived',
  customs_clearance: 'Customs',
  delivery: 'Delivery',
  completed: 'Completed',
};

function getStageColor(stage: string): string {
  const idx = stageOrder.indexOf(stage);
  if (idx < 4) return 'text-yellow-400';
  if (idx < 8) return 'text-blue-400';
  if (idx < 12) return 'text-purple-400';
  if (idx < 15) return 'text-orange-400';
  return 'text-green-400';
}

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params?.id as string;

  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [stageNote, setStageNote] = useState('');

  const fetchDeal = useCallback(async () => {
    if (!dealId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/deals/${dealId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view this deal');
          return;
        }
        if (res.status === 404) {
          setError('Deal not found');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.deal) {
        setDeal(json.deal);
      }
    } catch (err) {
      console.error('Failed to fetch deal:', err);
      setError('Failed to load deal details');
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  const handleAdvanceStage = async () => {
    if (!deal || advancing) return;
    const currentIdx = stageOrder.indexOf(deal.stage);
    if (currentIdx === -1 || currentIdx >= stageOrder.length - 1) return;
    const nextStage = stageOrder[currentIdx + 1];
    setAdvancing(true);
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage: nextStage, note: stageNote || `Advanced to ${stageLabels[nextStage] || nextStage}` }),
      });
      if (res.ok) {
        setStageNote('');
        fetchDeal();
      }
    } catch (err) {
      console.error('Failed to advance stage:', err);
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading deal details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !deal) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-3">{error || 'Deal not found'}</p>
          <div className="flex gap-3 justify-center">
            <a href="/deals" className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] text-sm">Back to Deals</a>
            <button onClick={fetchDeal} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentStageIdx = stageOrder.indexOf(deal.stage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/deals" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to Deals
          </a>
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{deal.reference_number || 'Deal'}</h1>
                <p className="text-gray-400 mt-2">
                  {deal.buyer?.company_name || deal.buyer?.full_name_en || 'Buyer'} → {deal.supplier?.company_name || deal.supplier?.full_name_en || 'Supplier'}
                </p>
                <p className="text-gray-500 text-sm mt-1">{deal.product_name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">{formatCurrency(deal.total_value, deal.currency)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 ${getStageColor(deal.stage)}`}>
                  {stageLabels[deal.stage] || deal.stage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Deal Progress</h3>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {stageOrder.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div key={stage} className="flex items-center flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[#c41e3a] animate-pulse' : 'bg-gray-600'}`} />
                  {idx < stageOrder.length - 1 && (
                    <div className={`w-6 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Stage {currentStageIdx + 1} of {stageOrder.length}: <span className="text-white font-semibold">{stageLabels[deal.stage] || deal.stage}</span>
          </p>
          {deal.stage !== 'completed' && currentStageIdx < stageOrder.length - 1 && (
            <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                placeholder="Add a note (optional)..."
                value={stageNote}
                onChange={(e) => setStageNote(e.target.value)}
                className="flex-1 bg-[#0c0f14] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
              <button
                onClick={handleAdvanceStage}
                disabled={advancing}
                className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
              >
                {advancing ? 'Updating...' : `Advance to ${stageLabels[stageOrder[currentStageIdx + 1]] || stageOrder[currentStageIdx + 1]}`}
              </button>
            </div>
          )}
        </div>

        {/* Stage Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Deal Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Quantity</p>
              <p className="text-white font-semibold text-lg">{(deal.quantity || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Unit Price</p>
              <p className="text-white font-semibold text-lg">{formatCurrency(deal.unit_price || 0, deal.currency)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Incoterm</p>
              <p className="text-white font-semibold text-lg">{deal.incoterm || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Payment Terms</p>
              <p className="text-white font-semibold text-lg">{deal.payment_terms || '-'}</p>
            </div>
          </div>
        </div>

        {/* Linked Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Agreement Details</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p><span className="text-gray-300">Reference:</span> {deal.reference_number}</p>
              <p><span className="text-gray-300">Created:</span> {new Date(deal.created_at).toLocaleDateString()}</p>
              <p><span className="text-gray-300">Shipping Port:</span> {deal.shipping_port || '-'}</p>
              <p><span className="text-gray-300">Destination Port:</span> {deal.destination_port || '-'}</p>
              <p><span className="text-gray-300">Shipping Method:</span> {deal.shipping_method || '-'}</p>
              {deal.expected_delivery_date && (
                <p><span className="text-gray-300">Expected Delivery:</span> {new Date(deal.expected_delivery_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Buyer Info */}
          {deal.buyer && (
            <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Buyer</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">Name:</span> {deal.buyer.full_name_en}</p>
                <p><span className="text-gray-300">Company:</span> {deal.buyer.company_name}</p>
                <p><span className="text-gray-300">Location:</span> {deal.buyer.city}, {deal.buyer.country}</p>
              </div>
            </div>
          )}

          {/* Supplier Info */}
          {deal.supplier && (
            <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Supplier</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">Name:</span> {deal.supplier.full_name_en}</p>
                <p><span className="text-gray-300">Company:</span> {deal.supplier.company_name}</p>
                <p><span className="text-gray-300">Location:</span> {deal.supplier.city}, {deal.supplier.country}</p>
              </div>
            </div>
          )}

          {/* LC/Payment Info */}
          {deal.letters_of_credit.length > 0 && (
            <a href={`/lc/${deal.letters_of_credit[0].id}`} className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-4">LC/Payment Info</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">LC Reference:</span> {deal.letters_of_credit[0].reference_number}</p>
                <p><span className="text-gray-300">Amount:</span> {formatCurrency(deal.letters_of_credit[0].amount, deal.letters_of_credit[0].currency)}</p>
                <p><span className="text-gray-300">Type:</span> {deal.letters_of_credit[0].lc_type}</p>
                <p><span className="text-gray-300">Status:</span> <span className="text-yellow-300">{deal.letters_of_credit[0].status}</span></p>
              </div>
            </a>
          )}

          {/* Shipping Info */}
          {deal.shipments.length > 0 && (
            <a href={`/shipping/${deal.shipments[0].id}`} className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-4">Shipping Info</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">Reference:</span> {deal.shipments[0].reference_number}</p>
                <p><span className="text-gray-300">Carrier:</span> {deal.shipments[0].carrier_name}</p>
                <p><span className="text-gray-300">Status:</span> <span className="text-blue-300">{deal.shipments[0].status}</span></p>
                {deal.shipments[0].estimated_arrival && (
                  <p><span className="text-gray-300">Expected:</span> {new Date(deal.shipments[0].estimated_arrival).toLocaleDateString()}</p>
                )}
              </div>
            </a>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Deal Timeline</h3>
          {deal.timeline.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No timeline events yet</p>
          ) : (
            <div className="space-y-4">
              {deal.timeline.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#c41e3a]" />
                    {idx < deal.timeline.length - 1 && <div className="w-0.5 h-12 bg-gray-700 mt-2" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-white font-semibold">{item.description}</p>
                    <p className="text-gray-400 text-sm">{new Date(item.created_at).toLocaleDateString()}</p>
                    {item.new_value && (
                      <p className="text-gray-500 text-xs mt-1">
                        {item.old_value ? `${item.old_value} → ` : ''}{item.new_value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stage History */}
        {deal.stage_history && deal.stage_history.length > 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Stage History</h3>
            <div className="space-y-3">
              {deal.stage_history.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300">
                      {entry.from ? `${stageLabels[entry.from] || entry.from} → ` : ''}
                      {stageLabels[entry.to || entry.stage || ''] || entry.to || entry.stage}
                    </span>
                    <span className="text-gray-500 ml-2">{new Date(entry.timestamp).toLocaleDateString()}</span>
                    {entry.note && <span className="text-gray-400 ml-2">— {entry.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
