'use client';

import React, { useState } from 'react';

interface Quotation {
  id: string;
  supplier: string;
  supplierRating: number;
  pricePerUnit: number;
  quantity: number;
  leadTime: number;
  incoterm: string;
  paymentTerms: string;
  shippingCost: number;
  estimatedTotal: number;
  validity: Date;
  certifications: string[];
}

interface ComparisonTableProps {
  quotations: Quotation[];
}

export default function ComparisonTable({ quotations }: ComparisonTableProps) {
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);

  if (quotations.length === 0) {
    return (
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
        <p className="text-gray-400">No quotations received yet.</p>
      </div>
    );
  }

  // Find best values
  const bestPrice = Math.min(...quotations.map(q => q.pricePerUnit));
  const bestLeadTime = Math.min(...quotations.map(q => q.leadTime));
  const lowestTotal = Math.min(...quotations.map(q => q.estimatedTotal));

  const isExpired = (date: Date) => date < new Date();
  const daysUntilExpiry = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0c0f14] border-b border-[#242830]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Price/Unit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Lead Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Incoterm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Shipping</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Validity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242830]">
              {quotations.map(quote => (
                <tr key={quote.id} className="hover:bg-[#242830] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{quote.supplier}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-gray-400 text-xs">{quote.supplierRating}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-semibold ${quote.pricePerUnit === bestPrice ? 'text-green-400 bg-green-600 bg-opacity-10 px-2 py-1 rounded' : 'text-white'}`}>
                      ${quote.pricePerUnit}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{quote.quantity.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-semibold ${quote.leadTime === bestLeadTime ? 'text-green-400 bg-green-600 bg-opacity-10 px-2 py-1 rounded' : 'text-white'}`}>
                      {quote.leadTime} days
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{quote.incoterm}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-300 text-sm">{quote.paymentTerms}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">${quote.shippingCost.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-bold ${quote.estimatedTotal === lowestTotal ? 'text-green-400 bg-green-600 bg-opacity-10 px-2 py-1 rounded' : 'text-[#d4a843]'}`}>
                      ${quote.estimatedTotal.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-xs font-semibold ${isExpired(quote.validity) ? 'text-red-400' : 'text-gray-400'}`}>
                      {isExpired(quote.validity) ? 'Expired' : `${daysUntilExpiry(quote.validity)}d left`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!isExpired(quote.validity) && (
                        <>
                          <button className="px-3 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded text-xs hover:bg-opacity-30 transition-colors">
                            Accept
                          </button>
                          <button className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded text-xs hover:bg-opacity-30 transition-colors">
                            Negotiate
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 bg-red-600 bg-opacity-20 text-red-400 rounded text-xs hover:bg-opacity-30 transition-colors">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {quotations.map(quote => (
          <div key={quote.id} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-semibold">{quote.supplier}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-400 text-sm">{quote.supplierRating}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${isExpired(quote.validity) ? 'bg-red-600 bg-opacity-20 text-red-400' : 'bg-green-600 bg-opacity-20 text-green-400'}`}>
                {isExpired(quote.validity) ? 'Expired' : `${daysUntilExpiry(quote.validity)}d`}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`${quote.pricePerUnit === bestPrice ? 'bg-green-600 bg-opacity-10 border border-green-600 border-opacity-30' : ''} p-2 rounded`}>
                <p className="text-gray-400 text-xs">Price/Unit</p>
                <p className={`font-bold ${quote.pricePerUnit === bestPrice ? 'text-green-400' : 'text-white'}`}>
                  ${quote.pricePerUnit}
                </p>
              </div>
              <div className={`${quote.leadTime === bestLeadTime ? 'bg-green-600 bg-opacity-10 border border-green-600 border-opacity-30' : ''} p-2 rounded`}>
                <p className="text-gray-400 text-xs">Lead Time</p>
                <p className={`font-bold ${quote.leadTime === bestLeadTime ? 'text-green-400' : 'text-white'}`}>
                  {quote.leadTime}d
                </p>
              </div>
              <div className="p-2 rounded">
                <p className="text-gray-400 text-xs">Shipping</p>
                <p className="text-white font-bold">${quote.shippingCost.toLocaleString()}</p>
              </div>
              <div className={`${quote.estimatedTotal === lowestTotal ? 'bg-green-600 bg-opacity-10 border border-green-600 border-opacity-30' : ''} p-2 rounded`}>
                <p className="text-gray-400 text-xs">Total</p>
                <p className={`font-bold ${quote.estimatedTotal === lowestTotal ? 'text-green-400' : 'text-[#d4a843]'}`}>
                  ${quote.estimatedTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* More Details */}
            <div className="border-t border-[#242830] pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Incoterm:</span>
                <span className="text-white">{quote.incoterm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment:</span>
                <span className="text-white">{quote.paymentTerms}</span>
              </div>
              {quote.certifications.length > 0 && (
                <div>
                  <p className="text-gray-400 mb-1">Certifications:</p>
                  <div className="flex gap-1 flex-wrap">
                    {quote.certifications.map(cert => (
                      <span key={cert} className="px-2 py-0.5 bg-[#0c0f14] text-gray-400 rounded text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[#242830]">
              {!isExpired(quote.validity) && (
                <>
                  <button className="flex-1 px-3 py-2 bg-green-600 bg-opacity-20 text-green-400 rounded text-sm hover:bg-opacity-30 transition-colors font-semibold">
                    Accept
                  </button>
                  <button className="flex-1 px-3 py-2 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded text-sm hover:bg-opacity-30 transition-colors font-semibold">
                    Negotiate
                  </button>
                </>
              )}
              <button className="flex-1 px-3 py-2 bg-red-600 bg-opacity-20 text-red-400 rounded text-sm hover:bg-opacity-30 transition-colors font-semibold">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
