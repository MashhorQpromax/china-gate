'use client';

import { useState } from 'react';
import { Currency, Incoterm } from '@/types';
import { DEMO_DEALS, DEMO_COMPANIES } from '@/lib/demo-data';

interface LCFormProps {
  onSubmit?: (lcData: any) => void;
}

interface LCFormData {
  dealId: string;
  applicantId: string;
  beneficiaryId: string;
  amount: number;
  currency: Currency;
  lcType: 'IRREVOCABLE' | 'REVOCABLE' | 'STANDBY' | 'REVOLVING' | 'BACK_TO_BACK' | 'TRANSFERABLE';
  paymentTerms: 'AT_SIGHT' | 'NET_30' | 'NET_60' | 'NET_90' | 'NET_120' | 'DEFERRED' | 'MIXED' | 'ACCEPTANCE';
  shipmentDate: string;
  expiryDate: string;
  partialShipment: boolean;
  transshipment: boolean;
  portOfLoading: string;
  portOfDischarge: string;
  incoterm: Incoterm;
  goodsDescription: string;
}

export default function LCForm({ onSubmit }: LCFormProps) {
  const [formData, setFormData] = useState<LCFormData>({
    dealId: '',
    applicantId: '',
    beneficiaryId: '',
    amount: 0,
    currency: Currency.USD,
    lcType: 'IRREVOCABLE',
    paymentTerms: 'AT_SIGHT',
    shipmentDate: '',
    expiryDate: '',
    partialShipment: false,
    transshipment: false,
    portOfLoading: '',
    portOfDischarge: '',
    incoterm: Incoterm.CIF,
    goodsDescription: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleDealChange = (dealId: string) => {
    setFormData({ ...formData, dealId });
    const deal = DEMO_DEALS.find(d => d.id === dealId);
    if (deal) {
      setFormData(prev => ({
        ...prev,
        amount: deal.totalValue,
        currency: deal.currency,
        incoterm: deal.incoterm,
        portOfLoading: deal.shippingPort,
        portOfDischarge: deal.destinationPort,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
        <p className="text-green-400 font-semibold text-lg mb-2">✓ LC Request Submitted!</p>
        <p className="text-gray-400 text-sm">Your LC will go through workflow approval. You will be notified once it's processed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Deal Selection */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">📋 Select Deal</h3>
        <select
          value={formData.dealId}
          onChange={(e) => handleDealChange(e.target.value)}
          required
          className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
        >
          <option value="">Choose a deal...</option>
          {DEMO_DEALS.map(deal => (
            <option key={deal.id} value={deal.id}>
              {deal.referenceNumber} - ${(deal.totalValue / 1000000).toFixed(2)}M
            </option>
          ))}
        </select>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">👤 Applicant (Your Company)</h3>
          <select
            value={formData.applicantId}
            onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
            required
            className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            <option value="">Select applicant company...</option>
            {DEMO_COMPANIES.filter(c => c.companyRole === 'BUYER').map(company => (
              <option key={company.id} value={company.id}>{company.nameEn}</option>
            ))}
          </select>
        </div>

        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">👥 Beneficiary (Supplier)</h3>
          <select
            value={formData.beneficiaryId}
            onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
            required
            className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            <option value="">Select beneficiary company...</option>
            {DEMO_COMPANIES.filter(c => c.companyRole === 'SUPPLIER' || c.companyRole === 'MANUFACTURER').map(company => (
              <option key={company.id} value={company.id}>{company.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">💰 Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value={Currency.USD}>USD</option>
              <option value={Currency.CNY}>CNY</option>
              <option value={Currency.SAR}>SAR</option>
              <option value={Currency.AED}>AED</option>
            </select>
          </div>
        </div>
      </div>

      {/* LC Type & Payment Terms */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">📄 LC Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">LC Type</label>
            <select
              value={formData.lcType}
              onChange={(e) => setFormData({ ...formData, lcType: e.target.value as any })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="IRREVOCABLE">Irrevocable</option>
              <option value="REVOCABLE">Revocable</option>
              <option value="STANDBY">Standby</option>
              <option value="REVOLVING">Revolving</option>
              <option value="BACK_TO_BACK">Back-to-Back</option>
              <option value="TRANSFERABLE">Transferable</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Payment Terms</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as any })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="AT_SIGHT">At Sight</option>
              <option value="NET_30">Net 30 Days</option>
              <option value="NET_60">Net 60 Days</option>
              <option value="NET_90">Net 90 Days</option>
              <option value="NET_120">Net 120 Days</option>
              <option value="DEFERRED">Deferred</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Shipment Date</label>
            <input
              type="date"
              value={formData.shipmentDate}
              onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
              required
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">🚢 Shipping Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Port of Loading</label>
            <input
              type="text"
              value={formData.portOfLoading}
              onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
              placeholder="e.g., CNSHA"
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Port of Discharge</label>
            <input
              type="text"
              value={formData.portOfDischarge}
              onChange={(e) => setFormData({ ...formData, portOfDischarge: e.target.value })}
              placeholder="e.g., SAWHA"
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Incoterm</label>
            <select
              value={formData.incoterm}
              onChange={(e) => setFormData({ ...formData, incoterm: e.target.value as Incoterm })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value={Incoterm.FOB}>FOB</option>
              <option value={Incoterm.CIF}>CIF</option>
              <option value={Incoterm.CFR}>CFR</option>
              <option value={Incoterm.EXW}>EXW</option>
              <option value={Incoterm.DDP}>DDP</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Goods Description</label>
            <input
              type="text"
              value={formData.goodsDescription}
              onChange={(e) => setFormData({ ...formData, goodsDescription: e.target.value })}
              placeholder="e.g., Hot Rolled Steel Coils"
              required
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.partialShipment}
              onChange={(e) => setFormData({ ...formData, partialShipment: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Partial Shipment Allowed</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.transshipment}
              onChange={(e) => setFormData({ ...formData, transshipment: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Transshipment Allowed</span>
          </label>
        </div>
      </div>

      {/* Workflow Notice */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-blue-300">
        <p className="font-semibold text-sm">★ Workflow Approval</p>
        <p className="text-xs mt-1">This LC will go through management approval before being sent to the bank.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Submit LC Request
      </button>
    </form>
  );
}
