'use client';

import React, { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

function NewRfqForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('pieces');
  const [targetPrice, setTargetPrice] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('');
  const [preferredIncoterm, setPreferredIncoterm] = useState('FOB');
  const [preferredPaymentTerms, setPreferredPaymentTerms] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [certifications, setCertifications] = useState('');

  // Pre-populate from product page query params
  useEffect(() => {
    const prodName = searchParams.get('product');
    const prodCategory = searchParams.get('category');
    if (prodName) setProductName(prodName);
    if (prodCategory) setCategoryId(prodCategory);
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        else if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!title || !productName || !quantity) {
      setError('Please fill in title, product name, and quantity');
      return;
    }

    setSubmitting(true);
    try {
      // Get buyer ID
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const meData = await meRes.json();
      const buyerId = meData.user?.id || meData.data?.id;

      if (!buyerId) {
        setError('Please login to create a purchase request');
        setSubmitting(false);
        return;
      }

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          buyerId,
          title,
          productName,
          categoryId: categoryId || null,
          description: description || null,
          quantity: parseInt(quantity),
          unitOfMeasure,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          maxBudget: maxBudget ? parseFloat(maxBudget) : null,
          currency,
          requiredDeliveryDate: requiredDeliveryDate || null,
          preferredIncoterm: preferredIncoterm || null,
          preferredPaymentTerms: preferredPaymentTerms || null,
          destinationPort: destinationPort || null,
          requiredCertifications: certifications
            ? certifications.split(',').map(c => c.trim()).filter(Boolean)
            : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.rfq) {
        router.push(`/marketplace/requests/${data.rfq.id}`);
      } else {
        setError(data.error || 'Failed to create request');
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/marketplace/requests" className="text-[#d4a843] hover:underline">
          Purchase Requests
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-400">New Request</span>
      </nav>

      <h1 className="text-3xl font-bold text-white">Create Purchase Request</h1>
      <p className="text-gray-400">
        Describe what you need and receive quotations from verified suppliers
      </p>

      {error && (
        <div className="p-4 bg-red-600/20 border border-red-600/40 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Product Details</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Request Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title for your request"
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Specific product or material name"
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name_en}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe specifications, quality requirements, packaging needs..."
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none resize-none"
          />
        </div>

        {/* Quantity and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Quantity *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1000"
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Unit
            </label>
            <select
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            >
              <option value="pieces">Pieces</option>
              <option value="sets">Sets</option>
              <option value="kg">KG</option>
              <option value="tons">Tons</option>
              <option value="meters">Meters</option>
              <option value="cartons">Cartons</option>
              <option value="containers">Containers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Budget & Delivery</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Target Price (per unit)
            </label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Max Budget (total)
            </label>
            <input
              type="number"
              step="0.01"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            >
              <option value="USD">USD</option>
              <option value="SAR">SAR</option>
              <option value="AED">AED</option>
              <option value="KWD">KWD</option>
              <option value="BHD">BHD</option>
              <option value="QAR">QAR</option>
              <option value="OMR">OMR</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Required Delivery Date
            </label>
            <input
              type="date"
              value={requiredDeliveryDate}
              onChange={(e) => setRequiredDeliveryDate(e.target.value)}
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trade Terms */}
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Trade Terms</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Preferred Incoterm
            </label>
            <select
              value={preferredIncoterm}
              onChange={(e) => setPreferredIncoterm(e.target.value)}
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
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Destination Port
            </label>
            <input
              type="text"
              value={destinationPort}
              onChange={(e) => setDestinationPort(e.target.value)}
              placeholder="Jeddah, Dubai, Dammam..."
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Payment Terms
          </label>
          <input
            type="text"
            value={preferredPaymentTerms}
            onChange={(e) => setPreferredPaymentTerms(e.target.value)}
            placeholder="L/C at sight, T/T 30% deposit..."
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Required Certifications
          </label>
          <input
            type="text"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            placeholder="ISO 9001, CE, FDA (comma separated)"
            className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
          />
          <p className="text-gray-500 text-xs mt-1">Separate multiple certifications with commas</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link
          href="/marketplace/requests"
          className="px-6 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Post Request'}
        </button>
      </div>
    </div>
  );
}

export default function NewRfqPage() {
  return (
    <DashboardLayout
      user={{ name: 'Buyer', initials: 'B' }}
      isAuthenticated={true}
    >
      <Suspense fallback={
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 bg-[#242830] rounded w-48 animate-pulse" />
          <div className="h-12 bg-[#242830] rounded w-96 animate-pulse" />
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-[#242830] rounded animate-pulse" />
            ))}
          </div>
        </div>
      }>
        <NewRfqForm />
      </Suspense>
    </DashboardLayout>
  );
}
