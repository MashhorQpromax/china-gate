'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
}

interface PricingTier {
  min_quantity: number;
  max_quantity: number | null;
  price: number;
}

interface Variant {
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
}

interface Specification {
  key: string;
  value: string;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '📝' },
  { id: 2, title: 'Pricing & Stock', icon: '💰' },
  { id: 3, title: 'Details & Specs', icon: '📋' },
  { id: 4, title: 'Trade & Shipping', icon: '🚢' },
  { id: 5, title: 'Review & Submit', icon: '✅' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Step 1: Basic Info
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [fullDescEn, setFullDescEn] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [brandName, setBrandName] = useState('');

  // Step 2: Pricing & Stock
  const [basePrice, setBasePrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [priceType, setPriceType] = useState('fixed');
  const [moq, setMoq] = useState('');
  const [moqUnit, setMoqUnit] = useState('pieces');
  const [stockQuantity, setStockQuantity] = useState('');
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Step 3: Details & Specs
  const [specifications, setSpecifications] = useState<Specification[]>([{ key: '', value: '' }]);
  const [certifications, setCertifications] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [originCountry, setOriginCountry] = useState('China');
  const [sampleAvailable, setSampleAvailable] = useState(false);
  const [samplePrice, setSamplePrice] = useState('');
  const [customizationAvailable, setCustomizationAvailable] = useState(false);
  const [customizationDetails, setCustomizationDetails] = useState('');

  // Step 4: Trade & Shipping
  const [leadTimeMin, setLeadTimeMin] = useState('');
  const [leadTimeMax, setLeadTimeMax] = useState('');
  const [leadTimeUnit, setLeadTimeUnit] = useState('days');
  const [portOfLoading, setPortOfLoading] = useState('');
  const [productionCapacity, setProductionCapacity] = useState('');
  const [productionCapacityUnit, setProductionCapacityUnit] = useState('pieces');
  const [packagingDetail, setPackagingDetail] = useState('');
  const [paymentTerms, setPaymentTerms] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        else if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const addPricingTier = () => {
    setPricingTiers([...pricingTiers, { min_quantity: 0, max_quantity: null, price: 0 }]);
  };

  const updatePricingTier = (index: number, field: keyof PricingTier, value: number | null) => {
    const updated = [...pricingTiers];
    (updated[index] as Record<string, unknown>)[field] = value;
    setPricingTiers(updated);
  };

  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { variant_name: '', variant_value: '', price_adjustment: 0, stock_quantity: 0 }]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants];
    (updated[index] as Record<string, unknown>)[field] = value;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const togglePaymentTerm = (term: string) => {
    if (paymentTerms.includes(term)) {
      setPaymentTerms(paymentTerms.filter(t => t !== term));
    } else {
      setPaymentTerms([...paymentTerms, term]);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!nameEn.trim()) { setError('Product name (English) is required'); return false; }
        if (!categoryId) { setError('Please select a category'); return false; }
        break;
      case 2:
        if (!basePrice || parseFloat(basePrice) <= 0) { setError('Base price must be greater than 0'); return false; }
        if (!moq || parseInt(moq) <= 0) { setError('Minimum order quantity is required'); return false; }
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setSubmitting(true);
    setError('');

    // Build specifications as array of objects
    const specsArray = specifications
      .filter(s => s.key.trim() && s.value.trim())
      .map(s => ({ [s.key]: s.value }));

    // Build certifications array
    const certsArray = certifications
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim() || undefined,
      categoryId: categoryId || undefined,
      shortDescriptionEn: shortDescEn.trim() || undefined,
      shortDescriptionAr: shortDescAr.trim() || undefined,
      fullDescriptionEn: fullDescEn.trim() || undefined,
      mainImageUrl: mainImageUrl.trim() || undefined,
      brandName: brandName.trim() || undefined,
      basePrice: parseFloat(basePrice) || 0,
      currency,
      priceType,
      moq: parseInt(moq) || 1,
      moqUnit,
      stockQuantity: parseInt(stockQuantity) || 0,
      specifications: specsArray.length > 0 ? specsArray : undefined,
      certifications: certsArray.length > 0 ? certsArray : undefined,
      hsCode: hsCode.trim() || undefined,
      originCountry: originCountry.trim() || 'China',
      sampleAvailable,
      samplePrice: samplePrice ? parseFloat(samplePrice) : undefined,
      customizationAvailable,
      customizationDetails: customizationDetails.trim() || undefined,
      leadTimeMin: parseInt(leadTimeMin) || undefined,
      leadTimeMax: parseInt(leadTimeMax) || undefined,
      leadTimeUnit: leadTimeUnit || 'days',
      portOfLoading: portOfLoading.trim() || undefined,
      productionCapacity: parseInt(productionCapacity) || undefined,
      productionCapacityUnit: productionCapacityUnit || undefined,
      packagingDetail: packagingDetail.trim() || undefined,
      paymentTerms: paymentTerms.length > 0 ? paymentTerms : undefined,
      pricingTiers: pricingTiers.length > 0 ? pricingTiers : undefined,
      variants: variants.filter(v => v.variant_name && v.variant_value).length > 0
        ? variants.filter(v => v.variant_name && v.variant_value)
        : undefined,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/supplier/products');
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors';
  const labelClass = 'block text-sm font-semibold text-white mb-1.5';
  const helpClass = 'text-xs text-gray-500 mt-1';

  return (
    <DashboardLayout user={{ name: 'Supplier', initials: 'S' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/supplier/products" className="text-[#d4a843] hover:underline text-sm">
              ← Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-white mt-1">Add New Product</h1>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 bg-[#1a1d23] border border-[#242830] rounded-lg p-3">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === step.id
                    ? 'bg-[#c41e3a] text-white'
                    : currentStep > step.id
                      ? 'bg-green-600/20 text-green-400 cursor-pointer hover:bg-green-600/30'
                      : 'text-gray-500'
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${currentStep > step.id ? 'bg-green-600' : 'bg-[#242830]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-600/40 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Product Name (English) *</label>
                  <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} className={inputClass} placeholder="e.g. Industrial LED Panel Light 60W" />
                </div>
                <div>
                  <label className={labelClass}>Product Name (Arabic)</label>
                  <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} className={inputClass} placeholder="اسم المنتج بالعربي" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Brand Name</label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} className={inputClass} placeholder="e.g. BrightStar" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description (English)</label>
                <textarea value={shortDescEn} onChange={e => setShortDescEn(e.target.value)} className={inputClass} rows={2} placeholder="Brief product description (1-2 sentences)" />
                <p className={helpClass}>{shortDescEn.length}/200 characters</p>
              </div>

              <div>
                <label className={labelClass}>Short Description (Arabic)</label>
                <textarea value={shortDescAr} onChange={e => setShortDescAr(e.target.value)} className={inputClass} rows={2} placeholder="وصف مختصر للمنتج" dir="rtl" />
              </div>

              <div>
                <label className={labelClass}>Full Description (English)</label>
                <textarea value={fullDescEn} onChange={e => setFullDescEn(e.target.value)} className={inputClass} rows={4} placeholder="Detailed product description with features and benefits..." />
              </div>

              <div>
                <label className={labelClass}>Main Image URL</label>
                <input type="url" value={mainImageUrl} onChange={e => setMainImageUrl(e.target.value)} className={inputClass} placeholder="https://example.com/product-image.jpg" />
                <p className={helpClass}>Enter the URL of your main product image</p>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Stock */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Pricing & Stock</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Base Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" step="0.01" value={basePrice} onChange={e => setBasePrice(e.target.value)} className={`${inputClass} pl-7`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}>
                    <option value="USD">USD</option>
                    <option value="SAR">SAR</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Price Type</label>
                  <select value={priceType} onChange={e => setPriceType(e.target.value)} className={inputClass}>
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                    <option value="tiered">Tiered Pricing</option>
                    <option value="rfq_only">RFQ Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>MOQ (Min Order Qty) *</label>
                  <input type="number" value={moq} onChange={e => setMoq(e.target.value)} className={inputClass} placeholder="100" />
                </div>
                <div>
                  <label className={labelClass}>MOQ Unit</label>
                  <select value={moqUnit} onChange={e => setMoqUnit(e.target.value)} className={inputClass}>
                    <option value="pieces">Pieces</option>
                    <option value="sets">Sets</option>
                    <option value="kg">Kilograms</option>
                    <option value="tons">Tons</option>
                    <option value="meters">Meters</option>
                    <option value="cartons">Cartons</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className={inputClass} placeholder="1000" />
                </div>
              </div>

              {/* Volume Pricing Tiers */}
              <div className="border-t border-[#242830] pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Volume Pricing Tiers</h3>
                  <button onClick={addPricingTier} className="px-3 py-1 text-xs bg-[#242830] text-[#d4a843] rounded hover:bg-[#2a2f38] transition-colors">
                    + Add Tier
                  </button>
                </div>
                {pricingTiers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pricing tiers added. Click "Add Tier" for volume discounts.</p>
                ) : (
                  <div className="space-y-2">
                    {pricingTiers.map((tier, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input type="number" value={tier.min_quantity || ''} onChange={e => updatePricingTier(idx, 'min_quantity', parseInt(e.target.value) || 0)} className={`${inputClass} w-28`} placeholder="Min qty" />
                        <span className="text-gray-400">-</span>
                        <input type="number" value={tier.max_quantity || ''} onChange={e => updatePricingTier(idx, 'max_quantity', parseInt(e.target.value) || null)} className={`${inputClass} w-28`} placeholder="Max qty" />
                        <span className="text-gray-400">@</span>
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input type="number" step="0.01" value={tier.price || ''} onChange={e => updatePricingTier(idx, 'price', parseFloat(e.target.value) || 0)} className={`${inputClass} pl-6`} placeholder="Price" />
                        </div>
                        <button onClick={() => removePricingTier(idx)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="border-t border-[#242830] pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Product Variants</h3>
                  <button onClick={addVariant} className="px-3 py-1 text-xs bg-[#242830] text-[#d4a843] rounded hover:bg-[#2a2f38] transition-colors">
                    + Add Variant
                  </button>
                </div>
                {variants.length === 0 ? (
                  <p className="text-gray-500 text-sm">No variants. Add options like color, size, or wattage.</p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input type="text" value={v.variant_name} onChange={e => updateVariant(idx, 'variant_name', e.target.value)} className={`${inputClass} w-32`} placeholder="Type (Color)" />
                        <input type="text" value={v.variant_value} onChange={e => updateVariant(idx, 'variant_value', e.target.value)} className={`${inputClass} w-40`} placeholder="Value (Warm White)" />
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$±</span>
                          <input type="number" step="0.01" value={v.price_adjustment || ''} onChange={e => updateVariant(idx, 'price_adjustment', parseFloat(e.target.value) || 0)} className={`${inputClass} pl-8`} placeholder="0" />
                        </div>
                        <button onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Details & Specs */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Details & Specifications</h2>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Technical Specifications</label>
                  <button onClick={addSpecification} className="px-3 py-1 text-xs bg-[#242830] text-[#d4a843] rounded hover:bg-[#2a2f38] transition-colors">
                    + Add Spec
                  </button>
                </div>
                <div className="space-y-2">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input type="text" value={spec.key} onChange={e => updateSpecification(idx, 'key', e.target.value)} className={`${inputClass} w-40`} placeholder="e.g. Power" />
                      <span className="text-gray-400">:</span>
                      <input type="text" value={spec.value} onChange={e => updateSpecification(idx, 'value', e.target.value)} className={`${inputClass} flex-1`} placeholder="e.g. 60W" />
                      {specifications.length > 1 && (
                        <button onClick={() => removeSpecification(idx)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Certifications</label>
                  <input type="text" value={certifications} onChange={e => setCertifications(e.target.value)} className={inputClass} placeholder="CE, RoHS, SASO (comma separated)" />
                </div>
                <div>
                  <label className={labelClass}>HS Code</label>
                  <input type="text" value={hsCode} onChange={e => setHsCode(e.target.value)} className={inputClass} placeholder="e.g. 9405.42" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Origin Country</label>
                <input type="text" value={originCountry} onChange={e => setOriginCountry(e.target.value)} className={inputClass} placeholder="China" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" id="sampleAvailable" checked={sampleAvailable} onChange={e => setSampleAvailable(e.target.checked)} className="w-4 h-4 accent-[#c41e3a]" />
                    <label htmlFor="sampleAvailable" className="text-white font-medium">Samples Available</label>
                  </div>
                  {sampleAvailable && (
                    <div>
                      <label className="text-xs text-gray-400">Sample Price ($)</label>
                      <input type="number" step="0.01" value={samplePrice} onChange={e => setSamplePrice(e.target.value)} className={`${inputClass} mt-1`} placeholder="Free or enter price" />
                    </div>
                  )}
                </div>

                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" id="customization" checked={customizationAvailable} onChange={e => setCustomizationAvailable(e.target.checked)} className="w-4 h-4 accent-[#c41e3a]" />
                    <label htmlFor="customization" className="text-white font-medium">Customization Available</label>
                  </div>
                  {customizationAvailable && (
                    <div>
                      <label className="text-xs text-gray-400">Customization Details</label>
                      <textarea value={customizationDetails} onChange={e => setCustomizationDetails(e.target.value)} className={`${inputClass} mt-1`} rows={2} placeholder="Logo printing, color options..." />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Trade & Shipping */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Trade & Shipping</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Lead Time Min</label>
                  <input type="number" value={leadTimeMin} onChange={e => setLeadTimeMin(e.target.value)} className={inputClass} placeholder="7" />
                </div>
                <div>
                  <label className={labelClass}>Lead Time Max</label>
                  <input type="number" value={leadTimeMax} onChange={e => setLeadTimeMax(e.target.value)} className={inputClass} placeholder="15" />
                </div>
                <div>
                  <label className={labelClass}>Lead Time Unit</label>
                  <select value={leadTimeUnit} onChange={e => setLeadTimeUnit(e.target.value)} className={inputClass}>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Port of Loading</label>
                  <input type="text" value={portOfLoading} onChange={e => setPortOfLoading(e.target.value)} className={inputClass} placeholder="e.g. Shanghai Port" />
                </div>
                <div>
                  <label className={labelClass}>Packaging Details</label>
                  <input type="text" value={packagingDetail} onChange={e => setPackagingDetail(e.target.value)} className={inputClass} placeholder="e.g. Individual box, 10 per carton" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Production Capacity</label>
                  <input type="number" value={productionCapacity} onChange={e => setProductionCapacity(e.target.value)} className={inputClass} placeholder="50000" />
                </div>
                <div>
                  <label className={labelClass}>Capacity Unit</label>
                  <select value={productionCapacityUnit} onChange={e => setProductionCapacityUnit(e.target.value)} className={inputClass}>
                    <option value="pieces">Pieces/month</option>
                    <option value="sets">Sets/month</option>
                    <option value="tons">Tons/month</option>
                    <option value="kg">KG/month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Payment Terms</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['T/T', 'L/C', 'D/P', 'Western Union', 'PayPal', 'Trade Assurance'].map(term => (
                    <button
                      key={term}
                      onClick={() => togglePaymentTerm(term)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        paymentTerms.includes(term)
                          ? 'bg-[#c41e3a]/20 border-[#c41e3a] text-white'
                          : 'bg-[#0c0f14] border-[#242830] text-gray-400 hover:border-[#3a3f48]'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Review & Submit</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <h3 className="text-gray-400 text-xs mb-2">BASIC INFO</h3>
                  <p className="text-white font-semibold">{nameEn}</p>
                  {nameAr && <p className="text-gray-400 text-sm">{nameAr}</p>}
                  <p className="text-gray-500 text-xs mt-1">
                    {categories.find(c => c.id === categoryId)?.name_en || 'No category'}
                    {brandName && ` • ${brandName}`}
                  </p>
                  {shortDescEn && <p className="text-gray-300 text-sm mt-2">{shortDescEn}</p>}
                </div>

                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <h3 className="text-gray-400 text-xs mb-2">PRICING</h3>
                  <p className="text-[#d4a843] font-bold text-xl">${parseFloat(basePrice || '0').toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{currency} • {priceType}</p>
                  <p className="text-gray-500 text-xs mt-1">MOQ: {moq} {moqUnit}</p>
                  {pricingTiers.length > 0 && (
                    <p className="text-gray-500 text-xs">{pricingTiers.length} pricing tiers</p>
                  )}
                  {variants.length > 0 && (
                    <p className="text-gray-500 text-xs">{variants.length} variants</p>
                  )}
                </div>

                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <h3 className="text-gray-400 text-xs mb-2">SPECIFICATIONS</h3>
                  <p className="text-white text-sm">
                    {specifications.filter(s => s.key && s.value).length} specs defined
                  </p>
                  {certifications && <p className="text-gray-400 text-xs mt-1">Certs: {certifications}</p>}
                  {hsCode && <p className="text-gray-400 text-xs">HS: {hsCode}</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {sampleAvailable && <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded">Samples</span>}
                    {customizationAvailable && <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">Custom</span>}
                  </div>
                </div>

                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <h3 className="text-gray-400 text-xs mb-2">TRADE & SHIPPING</h3>
                  {(leadTimeMin || leadTimeMax) && (
                    <p className="text-white text-sm">
                      Lead time: {leadTimeMin}{leadTimeMax ? `-${leadTimeMax}` : '+'} {leadTimeUnit}
                    </p>
                  )}
                  {portOfLoading && <p className="text-gray-400 text-xs mt-1">Port: {portOfLoading}</p>}
                  {productionCapacity && (
                    <p className="text-gray-400 text-xs">
                      Capacity: {parseInt(productionCapacity).toLocaleString()} {productionCapacityUnit}/month
                    </p>
                  )}
                  {paymentTerms.length > 0 && (
                    <p className="text-gray-400 text-xs">Payment: {paymentTerms.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 text-sm text-yellow-400">
                Your product will be saved as a <strong>Draft</strong>. You can submit it for review when ready, or save and continue editing later.
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-5 py-2.5 bg-[#242830] text-white rounded-lg disabled:opacity-40 hover:bg-[#2a2f38] transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-3">
            {currentStep === STEPS.length ? (
              <>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save & Submit for Review'}
                </button>
              </>
            ) : (
              <button
                onClick={nextStep}
                className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
