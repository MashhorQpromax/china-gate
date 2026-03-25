'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const demoProductDetail = {
  id: 'prod-001',
  nameEn: 'Carbon Steel Flat Sheets',
  nameAr: 'ألواح الفولاذ الكربوني المسطحة',
  nameCn: '碳钢平板',
  description: 'High-quality carbon steel flat sheets for industrial applications. Perfect for construction, automotive, and machinery manufacturing.',
  images: [
    { color: '#8B0000', label: 'Main' },
    { color: '#C41E3A', label: 'Angle 1' },
    { color: '#D4A843', label: 'Angle 2' },
  ],
  price: {
    fobMin: 450,
    fobMax: 650,
    currency: 'USD',
    unit: 'per ton',
  },
  moq: 5000,
  leadTime: 35,
  incoterm: 'FOB',
  portOfLoading: 'Shanghai Port',
  capacity: 50000,
  certifications: ['ISO9001', 'ISO14001'],
  hsCode: '7208.40.00',
  samplesAvailable: true,
  availableForPartnership: true,
  availableForLaborLending: false,
  supplier: {
    id: 'company-003',
    nameEn: 'Zhejiang Steel Manufacturing Co., Ltd.',
    nameAr: 'شركة تصنيع الفولاذ تشجيانج',
    rating: 4.8,
    verified: true,
    location: 'Hangzhou, China',
    reviews: 287,
  },
  similarProducts: [
    { id: 'prod-002', name: 'Stainless Steel Coils', rating: 4.9 },
    { id: 'prod-005', name: 'Copper Wire (MM2)', rating: 4.8 },
  ],
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryQuantity, setInquiryQuantity] = useState('10000');

  return (
    <DashboardLayout
      user={{ name: 'Buyer', initials: 'B' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <a href="/marketplace/products" className="text-[#d4a843] hover:underline">Products</a>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{demoProductDetail.nameEn}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-1 space-y-4">
            <div
              className="w-full aspect-square rounded-lg border border-[#242830] flex items-center justify-center bg-gradient-to-br"
              style={{
                background: `linear-gradient(135deg, ${demoProductDetail.images[selectedImage].color}40 0%, ${demoProductDetail.images[selectedImage].color} 100%)`,
              }}
            >
              <span className="text-6xl text-white opacity-50">📦</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {demoProductDetail.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                    selectedImage === idx
                      ? 'border-[#c41e3a]'
                      : 'border-[#242830]'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${img.color}40 0%, ${img.color} 100%)`,
                  }}
                >
                  <span className="text-2xl opacity-50">📦</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-start gap-3 mb-3 flex-wrap">
                {demoProductDetail.availableForPartnership && (
                  <span className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold">
                    Available for Partnership
                  </span>
                )}
                {demoProductDetail.samplesAvailable && (
                  <span className="px-3 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded-full text-xs font-semibold">
                    Samples Available
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{demoProductDetail.nameEn}</h1>
              <p className="text-lg text-gray-400">{demoProductDetail.nameAr}</p>
              <p className="text-sm text-gray-500">{demoProductDetail.nameCn}</p>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{demoProductDetail.description}</p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">FOB Price Range</p>
                <p className="text-lg font-bold text-white">
                  ${demoProductDetail.price.fobMin}-${demoProductDetail.price.fobMax}/{demoProductDetail.price.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">MOQ</p>
                <p className="text-lg font-bold text-white">{demoProductDetail.moq.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lead Time</p>
                <p className="text-lg font-bold text-white">{demoProductDetail.leadTime} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Incoterm</p>
                <p className="text-lg font-bold text-white">{demoProductDetail.incoterm}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <p className="text-gray-500 mb-1">Port of Loading</p>
                <p className="text-white font-semibold">{demoProductDetail.portOfLoading}</p>
              </div>
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <p className="text-gray-500 mb-1">Monthly Capacity</p>
                <p className="text-white font-semibold">{demoProductDetail.capacity.toLocaleString()} units</p>
              </div>
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <p className="text-gray-500 mb-1">HS Code</p>
                <p className="text-white font-semibold">{demoProductDetail.hsCode}</p>
              </div>
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <p className="text-gray-500 mb-1">Certifications</p>
                <p className="text-white font-semibold">{demoProductDetail.certifications.join(', ')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInquiryModal(true)}
                className="flex-1 px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Add to Inquiry
              </button>
              <button className="flex-1 px-6 py-3 border-2 border-[#d4a843] text-[#d4a843] rounded-lg hover:bg-[#d4a843] hover:text-[#0c0f14] transition-colors font-semibold">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* Supplier Card */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{demoProductDetail.supplier.nameEn}</h3>
                {demoProductDetail.supplier.verified && (
                  <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-400 mb-3">{demoProductDetail.supplier.location}</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold text-white">{demoProductDetail.supplier.rating}</span>
                <span className="text-gray-400">({demoProductDetail.supplier.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Contact
              </button>
              <button className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProductDetail.similarProducts.map(product => (
              <div key={product.id} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 hover:border-[#d4a843] transition-colors cursor-pointer">
                <div className="bg-gradient-to-br from-[#8B0000] to-[#C41E3A] rounded-lg h-32 flex items-center justify-center mb-4">
                  <span className="text-4xl opacity-50">📦</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white text-sm">{product.rating}</span>
                  </div>
                  <button className="px-3 py-1 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded text-xs hover:bg-opacity-30 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Add to Inquiry</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Quantity</label>
                <input
                  type="number"
                  value={inquiryQuantity}
                  onChange={(e) => setInquiryQuantity(e.target.value)}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Minimum: {demoProductDetail.moq.toLocaleString()}</p>
              </div>

              <div className="bg-[#0c0f14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unit Price:</span>
                  <span className="text-white">${demoProductDetail.price.fobMin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="text-white">{parseInt(inquiryQuantity || '0').toLocaleString()}</span>
                </div>
                <div className="border-t border-[#242830] pt-2 flex justify-between">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-[#d4a843] font-bold">
                    ${(parseInt(inquiryQuantity || '0') * demoProductDetail.price.fobMin).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowInquiryModal(false)}
                className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInquiryModal(false);
                  setInquiryQuantity('10000');
                }}
                className="flex-1 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Add to Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
