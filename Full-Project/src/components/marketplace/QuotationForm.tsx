'use client';

import React, { useState } from 'react';

interface QuotationFormProps {
  requestId: string;
  onClose?: () => void;
}

const shippingCompanies = [
  'China Ocean Shipping',
  'Shanghai Shipping Co.',
  'Zhejiang Maritime',
  'Ningbo Port Authority',
  'Qingdao Shipping',
];

const incoterms = ['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'FCA', 'CPT', 'CIP', 'DAP', 'DAT'];

const paymentTerms = [
  'Advance Payment',
  'Advance Deposit (30%)',
  'After Inspection',
  'Cash on Delivery (COD)',
  'Net 30',
  'Net 60',
  'Net 90',
  'Letter of Credit (LC)',
];

export default function QuotationForm({ requestId, onClose }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    pricePerUnit: '',
    availableQuantity: '',
    leadTimeDays: '',
    incoterm: 'FOB',
    paymentTerms: 'LC',
    shippingCompany: 'Shanghai Shipping Co.',
    estimatedShippingCost: '',
    notes: '',
    attachments: [] as string[],
    validityDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/rfq/${requestId}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: 'current-user-id',
          unitPrice: parseFloat(formData.pricePerUnit),
          quantity: parseInt(formData.availableQuantity),
          totalPrice: parseFloat(formData.pricePerUnit) * parseInt(formData.availableQuantity) + (parseFloat(formData.estimatedShippingCost) || 0),
          incoterm: formData.incoterm,
          paymentTerms: formData.paymentTerms,
          leadTime: parseInt(formData.leadTimeDays),
          leadTimeUnit: 'days',
          estimatedShippingCost: parseFloat(formData.estimatedShippingCost) || 0,
          shippingMethod: formData.shippingCompany,
          validUntil: formData.validityDate,
          notes: formData.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit quotation');
        return;
      }

      if (onClose) onClose();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = formData.pricePerUnit && formData.availableQuantity
    ? (parseFloat(formData.pricePerUnit) * parseInt(formData.availableQuantity)).toLocaleString()
    : '0';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-4">
      {/* Price per Unit */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Price per Unit (USD)</label>
        <input
          type="number"
          name="pricePerUnit"
          value={formData.pricePerUnit}
          onChange={handleChange}
          placeholder="e.g., 500"
          required
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Available Quantity */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Available Quantity</label>
        <input
          type="number"
          name="availableQuantity"
          value={formData.availableQuantity}
          onChange={handleChange}
          placeholder="e.g., 50000"
          required
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Lead Time */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Lead Time (Days)</label>
        <input
          type="number"
          name="leadTimeDays"
          value={formData.leadTimeDays}
          onChange={handleChange}
          placeholder="e.g., 35"
          required
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Incoterm */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Incoterm</label>
        <select
          name="incoterm"
          value={formData.incoterm}
          onChange={handleChange}
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
        >
          {incoterms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Payment Terms</label>
        <select
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleChange}
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
        >
          {paymentTerms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>

      {/* Shipping Company */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Shipping Company</label>
        <select
          name="shippingCompany"
          value={formData.shippingCompany}
          onChange={handleChange}
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
        >
          {shippingCompanies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Estimated Shipping Cost */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Estimated Shipping Cost (USD)</label>
        <input
          type="number"
          name="estimatedShippingCost"
          value={formData.estimatedShippingCost}
          onChange={handleChange}
          placeholder="e.g., 750000"
          required
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Validity Date */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Validity Date</label>
        <input
          type="date"
          name="validityDate"
          value={formData.validityDate}
          onChange={handleChange}
          required
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Additional Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional information..."
          className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors resize-none h-24"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Attachments (Optional)</label>
        <div className="border-2 border-dashed border-[#242830] rounded-lg p-4 text-center hover:border-[#d4a843] transition-colors cursor-pointer">
          <p className="text-gray-400 text-sm">Click to upload files or drag and drop</p>
          <p className="text-gray-500 text-xs mt-1">PDF, images up to 10MB</p>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-white mb-3">Quotation Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Unit Price:</span>
          <span className="text-white">${formData.pricePerUnit || '0'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quantity:</span>
          <span className="text-white">{formData.availableQuantity ? parseInt(formData.availableQuantity).toLocaleString() : '0'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shipping Cost:</span>
          <span className="text-white">${formData.estimatedShippingCost || '0'}</span>
        </div>
        <div className="border-t border-[#242830] pt-2 flex justify-between">
          <span className="text-white font-semibold">Total:</span>
          <span className="text-[#d4a843] font-bold text-lg">
            ${formData.pricePerUnit && formData.availableQuantity && formData.estimatedShippingCost
              ? (parseInt(formData.pricePerUnit) * parseInt(formData.availableQuantity) + parseInt(formData.estimatedShippingCost)).toLocaleString()
              : '0'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 bg-opacity-20 border border-red-600 border-opacity-30 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-4 border-t border-[#242830]">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quotation'}
        </button>
      </div>
    </form>
  );
}
