'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RfqDetailPageProps {
  params: { id: string };
}

interface RFQDetail {
  id: string;
  title: string;
  description: string;
  product_name: string;
  quantity: number;
  unit_of_measure: string;
  target_price: number | null;
  max_budget: number | null;
  currency: string;
  status: string;
  quotation_count: number;
  expires_at: string;
  created_at: string;
  required_delivery_date: string | null;
  delivery_address: string | null;
  preferred_incoterm: string | null;
  payment_terms: string | null;
  quality_requirements: string | null;
  certifications_required: string[] | null;
  sample_required: boolean;
  attachments: string[] | null;
  categories: { name_en: string; name_ar: string; slug: string } | null;
  profiles: {
    full_name_en: string;
    full_name_ar: string;
    company_name: string;
    country: string;
    city: string;
    avatar_url: string;
    phone: string;
    email: string;
  } | null;
  quotations: Quotation[];
}

interface Quotation {
  id: string;
  reference_number: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  currency: string;
  status: string;
  lead_time: number | null;
  lead_time_unit: string | null;
  notes: string | null;
  created_at: string;
  profiles: { full_name_en: string; company_name: string; country: string; city: string } | null;
}

export default function SupplierRfqDetailPage({ params }: RfqDetailPageProps) {
  const router = useRouter();
  const [rfq, setRfq] = useState<RFQDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Quote form fields
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [leadTimeUnit, setLeadTimeUnit] = useState('days');
  const [incoterm, setIncoterm] = useState('FOB');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [portOfLoading, setPortOfLoading] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [validDays, setValidDays] = useState('30');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/rfq/${params.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.rfq) {
          setRfq(data.rfq);
          // Pre-populate quantity from RFQ
          if (data.rfq.quantity) setQuantity(data.rfq.quantity.toString());
        } else {
          setError('RFQ not found');
        }
      })
      .catch(() => setError('Failed to load RFQ'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const totalPrice = (parseFloat(unitPrice) || 0) * (parseInt(quantity) || 0);

  const handleSubmitQuote = async () => {
    setSubmitError('');
    if (!unitPrice || !quantity || !validDays) {
      setSubmitError('Please fill in unit price, quantity, and validity');
      return;
    }

    setSubmitting(true);
    try {
      // Get supplier ID from auth
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const meData = await meRes.json();
      const supplierId = meData.user?.id || meData.data?.id;

      if (!supplierId) {
        setSubmitError('Authentication required');
        setSubmitting(false);
        return;
      }

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(validDays));

      const res = await fetch(`/api/rfq/${params.id}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          supplierId,
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity),
          totalPrice,
          currency: rfq?.currency || 'USD',
          incoterm: incoterm || null,
          paymentTerms: paymentTerms || null,
          leadTime: leadTime ? parseInt(leadTime) : null,
          leadTimeUnit,
          validUntil: validUntil.toISOString(),
          portOfLoading: portOfLoading || null,
          estimatedShippingCost: shippingCost ? parseFloat(shippingCost) : null,
          notes: notes || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setShowQuoteForm(false);
        // Refresh RFQ data
        const refreshRes = await fetch(`/api/rfq/${params.id}`, { credentials: 'include' });
        const refreshData = await refreshRes.json();
        if (refreshData.rfq) setRfq(refreshData.rfq);
      } else {
        setSubmitError(data.error || 'Failed to submit quotation');
      }
    } catch {
      setSubmitError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={{ name: 'Supplier', initials: 'SP' }} isAuthenticated={true} userRole="seller">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-[#242830] rounded w-64" />
          <div className="h-48 bg-[#1a1d23] border border-[#242830] rounded-lg" />
          <div className="h-32 bg-[#1a1d23] border border-[#242830] rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !rfq) {
    return (
      <DashboardLayout user={{ name: 'Supplier', initials: 'SP' }} isAuthenticated={true} userRole="seller">
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">{error || 'RFQ not found'}</p>
          <Link href="/dashboard/supplier/rfqs" className="text-[#d4a843] hover:underline">
            Back to RFQs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isOpen = ['open', 'receiving_quotes'].includes(rfq.status);
  const isExpired = rfq.expires_at ? new Date(rfq.expires_at) < new Date() : false;
  const canQuote = isOpen && !isExpired;

  return (
    <DashboardLayout user={{ name: 'Supplier', initials: 'SP' }} isAuthenticated={true} userRole="seller">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/dashboard/supplier/rfqs" className="text-[#d4a843] hover:underline">
            Incoming RFQs
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{rfq.title || rfq.product_name}</span>
        </nav>

        {/* Success Banner */}
        {submitSuccess && (
          <div className="bg-green-600/20 border border-green-600/40 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-400 font-semibold">
              Quotation submitted successfully!
            </p>
            <button onClick={() => setSubmitSuccess(false)} className="text-green-400 hover:text-green-300">
              ✕
            </button>
          </div>
        )}

        {/* RFQ Header */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">
                  {rfq.title || rfq.product_name}
                </h1>
                <span className={`text-xs px-2 py-1 rounded ${
                  isOpen ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {rfq.status.replace(/_/g, ' ')}
                </span>
                {isExpired && (
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                    Expired
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                Posted {new Date(rfq.created_at).toLocaleDateString()}
                {rfq.expires_at && ` | Expires ${new Date(rfq.expires_at).toLocaleDateString()}`}
              </p>
            </div>
            {canQuote && !showQuoteForm && (
              <button
                onClick={() => setShowQuoteForm(true)}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Submit Quotation
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: RFQ Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {rfq.description && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{rfq.description}</p>
              </div>
            )}

            {/* Requirements Grid */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0c0f14] rounded-lg p-4">
                  <p className="text-gray-500 text-xs mb-1">Product</p>
                  <p className="text-white font-semibold">{rfq.product_name || rfq.title}</p>
                </div>
                <div className="bg-[#0c0f14] rounded-lg p-4">
                  <p className="text-gray-500 text-xs mb-1">Quantity</p>
                  <p className="text-white font-semibold">
                    {rfq.quantity?.toLocaleString()} {rfq.unit_of_measure || 'units'}
                  </p>
                </div>
                {rfq.target_price && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Target Price</p>
                    <p className="text-[#d4a843] font-semibold">
                      ${rfq.target_price.toLocaleString()} {rfq.currency}
                    </p>
                  </div>
                )}
                {rfq.max_budget && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Max Budget</p>
                    <p className="text-[#d4a843] font-semibold">
                      ${rfq.max_budget.toLocaleString()} {rfq.currency}
                    </p>
                  </div>
                )}
                {rfq.required_delivery_date && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Delivery Date</p>
                    <p className="text-white font-semibold">
                      {new Date(rfq.required_delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {rfq.preferred_incoterm && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Incoterm</p>
                    <p className="text-white font-semibold">{rfq.preferred_incoterm}</p>
                  </div>
                )}
                {rfq.payment_terms && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Payment Terms</p>
                    <p className="text-white font-semibold">{rfq.payment_terms}</p>
                  </div>
                )}
                {rfq.categories && (
                  <div className="bg-[#0c0f14] rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Category</p>
                    <p className="text-white font-semibold">{rfq.categories.name_en}</p>
                  </div>
                )}
              </div>

              {rfq.quality_requirements && (
                <div className="mt-4 bg-[#0c0f14] rounded-lg p-4">
                  <p className="text-gray-500 text-xs mb-1">Quality Requirements</p>
                  <p className="text-white text-sm">{rfq.quality_requirements}</p>
                </div>
              )}

              {rfq.certifications_required && rfq.certifications_required.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 text-xs mb-2">Required Certifications</p>
                  <div className="flex gap-2 flex-wrap">
                    {rfq.certifications_required.map(cert => (
                      <span key={cert} className="px-3 py-1 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rfq.sample_required && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-sm font-semibold">
                    Sample Required
                  </span>
                </div>
              )}
            </div>

            {/* Quotation Form */}
            {showQuoteForm && (
              <div className="bg-[#1a1d23] border-2 border-[#c41e3a] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Submit Your Quotation</h2>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-600/20 border border-red-600/40 rounded-lg text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unit Price */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Unit Price ({rfq.currency}) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>

                  {/* Total (calculated) */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Total Price
                    </label>
                    <div className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-[#d4a843] font-bold">
                      ${totalPrice.toLocaleString()} {rfq.currency}
                    </div>
                  </div>

                  {/* Lead Time */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Lead Time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="15"
                        className="flex-1 bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                      />
                      <select
                        value={leadTimeUnit}
                        onChange={(e) => setLeadTimeUnit(e.target.value)}
                        className="bg-[#0c0f14] border border-[#242830] rounded-lg px-3 py-2 text-white focus:border-[#c41e3a] outline-none"
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>

                  {/* Incoterm */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Incoterm
                    </label>
                    <select
                      value={incoterm}
                      onChange={(e) => setIncoterm(e.target.value)}
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    >
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="CFR">CFR</option>
                      <option value="EXW">EXW</option>
                      <option value="DDP">DDP</option>
                      <option value="DAP">DAP</option>
                    </select>
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      placeholder="30% deposit, 70% before shipment"
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>

                  {/* Port of Loading */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Port of Loading
                    </label>
                    <input
                      type="text"
                      value={portOfLoading}
                      onChange={(e) => setPortOfLoading(e.target.value)}
                      placeholder="Shanghai, Shenzhen, Ningbo..."
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>

                  {/* Shipping Cost */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Estimated Shipping Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>

                  {/* Valid For */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-1">
                      Quote Valid For (days) *
                    </label>
                    <input
                      type="number"
                      value={validDays}
                      onChange={(e) => setValidDays(e.target.value)}
                      className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any additional details, terms, or conditions..."
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    className="px-6 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuote}
                    disabled={submitting}
                    className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Quotation'}
                  </button>
                </div>
              </div>
            )}

            {/* Existing Quotations */}
            {rfq.quotations && rfq.quotations.length > 0 && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Quotations ({rfq.quotations.length})
                </h2>
                <div className="space-y-3">
                  {rfq.quotations.map(q => (
                    <div key={q.id} className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {q.profiles?.company_name || q.profiles?.full_name_en || 'Supplier'}
                          </p>
                          {q.profiles?.country && (
                            <p className="text-gray-500 text-xs">{q.profiles.country}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          q.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                          q.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                          q.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="flex gap-6 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Unit: </span>
                          <span className="text-[#d4a843] font-semibold">${q.unit_price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Qty: </span>
                          <span className="text-white">{q.quantity?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total: </span>
                          <span className="text-[#d4a843] font-bold">${q.total_price?.toLocaleString()}</span>
                        </div>
                        {q.lead_time && (
                          <div>
                            <span className="text-gray-500">Lead: </span>
                            <span className="text-white">{q.lead_time} {q.lead_time_unit}</span>
                          </div>
                        )}
                      </div>
                      {q.notes && (
                        <p className="text-gray-400 text-xs mt-2">{q.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Buyer Info */}
          <div className="space-y-6">
            {rfq.profiles && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Buyer</h2>
                <div className="space-y-3">
                  <p className="text-white font-semibold">
                    {rfq.profiles.company_name || rfq.profiles.full_name_en}
                  </p>
                  {rfq.profiles.full_name_en && rfq.profiles.company_name && (
                    <p className="text-gray-400 text-sm">{rfq.profiles.full_name_en}</p>
                  )}
                  <div className="text-sm text-gray-400">
                    {[rfq.profiles.city, rfq.profiles.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">RFQ Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Quotes Received</span>
                  <span className="text-white font-semibold">{rfq.quotation_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted</span>
                  <span className="text-white">{new Date(rfq.created_at).toLocaleDateString()}</span>
                </div>
                {rfq.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires</span>
                    <span className={isExpired ? 'text-red-400' : 'text-white'}>
                      {new Date(rfq.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
