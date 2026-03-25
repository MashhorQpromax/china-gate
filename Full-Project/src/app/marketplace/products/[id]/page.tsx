'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

interface PricingTier {
  id: string;
  min_quantity: number;
  max_quantity: number | null;
  unit_price: number;
}

interface ProductVariant {
  id: string;
  variant_name: string;
  sku_suffix: string;
  attributes: Record<string, string>;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { full_name_en: string; company_name: string } | null;
}

interface ProductDetail {
  id: string;
  name_en: string;
  name_ar: string;
  name_zh: string;
  description_en: string;
  description_ar: string;
  base_price: number;
  currency: string;
  moq: number;
  moq_unit: string;
  lead_time_days: number;
  main_image_url: string;
  hs_code: string;
  origin_country: string;
  certifications: string[];
  specifications: Record<string, string>[];
  featured: boolean;
  samples_available: boolean;
  customization_available: boolean;
  avg_rating: number;
  review_count: number;
  view_count: number;
  order_count: number;
  brand_name: string;
  port_of_loading: string;
  production_capacity: number;
  production_capacity_unit: string;
  warranty_info: string;
  packaging_details: string;
  pricing_tiers: PricingTier[];
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: ProductReview[];
  supplier: {
    full_name_en: string;
    full_name_ar: string;
    company_name: string;
    country: string;
    city: string;
    avatar_url: string;
  } | null;
  verification: {
    verification_level: string;
    is_verified: boolean;
  } | null;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryQuantity, setInquiryQuantity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          setProduct(data.product);
          if (data.product.moq) {
            setInquiryQuantity(data.product.moq.toString());
          }
        } else {
          setError('Product not found');
        }
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout user={{ name: 'Buyer', initials: 'B' }} isAuthenticated={true}>
        <div className="space-y-8 animate-pulse">
          <div className="h-6 bg-[#242830] rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-square bg-[#1a1d23] border border-[#242830] rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 bg-[#242830] rounded w-3/4" />
              <div className="h-6 bg-[#242830] rounded w-1/2" />
              <div className="h-24 bg-[#242830] rounded" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-[#1a1d23] border border-[#242830] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout user={{ name: 'Buyer', initials: 'B' }} isAuthenticated={true}>
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">{error || 'Product not found'}</p>
          <Link href="/marketplace/products" className="text-[#d4a843] hover:underline">
            Back to Products
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Build image list - main image + product_images
  const allImages: { url: string; label: string }[] = [];
  if (product.main_image_url) {
    allImages.push({ url: product.main_image_url, label: 'Main' });
  }
  if (product.images && product.images.length > 0) {
    product.images
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((img, idx) => {
        if (img.image_url !== product.main_image_url) {
          allImages.push({ url: img.image_url, label: img.alt_text || `Image ${idx + 1}` });
        }
      });
  }
  // Fallback if no images
  if (allImages.length === 0) {
    allImages.push({ url: '', label: 'No Image' });
  }

  const getRandomColor = (id: string) => {
    const colors = ['#8B0000', '#C41E3A', '#D4A843', '#1a1d23', '#242830'];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  const currentImage = allImages[selectedImage] || allImages[0];
  const hasRealImage = currentImage.url && currentImage.url.startsWith('http');

  // Calculate price from inquiry quantity using tiers
  const getUnitPrice = (qty: number): number => {
    if (product.pricing_tiers && product.pricing_tiers.length > 0) {
      const sorted = [...product.pricing_tiers].sort((a, b) => a.min_quantity - b.min_quantity);
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (qty >= sorted[i].min_quantity) {
          return sorted[i].unit_price;
        }
      }
    }
    return product.base_price;
  };

  const qty = parseInt(inquiryQuantity || '0');
  const unitPrice = getUnitPrice(qty);

  return (
    <DashboardLayout user={{ name: 'Buyer', initials: 'B' }} isAuthenticated={true}>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/marketplace/products" className="text-[#d4a843] hover:underline">
            Products
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{product.name_en}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-1 space-y-4">
            {hasRealImage ? (
              <img
                src={currentImage.url}
                alt={product.name_en}
                className="w-full aspect-square rounded-lg border border-[#242830] object-cover"
              />
            ) : (
              <div
                className="w-full aspect-square rounded-lg border border-[#242830] flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
                }}
              >
                <span className="text-6xl text-white opacity-50">📦</span>
              </div>
            )}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-[#c41e3a]' : 'border-[#242830]'
                    }`}
                  >
                    {img.url && img.url.startsWith('http') ? (
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
                        }}
                      >
                        <span className="text-lg opacity-50">📦</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-start gap-3 mb-3 flex-wrap">
                {product.featured && (
                  <span className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
                {product.samples_available && (
                  <span className="px-3 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded-full text-xs font-semibold">
                    Samples Available
                  </span>
                )}
                {product.customization_available && (
                  <span className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-xs font-semibold">
                    Customizable
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name_en}</h1>
              {product.name_ar && <p className="text-lg text-gray-400">{product.name_ar}</p>}
              {product.name_zh && <p className="text-sm text-gray-500">{product.name_zh}</p>}
            </div>

            {/* Description */}
            {product.description_en && (
              <p className="text-gray-300 leading-relaxed">{product.description_en}</p>
            )}

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">FOB Price</p>
                <p className="text-lg font-bold text-white">
                  ${product.base_price?.toLocaleString()} / {product.moq_unit || 'unit'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">MOQ</p>
                <p className="text-lg font-bold text-white">
                  {product.moq?.toLocaleString()} {product.moq_unit || 'units'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lead Time</p>
                <p className="text-lg font-bold text-white">
                  {product.lead_time_days ? `${product.lead_time_days} days` : 'Contact supplier'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Origin</p>
                <p className="text-lg font-bold text-white">{product.origin_country || 'China'}</p>
              </div>
            </div>

            {/* Pricing Tiers */}
            {product.pricing_tiers && product.pricing_tiers.length > 0 && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Volume Pricing</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.pricing_tiers
                    .sort((a, b) => a.min_quantity - b.min_quantity)
                    .map(tier => (
                      <div key={tier.id} className="bg-[#0c0f14] rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">
                          {tier.min_quantity.toLocaleString()}
                          {tier.max_quantity ? ` - ${tier.max_quantity.toLocaleString()}` : '+'} {product.moq_unit || 'units'}
                        </p>
                        <p className="text-[#d4a843] font-bold">${tier.unit_price}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Available Variants</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.filter(v => v.is_active).map(variant => (
                    <span
                      key={variant.id}
                      className="px-3 py-1.5 bg-[#0c0f14] border border-[#242830] text-gray-300 rounded-lg text-sm hover:border-[#d4a843] transition-colors cursor-pointer"
                    >
                      {variant.variant_name}
                      {variant.price_adjustment !== 0 && (
                        <span className="text-gray-500 ml-1">
                          ({variant.price_adjustment > 0 ? '+' : ''}{variant.price_adjustment})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.port_of_loading && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">Port of Loading</p>
                  <p className="text-white font-semibold">{product.port_of_loading}</p>
                </div>
              )}
              {product.production_capacity && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">Production Capacity</p>
                  <p className="text-white font-semibold">
                    {product.production_capacity.toLocaleString()} {product.production_capacity_unit || 'units'}/month
                  </p>
                </div>
              )}
              {product.hs_code && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">HS Code</p>
                  <p className="text-white font-semibold">{product.hs_code}</p>
                </div>
              )}
              {product.certifications && product.certifications.length > 0 && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">Certifications</p>
                  <p className="text-white font-semibold">{product.certifications.join(', ')}</p>
                </div>
              )}
              {product.brand_name && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">Brand</p>
                  <p className="text-white font-semibold">{product.brand_name}</p>
                </div>
              )}
              {product.packaging_details && (
                <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <p className="text-gray-500 mb-1">Packaging</p>
                  <p className="text-white font-semibold">{product.packaging_details}</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>👁 {product.view_count || 0} views</span>
              <span>📦 {product.order_count || 0} orders</span>
              <span>⭐ {product.avg_rating || 0} ({product.review_count || 0} reviews)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInquiryModal(true)}
                className="flex-1 px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Add to Inquiry
              </button>
              <Link
                href={`/marketplace/requests?product=${product.id}`}
                className="flex-1 px-6 py-3 border-2 border-[#d4a843] text-[#d4a843] rounded-lg hover:bg-[#d4a843] hover:text-[#0c0f14] transition-colors font-semibold text-center"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Supplier Card */}
        {product.supplier && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {product.supplier.company_name || product.supplier.full_name_en}
                  </h3>
                  {product.verification?.is_verified && (
                    <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-3">
                  {[product.supplier.city, product.supplier.country].filter(Boolean).join(', ')}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold text-white">{product.avg_rating || 0}</span>
                  <span className="text-gray-400">({product.review_count || 0} reviews)</span>
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
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Reviews ({product.reviews.length})</h2>
            <div className="space-y-4">
              {product.reviews.map(review => (
                <div key={review.id} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {review.profiles?.company_name || review.profiles?.full_name_en || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-300 text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
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
                <p className="text-xs text-gray-400 mt-1">
                  Minimum: {product.moq?.toLocaleString()} {product.moq_unit || 'units'}
                </p>
              </div>

              <div className="bg-[#0c0f14] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unit Price:</span>
                  <span className="text-white">${unitPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="text-white">{qty.toLocaleString()}</span>
                </div>
                <div className="border-t border-[#242830] pt-2 flex justify-between">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-[#d4a843] font-bold">
                    ${(qty * unitPrice).toLocaleString()}
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
