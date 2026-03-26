'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

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
  { id: 5, title: 'Review & Save', icon: '✅' },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [productStatus, setProductStatus] = useState('draft');

  // Fetch categories and product data
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/products/${productId}`).then(r => r.json()),
    ]).then(([catData, prodData]) => {
      // Set categories
      if (catData.categories) setCategories(catData.categories);
      else if (Array.isArray(catData)) setCategories(catData);

      // Set product data
      const p = prodData.product;
      if (p) {
        setNameEn(p.name_en || '');
        setNameAr(p.name_ar || '');
        setCategoryId(p.category_id || '');
        setShortDescEn(p.short_description_en || '');
        setShortDescAr(p.short_description_ar || '');
        setFullDescEn(p.full_description_en || '');
        setMainImageUrl(p.main_image_url || '');
        setBrandName(p.brand_name || '');
        setBasePrice(p.base_price?.toString() || '');
        setCurrency(p.currency || 'USD');
        setPriceType(p.price_type || 'fixed');
        setMoq(p.moq?.toString() || '');
        setMoqUnit(p.moq_unit || 'pieces');
        setStockQuantity(p.stock_quantity?.toString() || '');
        setHsCode(p.hs_code || '');
        setOriginCountry(p.origin_country || 'China');
        setSampleAvailable(p.sample_available || false);
        setSamplePrice(p.sample_price?.toString() || '');
        setCustomizationAvailable(p.customization_available || false);
        setCustomizationDetails(p.customization_details || '');
        setLeadTimeMin(p.lead_time_min?.toString() || '');
        setLeadTimeMax(p.lead_time_max?.toString() || '');
        setLeadTimeUnit(p.lead_time_unit || 'days');
        setPortOfLoading(p.port_of_loading || '');
        setProductionCapacity(p.production_capacity?.toString() || '');
        setProductionCapacityUnit(p.production_capacity_unit || 'pieces');
        setPackagingDetail(p.packaging_detail || '');
        setPaymentTerms(p.payment_terms || []);
        setProductStatus(p.status || 'draft');

        // Parse specifications from JSONB array
        if (p.specifications && Array.isArray(p.specifications)) {
          const specs = p.specifications.map((spec: Record<string, string>) => {
            const entries = Object.entries(spec);
            return entries.length > 0
              ? { key: entries[0][0], value: String(entries[0][1]) }
              : { key: '', value: '' };
          });
          if (specs.length > 0) setSpecifications(specs);
        }

        // Parse certifications
        if (p.certifications && Array.isArray(p.certifications)) {
          setCertifications(p.certifications.join(', '));
        }

        // Set pricing tiers and variants from related data
        if (p.pricing_tiers && p.pricing_tiers.length > 0) {
          setPricingTiers(p.pricing_tiers.map((t: Record<string, number | null>) => ({
            min_quantity: t.min_quantity || 0,
            max_quantity: t.max_quantity || null,
            price: t.price || 0,
          })));
        }
        if (p.variants && p.variants.length > 0) {
          setVariants(p.variants.map((v: Record<string, string | number>) => ({
            variant_name: v.variant_name || '',
            variant_value: v.variant_value || '',
            price_adjustment: Number(v.price_adjustment) || 0,
            stock_quantity: Number(v.stock_quantity) || 0,
          })));
        }
      }
    }).catch(() => {
      setError('Failed to load product data');
    }).finally(() => {
      setLoading(false);
    });
  }, [productId]);

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

  const handleSubmit = async (newStatus?: string) => {
    setSubmitting(true);
    setError('');

    const specsArray = specifications
      .filter(s => s.key.trim() && s.value.trim())
      .map(s => ({ [s.key]: s.value }));

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
      specifications: specsArray.length > 0 ? specsArray : [],
      certifications: certsArray.length > 0 ? certsArray : [],
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
    };

    if (newStatus) {
      payload.status = newStatus;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/supplier/products');
      } else {
        setError(data.error || 'Failed to update product');
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

  if (loading) {
    return (
      <DashboardLayout user={{ name: 'Supplier', initials: 'S' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#242830] rounded w-1/3" />
            <div className="h-12 bg-[#242830] rounded" />
            <div className="h-64 bg-[#242830] rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={{ name: 'Supplier', initials: 'S' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/supplier/products" className="text-[#d4a843] hover:underline text-sm">
              &larr; Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-white mt-1">Edit Product</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            productStatus === 'active' ? 'bg-green-600/20 text-green-400' :
            productStatus === 'draft' ? 'bg-gray-600/20 text-gray-400' :
            productStatus === 'pending_review' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-gray-600/20 text-gray-400'
          }`}>
            {productStatus === 'pending_review' ? 'Pending Review' : productStatus.charAt(0).toUpperCase() + productStatus.slice(1)}
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between bg-[#1a1d23] border border-[#242830] rounded-lg p-3">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  if (step.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === step.id
                    ? 'bg-[#c41e3a] text-white'
                    : step.id < currentStep
                    ? 'text-green-400 hover:bg-[#242830]'
                    : 'text-gray-500 hover:bg-[#242830]'
                }`}
              >
                <span>{step.id < currentStep ? '✓' : step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step.id < currentStep ? 'bg-green-600' : 'bg-[#242830]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Product Name (English) *</label>
                  <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} className={inputClass} placeholder="e.g. Industrial LED Panel Light 60W" />
                </div>
                <div>
                  <label className={labelClass}>Product Name (Arabic)</label>
                  <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} className={inputClass} dir="rtl" placeholder="اسم المنتج بالعربي" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <textarea value={shortDescEn} onChange={e => setShortDescEn(e.target.value.slice(0, 200))} className={inputClass} rows={2} placeholder="Brief product description (1-2 sentences)" />
                <p className={helpClass}>{shortDescEn.length}/200 characters</p>
              </div>
              <div>
                <label className={labelClass}>Short Description (Arabic)</label>
                <textarea value={shortDescAr} onChange={e => setShortDescAr(e.target.value)} className={inputClass} rows={2} dir="rtl" placeholder="وصف مختصر للمنتج" />
              </div>
              <div>
                <label className={labelClass}>Full Description (English)</label>
                <textarea value={fullDescEn} onChange={e => setFullDescEn(e.target.value)} className={inputClass} rows={4} placeholder="Detailed product description with features and benefits..." />
              </div>
              <div>
                <label className={labelClass}>Main Image URL</label>
                <input type="text" value={mainImageUrl} onChange={e => setMainImageUrl(e.target.value)} className={inputClass} placeholder="https://example.com/image.jpg" />
                {mainImageUrl && mainImageUrl.startsWith('http') && (
                  <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-[#242830]">
                    <img src={mainImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Pricing & Stock</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Base Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className={`${inputClass} pl-7`} placeholder="0.00" step="0.01" min="0" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}>
                    <option value="USD">USD</option>
                    <option value="CNY">CNY</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Price Type</label>
                  <select value={priceType} onChange={e => setPriceType(e.target.value)} className={inputClass}>
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                    <option value="rfq">Request for Quote</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>MOQ (Min Order Qty) *</label>
                  <input type="number" value={moq} onChange={e => setMoq(e.target.value)} className={inputClass} placeholder="100" min="1" />
                </div>
                <div>
                  <label className={labelClass}>MOQ Unit</label>
                  <select value={moqUnit} onChange={e => setMoqUnit(e.target.value)} className={inputClass}>
                    <option value="pieces">Pieces</option>
                    <option value="sets">Sets</option>
                    <option value="tons">Tons</option>
                    <option value="meters">Meters</option>
                    <option value="kg">Kilograms</option>
                    <option value="cartons">Cartons</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className={inputClass} placeholder="1000" min="0" />
                </div>
              </div>

              {/* Volume Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Volume Pricing Tiers</label>
                  <button onClick={addPricingTier} className="text-xs text-[#d4a843] hover:underline">+ Add Tier</button>
                </div>
                {pricingTiers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pricing tiers added. Click &quot;Add Tier&quot; for volume discounts.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {pricingTiers.map((tier, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="number" placeholder="Min qty" value={tier.min_quantity || ''} onChange={e => updatePricingTier(i, 'min_quantity', parseInt(e.target.value) || 0)} className={`${inputClass} w-28`} />
                        <span className="text-gray-400">-</span>
                        <input type="number" placeholder="Max qty" value={tier.max_quantity || ''} onChange={e => updatePricingTier(i, 'max_quantity', parseInt(e.target.value) || null)} className={`${inputClass} w-28`} />
                        <span className="text-gray-400">@</span>
                        <input type="number" placeholder="Price" value={tier.price || ''} onChange={e => updatePricingTier(i, 'price', parseFloat(e.target.value) || 0)} className={`${inputClass} w-28`} step="0.01" />
                        <button onClick={() => removePricingTier(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Variants */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Product Variants</label>
                  <button onClick={addVariant} className="text-xs text-[#d4a843] hover:underline">+ Add Variant</button>
                </div>
                {variants.length === 0 ? (
                  <p className="text-gray-500 text-sm">No variants. Add options like color, size, or wattage.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {variants.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="text" placeholder="Name (e.g. Color)" value={v.variant_name} onChange={e => updateVariant(i, 'variant_name', e.target.value)} className={`${inputClass} w-32`} />
                        <input type="text" placeholder="Value (e.g. Red)" value={v.variant_value} onChange={e => updateVariant(i, 'variant_value', e.target.value)} className={`${inputClass} w-32`} />
                        <input type="number" placeholder="Price +/-" value={v.price_adjustment || ''} onChange={e => updateVariant(i, 'price_adjustment', parseFloat(e.target.value) || 0)} className={`${inputClass} w-24`} step="0.01" />
                        <input type="number" placeholder="Stock" value={v.stock_quantity || ''} onChange={e => updateVariant(i, 'stock_quantity', parseInt(e.target.value) || 0)} className={`${inputClass} w-24`} />
                        <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Details & Specifications</h2>
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Technical Specifications</label>
                  <button onClick={addSpecification} className="text-xs text-[#d4a843] hover:underline">+ Add Spec</button>
                </div>
                {specifications.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-center mt-2">
                    <input type="text" placeholder="e.g. Power" value={spec.key} onChange={e => updateSpecification(i, 'key', e.target.value)} className={`${inputClass} flex-1`} />
                    <span className="text-gray-400">:</span>
                    <input type="text" placeholder="e.g. 60W" value={spec.value} onChange={e => updateSpecification(i, 'value', e.target.value)} className={`${inputClass} flex-1`} />
                    {specifications.length > 1 && (
                      <button onClick={() => removeSpecification(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <input type="text" value={originCountry} onChange={e => setOriginCountry(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-3 rounded-lg border border-[#242830] cursor-pointer ${sampleAvailable ? 'bg-green-900/20 border-green-700' : ''}`}>
                  <input type="checkbox" checked={sampleAvailable} onChange={e => setSampleAvailable(e.target.checked)} className="w-4 h-4" />
                  <span className="text-white text-sm font-medium">Samples Available</span>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg border border-[#242830] cursor-pointer ${customizationAvailable ? 'bg-green-900/20 border-green-700' : ''}`}>
                  <input type="checkbox" checked={customizationAvailable} onChange={e => setCustomizationAvailable(e.target.checked)} className="w-4 h-4" />
                  <span className="text-white text-sm font-medium">Customization Available</span>
                </label>
              </div>
              {sampleAvailable && (
                <div>
                  <label className={labelClass}>Sample Price</label>
                  <input type="number" value={samplePrice} onChange={e => setSamplePrice(e.target.value)} className={inputClass} placeholder="0.00" step="0.01" />
                </div>
              )}
              {customizationAvailable && (
                <div>
                  <label className={labelClass}>Customization Details</label>
                  <textarea value={customizationDetails} onChange={e => setCustomizationDetails(e.target.value)} className={inputClass} rows={2} placeholder="Describe available customization options..." />
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Trade & Shipping</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Port of Loading</label>
                  <input type="text" value={portOfLoading} onChange={e => setPortOfLoading(e.target.value)} className={inputClass} placeholder="e.g. Shanghai Port" />
                </div>
                <div>
                  <label className={labelClass}>Packaging Details</label>
                  <input type="text" value={packagingDetail} onChange={e => setPackagingDetail(e.target.value)} className={inputClass} placeholder="e.g. Individual box, 10 per carton" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Production Capacity</label>
                  <input type="number" value={productionCapacity} onChange={e => setProductionCapacity(e.target.value)} className={inputClass} placeholder="50000" />
                </div>
                <div>
                  <label className={labelClass}>Capacity Unit</label>
                  <select value={productionCapacityUnit} onChange={e => setProductionCapacityUnit(e.target.value)} className={inputClass}>
                    <option value="pieces">Pieces/month</option>
                    <option value="tons">Tons/month</option>
                    <option value="sets">Sets/month</option>
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
                          : 'border-[#242830] text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white">Review & Save</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Basic Info</p>
                  <p className="text-white font-semibold">{nameEn}</p>
                  <p className="text-gray-400 text-sm">{categories.find(c => c.id === categoryId)?.name_en || 'No category'}</p>
                </div>
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pricing</p>
                  <p className="text-[#d4a843] text-xl font-bold">${parseFloat(basePrice || '0').toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{currency} &bull; {priceType}</p>
                  <p className="text-gray-400 text-sm">MOQ: {moq || '0'} {moqUnit}</p>
                </div>
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Specifications</p>
                  <p className="text-white text-sm">{specifications.filter(s => s.key.trim()).length} specs defined</p>
                </div>
                <div className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Trade & Shipping</p>
                  {leadTimeMin && <p className="text-white text-sm">Lead time: {leadTimeMin}-{leadTimeMax || '?'} {leadTimeUnit}</p>}
                  {portOfLoading && <p className="text-gray-400 text-sm">Port: {portOfLoading}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            className={`px-5 py-2.5 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
          >
            &larr; Previous
          </button>

          <div className="flex gap-3">
            {currentStep === STEPS.length ? (
              <>
                <button
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                {productStatus === 'draft' && (
                  <button
                    onClick={() => handleSubmit('pending_review')}
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save & Submit for Review'}
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={nextStep}
                className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Next &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
