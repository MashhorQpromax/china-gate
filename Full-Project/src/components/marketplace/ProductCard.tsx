'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    nameEn: string;
    nameAr: string;
    priceRange: string;
    moq: number;
    supplier: string;
    supplierId?: string;
    country: string;
    rating: number;
    certifications: string[];
    availableForPartnership: boolean;
    image?: string;
    description?: string;
    supplierVerified?: boolean;
    sampleAvailable?: boolean;
    leadTime?: string;
    basePrice?: number;
    currency?: string;
    unit?: string;
  };
  isListView?: boolean;
}

export default function ProductCard({ product, isListView = false }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);

  const getRandomColor = (id: string) => {
    const colors = ['#8B0000', '#C41E3A', '#D4A843', '#1a1d23', '#242830'];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  const hasImage = product.image && product.image.startsWith('http');

  const handleQuickInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartKey = 'cg_inquiry_cart';
    try {
      const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existingIdx = existing.findIndex((item: { productId: string }) => item.productId === product.id);

      if (existingIdx >= 0) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
        return;
      }

      existing.push({
        productId: product.id,
        name: product.nameEn,
        image: product.image,
        price: product.basePrice || 0,
        currency: product.currency || 'USD',
        quantity: product.moq || 1,
        moq: product.moq || 1,
        unit: product.unit || 'pcs',
        supplierId: product.supplierId || '',
        supplierName: product.supplier || '',
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem(cartKey, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('inquiry-cart-updated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {}
  };

  if (isListView) {
    return (
      <Link href={`/marketplace/products/${product.id}`}>
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 hover:border-[#d4a843] transition-colors">
          <div className="flex gap-4 items-start">
            {/* Image */}
            {hasImage ? (
              <img
                src={product.image}
                alt={product.nameEn}
                className="w-24 h-24 rounded-lg flex-shrink-0 object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
                }}
              >
                <span className="text-xs font-bold text-white opacity-80 px-2 text-center leading-tight">
                  {product.nameEn.length > 20 ? product.nameEn.substring(0, 20) + '...' : product.nameEn}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 gap-4">
                <div>
                  <h3 className="text-white font-semibold">{product.nameEn}</h3>
                  <p className="text-gray-400 text-sm">{product.nameAr}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {product.availableForPartnership && (
                    <span className="px-2 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>
              )}
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-500 text-xs">Price</p>
                  <p className="text-[#d4a843] font-semibold">{product.priceRange}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">MOQ</p>
                  <p className="text-white font-semibold">{product.moq.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{product.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-400 text-sm">{product.supplier}</span>
                  {product.supplierVerified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-green-600 bg-opacity-20 text-green-400 rounded text-[10px] font-semibold">
                      ✓ Verified
                    </span>
                  )}
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400 text-sm">{product.country}</span>
                  {product.sampleAvailable && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-blue-400 text-xs">Samples</span>
                    </>
                  )}
                  {product.leadTime && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-gray-500 text-xs">{product.leadTime}</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleQuickInquiry}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      addedToCart
                        ? 'bg-green-600 bg-opacity-20 text-green-400'
                        : 'bg-[#d4a843] bg-opacity-20 text-[#d4a843] hover:bg-opacity-30'
                    }`}
                  >
                    {addedToCart ? '✓ Added' : '+ Inquiry'}
                  </button>
                  <span className="px-4 py-1 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded text-sm hover:bg-opacity-30 transition-colors">
                    View
                  </span>
                </div>
              </div>

              {/* Certifications */}
              {product.certifications.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {product.certifications.slice(0, 3).map(cert => (
                    <span key={cert} className="px-2 py-0.5 bg-[#0c0f14] text-gray-400 rounded text-xs">
                      {cert}
                    </span>
                  ))}
                  {product.certifications.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-500 text-xs">+{product.certifications.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={`/marketplace/products/${product.id}`}>
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden hover:border-[#d4a843] transition-all duration-200 hover:shadow-lg hover:shadow-[#c41e3a]/10 group cursor-pointer">
        {/* Image */}
        <div className="relative">
          {hasImage ? (
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div
              className="w-full aspect-square flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
              }}
            >
              <span className="text-3xl font-bold text-white opacity-80 px-4 text-center leading-tight group-hover:scale-105 transition-transform duration-300">
                {product.nameEn.length > 30 ? product.nameEn.substring(0, 30) + '...' : product.nameEn}
              </span>
            </div>
          )}
          {/* Quick inquiry overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickInquiry}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-[#d4a843] text-[#0c0f14] hover:bg-[#c49a38]'
              }`}
            >
              {addedToCart ? '✓ Added to Inquiry' : '+ Quick Inquiry'}
            </button>
          </div>
          {/* Badges on image */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {product.availableForPartnership && (
              <span className="px-2 py-1 bg-[#d4a843] text-[#0c0f14] rounded text-xs font-bold shadow">
                Featured
              </span>
            )}
            {product.sampleAvailable && (
              <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold shadow">
                Samples
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          {/* Name */}
          <div>
            <h3 className="text-white font-semibold leading-tight line-clamp-2">{product.nameEn}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{product.nameAr}</p>
          </div>

          {/* Price and MOQ */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">FOB Price</p>
              <p className="text-[#d4a843] font-bold">{product.priceRange}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">MOQ</p>
              <p className="text-white font-semibold">{product.moq.toLocaleString()}</p>
            </div>
          </div>

          {/* Supplier */}
          <div className="pt-2 border-t border-[#242830]">
            <div className="flex items-center gap-1.5">
              <p className="text-gray-400 text-xs truncate">{product.supplier}</p>
              {product.supplierVerified && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-green-600 bg-opacity-20 text-green-400 rounded text-[10px] font-semibold flex-shrink-0">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-gray-500 text-xs">{product.country}</p>
              {product.leadTime && (
                <span className="text-gray-500 text-[10px]">{product.leadTime}</span>
              )}
            </div>
          </div>

          {/* Rating and Certifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-white text-sm font-semibold">{product.rating}</span>
            </div>
            <div className="flex gap-1">
              {product.certifications.slice(0, 1).map(cert => (
                <span key={cert} className="px-1.5 py-0.5 bg-[#0c0f14] text-gray-400 rounded text-xs">
                  {cert}
                </span>
              ))}
              {product.certifications.length > 1 && (
                <span className="px-1.5 py-0.5 text-gray-500 text-xs">+{product.certifications.length - 1}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
