'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import QuotationForm from '@/components/marketplace/QuotationForm';
import ComparisonTable from '@/components/marketplace/ComparisonTable';

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

const demoRequestDetail = {
  id: 'req-001',
  title: 'Carbon Steel Sheets - Large Volume',
  description: 'Need 50,000 tons of carbon steel flat sheets for construction projects across multiple regions.',
  category: 'Steel & Metals',
  quantity: 50000,
  quantityUnit: 'tons',
  budget: 25000000,
  currency: 'USD',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  incoterm: 'FOB',
  preferredShipper: 'Shanghai Port',
  destinationPort: 'Jeddah Port',
  specifications: 'Grade: Q235, Thickness: 3-6mm, Surface: Black or Pickled',
  certifications: ['ISO9001', 'ISO14001'],
  referenceImages: [
    { id: 1, url: '#', label: 'Reference Image 1' },
    { id: 2, url: '#', label: 'Reference Image 2' },
  ],
  status: 'Receiving Quotes',
  buyer: {
    id: 'company-001',
    nameEn: 'Al-Rajhi Trading Company',
    nameAr: 'شركة الراجحي للتجارة',
    country: 'Saudi Arabia',
    rating: 4.8,
    verified: true,
  },
  quotations: [
    {
      id: 'quote-001',
      supplier: 'Zhejiang Steel Manufacturing',
      supplierRating: 4.8,
      pricePerUnit: 500,
      quantity: 50000,
      leadTime: 35,
      incoterm: 'FOB',
      paymentTerms: 'LC at Sight',
      shippingCost: 750000,
      estimatedTotal: 25750000,
      validity: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      certifications: ['ISO9001', 'ISO14001'],
    },
    {
      id: 'quote-002',
      supplier: 'Shanghai Steel Group',
      supplierRating: 4.6,
      pricePerUnit: 480,
      quantity: 50000,
      leadTime: 40,
      incoterm: 'CIF',
      paymentTerms: '30% Advance',
      shippingCost: 1000000,
      estimatedTotal: 25400000,
      validity: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      certifications: ['ISO9001'],
    },
    {
      id: 'quote-003',
      supplier: 'Jiangsu Industrial Steel',
      supplierRating: 4.4,
      pricePerUnit: 450,
      quantity: 50000,
      leadTime: 45,
      incoterm: 'FOB',
      paymentTerms: 'Net 30',
      shippingCost: 800000,
      estimatedTotal: 23300000,
      validity: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      certifications: ['ISO9001'],
    },
  ],
};

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  return (
    <DashboardLayout
      user={{ name: 'Supplier', initials: 'S' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <a href="/marketplace/requests" className="text-[#d4a843] hover:underline">Requests</a>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{demoRequestDetail.title}</span>
        </nav>

        {/* Header with Status */}
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{demoRequestDetail.title}</h1>
            <p className="text-gray-400 mb-3">{demoRequestDetail.category}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm font-semibold">
                Receiving Quotes
              </span>
              <span className="text-sm text-gray-400">
                Posted 2 days ago
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowQuotationForm(true)}
            className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold whitespace-nowrap"
          >
            Submit Quotation
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">{demoRequestDetail.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Specifications</h2>
              <p className="text-gray-300 mb-4">{demoRequestDetail.specifications}</p>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Required Certifications</h3>
                <div className="flex gap-2 flex-wrap">
                  {demoRequestDetail.certifications.map(cert => (
                    <span key={cert} className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Terms */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Trading Terms</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Incoterm</p>
                  <p className="text-white font-semibold">{demoRequestDetail.incoterm}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Port of Loading</p>
                  <p className="text-white font-semibold">{demoRequestDetail.preferredShipper}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Destination Port</p>
                  <p className="text-white font-semibold">{demoRequestDetail.destinationPort}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Budget</p>
                  <p className="text-[#d4a843] font-bold">${demoRequestDetail.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Quotations Received */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Received Quotations ({demoRequestDetail.quotations.length})</h2>
              <ComparisonTable quotations={demoRequestDetail.quotations} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Details */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Key Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Quantity</p>
                  <p className="text-white font-semibold">{demoRequestDetail.quantity.toLocaleString()} {demoRequestDetail.quantityUnit}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Budget</p>
                  <p className="text-white font-semibold">${demoRequestDetail.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Deadline</p>
                  <p className="text-white font-semibold">{demoRequestDetail.deadline.toLocaleDateString()}</p>
                </div>
                <div className="pt-3 border-t border-[#242830]">
                  <p className="text-gray-500 mb-1">Days Remaining</p>
                  <p className="text-[#c41e3a] font-bold text-lg">
                    {Math.ceil((demoRequestDetail.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Buyer Information</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold">{demoRequestDetail.buyer.nameEn}</h4>
                  <p className="text-gray-400 text-sm">{demoRequestDetail.buyer.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white font-semibold">{demoRequestDetail.buyer.rating}</span>
                  <span className="text-gray-400 text-sm">Verified Buyer</span>
                </div>
                <button className="w-full px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors text-sm">
                  View Profile
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowQuotationForm(true)}
              className="w-full px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Submit Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Quotation Form Modal */}
      {showQuotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
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
              requestId={demoRequestDetail.id}
              onClose={() => setShowQuotationForm(false)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
