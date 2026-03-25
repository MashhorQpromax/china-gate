'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DealStageTracker from '@/components/deals/DealStageTracker';
import RatingForm from '@/components/deals/RatingForm';
import { DEMO_DEALS, DEMO_COMPANIES, DEMO_LCS, DEMO_SHIPMENTS, DEMO_QUALITY_JOURNEYS } from '@/lib/demo-data';
import { DealStage } from '@/types';

interface DealDetailPageProps {
  params: {
    id: string;
  };
}

export default function DealDetailPage({ params }: DealDetailPageProps) {
  const [showRatingForm, setShowRatingForm] = useState(false);

  const deal = DEMO_DEALS.find(d => d.id === params.id) || DEMO_DEALS[0];
  const buyer = DEMO_COMPANIES.find(c => c.id === deal.buyerId);
  const supplier = DEMO_COMPANIES.find(c => c.id === deal.supplierId);
  const lc = DEMO_LCS.find(l => l.dealId === deal.id);
  const shipment = DEMO_SHIPMENTS.find(s => s.dealId === deal.id);
  const qualityJourney = DEMO_QUALITY_JOURNEYS.find(q => q.dealId === deal.id);

  const stageLabels: Record<DealStage, string> = {
    [DealStage.NEGOTIATION]: 'Negotiation',
    [DealStage.QUOTATION_SENT]: 'Quote Sent',
    [DealStage.QUOTATION_REVIEW]: 'Quote Review',
    [DealStage.QUOTATION_ACCEPTED]: 'Quote Accepted',
    [DealStage.PO_ISSUED]: 'PO Issued',
    [DealStage.PO_CONFIRMED]: 'PO Confirmed',
    [DealStage.PRODUCTION_START]: 'Production',
    [DealStage.PRODUCTION_INSPECTION]: 'Quality Check',
    [DealStage.READY_FOR_SHIPMENT]: 'Ready to Ship',
    [DealStage.LC_ISSUED]: 'LC Issued',
    [DealStage.GOODS_SHIPPED]: 'Shipped',
    [DealStage.GOODS_IN_TRANSIT]: 'In Transit',
    [DealStage.PORT_ARRIVED]: 'Port Arrived',
    [DealStage.CUSTOMS_CLEARANCE]: 'Customs',
    [DealStage.DELIVERY]: 'Delivery',
    [DealStage.COMPLETED]: 'Completed',
  };

  const timeline = [
    { date: deal.createdAt, event: 'Deal Created', status: 'completed' },
    { date: new Date(deal.updatedAt.getTime() + 2 * 24 * 60 * 60 * 1000), event: 'Quote Sent', status: 'completed' },
    { date: new Date(deal.updatedAt.getTime() + 4 * 24 * 60 * 60 * 1000), event: 'Quote Accepted', status: 'completed' },
    { date: new Date(deal.updatedAt.getTime() + 6 * 24 * 60 * 60 * 1000), event: 'PO Issued', status: deal.stage !== DealStage.NEGOTIATION ? 'completed' : 'pending' },
    { date: deal.expectedDeliveryDate, event: 'Expected Delivery', status: 'pending' },
  ];

  const actionButtons = {
    [DealStage.QUOTATION_ACCEPTED]: { label: 'Issue PO', icon: '📄' },
    [DealStage.PO_CONFIRMED]: { label: 'Start Production', icon: '🏭' },
    [DealStage.PRODUCTION_INSPECTION]: { label: 'Start Inspection', icon: '🔍' },
    [DealStage.READY_FOR_SHIPMENT]: { label: 'Book Shipping', icon: '📦' },
    [DealStage.LC_ISSUED]: { label: 'Confirm Shipment', icon: '✓' },
    [DealStage.PORT_ARRIVED]: { label: 'Clear Customs', icon: '🛂' },
    [DealStage.CUSTOMS_CLEARANCE]: { label: 'Finalize Delivery', icon: '🚚' },
  } as Record<DealStage, any>;

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
                <h1 className="text-3xl font-bold text-white">{deal.referenceNumber}</h1>
                <p className="text-gray-400 mt-2">
                  {buyer?.nameEn} → {supplier?.nameEn}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#d4a843]">${(deal.totalValue / 1000000).toFixed(2)}M</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-300">
                  {stageLabels[deal.stage]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Tracker */}
        <DealStageTracker currentStage={deal.stage} />

        {/* Current Stage Details */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Stage Details: {stageLabels[deal.stage]}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Quantity</p>
                <p className="text-white font-semibold text-lg">{deal.quantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unit Price</p>
                <p className="text-white font-semibold text-lg">${deal.unitPrice}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Incoterm</p>
                <p className="text-white font-semibold text-lg">{deal.incoterm}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment Terms</p>
                <p className="text-white font-semibold text-lg">{deal.paymentTerms}</p>
              </div>
            </div>

            {actionButtons[deal.stage] && (
              <button className="w-full mt-4 px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2">
                <span>{actionButtons[deal.stage].icon}</span>
                <span>{actionButtons[deal.stage].label}</span>
              </button>
            )}
          </div>
        </div>

        {/* Linked Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Agreement Details</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p><span className="text-gray-300">Reference:</span> {deal.referenceNumber}</p>
              <p><span className="text-gray-300">Created:</span> {deal.createdAt.toLocaleDateString()}</p>
              <p><span className="text-gray-300">Shipping Port:</span> {deal.shippingPort}</p>
              <p><span className="text-gray-300">Destination Port:</span> {deal.destinationPort}</p>
            </div>
          </div>

          {/* LC/Payment Info */}
          {lc && (
            <a href={`/lc/${lc.id}`} className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-4">🏦 LC/Payment Info</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">LC Reference:</span> {lc.referenceNumber}</p>
                <p><span className="text-gray-300">Amount:</span> ${(lc.amount / 1000000).toFixed(2)}M</p>
                <p><span className="text-gray-300">Type:</span> {lc.type}</p>
                <p><span className="text-gray-300">Status:</span> <span className="text-yellow-300">{lc.status}</span></p>
              </div>
            </a>
          )}

          {/* Shipping Info */}
          {shipment && (
            <a href={`/shipping/${shipment.id}`} className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700 hover:border-[#c41e3a]/50 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-4">🚢 Shipping Info</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">Reference:</span> {shipment.referenceNumber}</p>
                <p><span className="text-gray-300">Carrier:</span> {shipment.carrierName}</p>
                <p><span className="text-gray-300">Status:</span> <span className="text-blue-300">{shipment.status}</span></p>
                <p><span className="text-gray-300">Expected:</span> {shipment.expectedArrivalDate.toLocaleDateString()}</p>
              </div>
            </a>
          )}

          {/* Quality Journey */}
          {qualityJourney && (
            <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">✅ Quality Journey</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><span className="text-gray-300">Status:</span> <span className="text-green-300">{qualityJourney.status}</span></p>
                <p><span className="text-gray-300">Stages Completed:</span> {qualityJourney.stages.length}</p>
                <p><span className="text-gray-300">Overall Result:</span> {qualityJourney.overallResult}</p>
              </div>
            </div>
          )}

          {/* Workflow Approval */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Workflow Status</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p><span className="text-gray-300">Approval:</span> <span className="text-green-300">Approved</span></p>
              <p><span className="text-gray-300">Verified By:</span> Management</p>
              <p><span className="text-gray-300">Date:</span> {deal.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Deal Timeline</h3>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${item.status === 'completed' ? 'bg-[#c41e3a]' : 'bg-gray-600'}`} />
                  {idx < timeline.length - 1 && <div className="w-0.5 h-12 bg-gray-700 mt-2" />}
                </div>
                <div className="pt-1">
                  <p className="text-white font-semibold">{item.event}</p>
                  <p className="text-gray-400 text-sm">{item.date.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Form - Shown if deal is completed */}
        {deal.stage === DealStage.COMPLETED && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-green-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">⭐ Deal Completion Rating</h3>
            {!showRatingForm ? (
              <button
                onClick={() => setShowRatingForm(true)}
                className="px-6 py-2 bg-[#d4a843] text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
              >
                Share Your Experience
              </button>
            ) : (
              <RatingForm dealId={deal.id} />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
