'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QuotationForm from '@/components/marketplace/QuotationForm';
import ComparisonTable from '@/components/marketplace/ComparisonTable';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

interface RFQDetail {
  id: string;
  reference_number: string;
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
  specifications: { key: string; value: string }[];
  required_certifications: string[] | null;
  preferred_incoterm: string | null;
  preferred_payment_terms: string | null;
  preferred_origin: string | null;
  delivery_address: string | null;
  destination_port: string | null;
  required_delivery_date: string | null;
  reference_images: string[] | null;
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
  quotations: {
    id: string;
    reference_number: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    currency: string;
    lead_time: number;
    lead_time_unit: string;
    incoterm: string;
    payment_terms: string;
    estimated_shipping_cost: number;
    valid_until: string;
    status: string;
    notes: string;
    created_at: string;
    profiles: { full_name_en: string; company_name: string; country: string; city: string } | null;
  }[];
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const [rfq, setRfq] = useState<RFQDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('access_token='));
  }, []);

  useEffect(() => {
    fetch(`/api/rfq/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.rfq) {
          setRfq(data.rfq);
        } else {
          setError('Request not found');
        }
      })
      .catch(() => setError('Failed to load request'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }} isAuthenticated={isLoggedIn}>
        <div className="space-y-8 animate-pulse">
          <div className="h-6 bg-[#242830] rounded w-48" />
          <div className="h-10 bg-[#242830] rounded w-3/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#1a1d23] border border-[#242830] rounded-lg" />
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-[#1a1d23] border border-[#242830] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !rfq) {
    return (
      <DashboardLayout user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }} isAuthenticated={isLoggedIn}>
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">{error || 'Request not found'}</p>
          <Link href="/marketplace/requests" className="text-[#d4a843] hover:underline">
            Back to Requests
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(rfq.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  const statusLabel = (s: string) => {
    switch (s) {
      case 'open': return 'Open';
      case 'receiving_quotes': return 'Receiving Quotes';
      case 'evaluating': return 'Evaluating';
      case 'awarded': return 'Awarded';
      case 'closed': return 'Closed';
      default: return s;
    }
  };

  // Map quotations to ComparisonTable format
  const comparisonQuotations = rfq.quotations.map(q => ({
    id: q.id,
    supplier: q.profiles?.company_name || q.profiles?.full_name_en || 'Unknown',
    supplierRating: 0,
    pricePerUnit: q.unit_price,
    quantity: q.quantity,
    leadTime: q.lead_time || 0,
    incoterm: q.incoterm || 'FOB',
    paymentTerms: q.payment_terms || 'N/A',
    shippingCost: q.estimated_shipping_cost || 0,
    estimatedTotal: q.total_price,
    validity: new Date(q.valid_until),
    certifications: [] as string[],
  }));

  return (
    <DashboardLayout
      user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }}
      isAuthenticated={isLoggedIn}
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/marketplace/requests" className="text-[#d4a843] hover:underline">
            Requests
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{rfq.title}</span>
        </nav>

        {/* Header with Status */}
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{rfq.title}</h1>
            <p className="text-gray-400 mb-3">{rfq.categories?.name_en || 'General'}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm font-semibold">
                {statusLabel(rfq.status)}
              </span>
              {rfq.reference_number && (
                <span className="text-sm text-gray-500">
                  Ref: {rfq.reference_number}
                </span>
              )}
              <span className="text-sm text-gray-400">
                Posted {new Date(rfq.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {['open', 'receiving_quotes'].includes(rfq.status) && (
            <button
              onClick={() => isLoggedIn ? setShowQuotationForm(true) : router.push(`/login?redirect=/marketplace/requests/${rfq.id}`)}
              className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold whitespace-nowrap"
            >
              {isLoggedIn ? 'Submit Quotation' : 'Login to Quote'}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {rfq.description || `Looking for ${rfq.product_name}`}
              </p>
            </div>

            {/* Specifications */}
            {((rfq.specifications && rfq.specifications.length > 0) || rfq.required_certifications) && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">Specifications</h2>
                {rfq.specifications && rfq.specifications.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {rfq.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.key}:</span>
                        <span className="text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {rfq.required_certifications && rfq.required_certifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Required Certifications</h3>
                    <div className="flex gap-2 flex-wrap">
                      {rfq.required_certifications.map(cert => (
                        <span key={cert} className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trading Terms */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Trading Terms</h2>
              <div className="grid grid-cols-2 gap-4">
                {rfq.preferred_incoterm && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Incoterm</p>
                    <p className="text-white font-semibold">{rfq.preferred_incoterm}</p>
                  </div>
                )}
                {rfq.preferred_origin && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Preferred Origin</p>
                    <p className="text-white font-semibold">{rfq.preferred_origin}</p>
                  </div>
                )}
                {rfq.destination_port && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Destination Port</p>
                    <p className="text-white font-semibold">{rfq.destination_port}</p>
                  </div>
                )}
                {rfq.preferred_payment_terms && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Payment Terms</p>
                    <p className="text-white font-semibold">{rfq.preferred_payment_terms}</p>
                  </div>
                )}
                {rfq.max_budget && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Budget</p>
                    <p className="text-[#d4a843] font-bold">${rfq.max_budget.toLocaleString()} {rfq.currency}</p>
                  </div>
                )}
                {rfq.required_delivery_date && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Required By</p>
                    <p className="text-white font-semibold">{new Date(rfq.required_delivery_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quotations Received */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Received Quotations ({rfq.quotations.length})
              </h2>
              <ComparisonTable quotations={comparisonQuotations} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Details */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Key Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Product</p>
                  <p className="text-white font-semibold">{rfq.product_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Quantity</p>
                  <p className="text-white font-semibold">
                    {rfq.quantity?.toLocaleString()} {rfq.unit_of_measure || 'units'}
                  </p>
                </div>
                {rfq.target_price && (
                  <div>
                    <p className="text-gray-500 mb-1">Target Price</p>
                    <p className="text-white font-semibold">${rfq.target_price.toLocaleString()} {rfq.currency}</p>
                  </div>
                )}
                {rfq.max_budget && (
                  <div>
                    <p className="text-gray-500 mb-1">Max Budget</p>
                    <p className="text-white font-semibold">${rfq.max_budget.toLocaleString()} {rfq.currency}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 mb-1">Expires</p>
                  <p className="text-white font-semibold">{new Date(rfq.expires_at).toLocaleDateString()}</p>
                </div>
                <div className="pt-3 border-t border-[#242830]">
                  <p className="text-gray-500 mb-1">Days Remaining</p>
                  <p className={`font-bold text-lg ${daysRemaining <= 7 ? 'text-red-400' : 'text-[#c41e3a]'}`}>
                    {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            {rfq.profiles && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Buyer Information</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold">
                      {rfq.profiles.company_name || rfq.profiles.full_name_en}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {[rfq.profiles.city, rfq.profiles.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            )}

            {/* Action Button */}
            {['open', 'receiving_quotes'].includes(rfq.status) && (
              <button
                onClick={() => isLoggedIn ? setShowQuotationForm(true) : router.push(`/login?redirect=/marketplace/requests/${rfq.id}`)}
                className="w-full px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {isLoggedIn ? 'Submit Quotation' : 'Login to Quote'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quotation Form Modal */}
      {showQuotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Submit Quotation</h2>
              <button
                onClick={() => setShowQuotationForm(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <QuotationForm
              requestId={rfq.id}
              onClose={() => setShowQuotationForm(false)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
