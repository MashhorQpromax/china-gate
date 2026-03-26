'use client';

import { useState, useEffect, useCallback } from 'react';

interface LCFormProps {
  onSubmit?: (lcData: any) => void;
}

interface ApiDeal {
  id: string;
  reference_number: string;
  total_value: number;
  currency: string;
  incoterm: string | null;
  shipping_port: string | null;
  destination_port: string | null;
  buyer_name?: string;
  supplier_name?: string;
}

interface LCFormData {
  dealId: string;
  amount: number;
  currency: string;
  lcType: string;
  paymentTerms: string;
  shipmentDate: string;
  expiryDate: string;
  partialShipment: boolean;
  transshipment: boolean;
  portOfLoading: string;
  portOfDischarge: string;
  incoterm: string;
  goodsDescription: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function LCForm({ onSubmit }: LCFormProps) {
  const [formData, setFormData] = useState<LCFormData>({
    dealId: '',
    amount: 0,
    currency: 'USD',
    lcType: 'irrevocable',
    paymentTerms: 'at_sight',
    shipmentDate: '',
    expiryDate: '',
    partialShipment: false,
    transshipment: false,
    portOfLoading: '',
    portOfDischarge: '',
    incoterm: 'CIF',
    goodsDescription: '',
  });

  const [deals, setDeals] = useState<ApiDeal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      setLoadingDeals(true);
      const res = await fetch('/api/deals?limit=100', {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDeals(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    } finally {
      setLoadingDeals(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleDealChange = (dealId: string) => {
    setFormData({ ...formData, dealId });
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setFormData(prev => ({
        ...prev,
        dealId,
        amount: deal.total_value || 0,
        currency: deal.currency || 'USD',
        incoterm: deal.incoterm || 'CIF',
        portOfLoading: deal.shipping_port || '',
        portOfDischarge: deal.destination_port || '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) {
      onSubmit(formData);
    }
    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
        <p className="text-green-400 font-semibold text-lg mb-2">LC Request Submitted!</p>
        <p className="text-gray-400 text-sm">Your LC will go through workflow approval. You will be notified once it is processed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Deal Selection */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Select Deal</h3>
        {loadingDeals ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Loading deals...</p>
          </div>
        ) : (
          <select
            value={formData.dealId}
            onChange={(e) => handleDealChange(e.target.value)}
            required
            className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
          >
            <option value="">Choose a deal...</option>
            {deals.map(deal => (
              <option key={deal.id} value={deal.id}>
                {deal.reference_number} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency || 'USD', maximumFractionDigits: 0 }).format(deal.total_value || 0)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Financial Details */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
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
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="USD">USD</option>
              <option value="CNY">CNY</option>
              <option value="SAR">SAR</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>
      </div>

      {/* LC Type & Payment Terms */}
      <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">LC Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">LC Type</label>
            <select
              value={formData.lcType}
              onChange={(e) => setFormData({ ...formData, lcType: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="irrevocable">Irrevocable</option>
              <option value="revocable">Revocable</option>
              <option value="standby">Standby</option>
              <option value="revolving">Revolving</option>
              <option value="back_to_back">Back-to-Back</option>
              <option value="transferable">Transferable</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Payment Terms</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="at_sight">At Sight</option>
              <option value="net_30">Net 30 Days</option>
              <option value="net_60">Net 60 Days</option>
              <option value="net_90">Net 90 Days</option>
              <option value="net_120">Net 120 Days</option>
              <option value="deferred">Deferred</option>
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
        <h3 className="text-lg font-semibold text-white mb-4">Shipping Options</h3>
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
              onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
              className="w-full bg-[#0c0f14] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
            >
              <option value="FOB">FOB</option>
              <option value="CIF">CIF</option>
              <option value="CFR">CFR</option>
              <option value="EXW">EXW</option>
              <option value="DDP">DDP</option>
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
        <p className="font-semibold text-sm">Workflow Approval</p>
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
