'use client';

import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    nameEn: string;
    nameAr: string;
    priceRange: string;
    moq: number;
    supplier: string;
    country: string;
    rating: number;
    certifications: string[];
    availableForPartnership: boolean;
    image?: string;
    description?: string;
  };
  isListView?: boolean;
}

export default function ProductCard({ product, isListView = false }: ProductCardProps) {
  const getRandomColor = (id: string) => {
    const colors = ['#8B0000', '#C41E3A', '#D4A843', '#1a1d23', '#242830'];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  const hasImage = product.image && product.image.startsWith('http');

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
                {product.availableForPartnership && (
                  <span className="px-2 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold whitespace-nowrap">
                    Partnership
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>
              )}
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-500 text-xs">Price</p>
                  <p className="text-white font-semibold">{product.priceRange}</p>
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
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{product.supplier}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">{product.country}</span>
                </div>
                <span className="px-4 py-1 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded text-sm hover:bg-opacity-30 transition-colors">
                  View
                </span>
              </div>

              {/* Certifications */}
              {product.certifications.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {product.certifications.slice(0, 2).map(cert => (
                    <span key={cert} className="px-2 py-0.5 bg-[#0c0f14] text-gray-400 rounded text-xs">
                      {cert}
                    </span>
                  ))}
                  {product.certifications.length > 2 && (
                    <span className="px-2 py-0.5 text-gray-500 text-xs">+{product.certifications.length - 2}</span>
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
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden hover:border-[#d4a843] transition-all duration-200 hover:shadow-lg hover:shadow-[#c41e3a]20 group cursor-pointer">
        {/* Image */}
        {hasImage ? (
          <div className="w-full aspect-square overflow-hidden relative">
            <img
              src={product.image}
              alt={product.nameEn}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
        ) : (
          <div
            className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gradient-to-br relative"
            style={{
              background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
            }}
          >
            <span className="text-3xl font-bold text-white opacity-80 px-4 text-center leading-tight group-hover:scale-110 transition-transform">
              {product.nameEn.length > 30 ? product.nameEn.substring(0, 30) + '...' : product.nameEn}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {product.availableForPartnership && (
              <span className="px-2 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded-full text-xs font-semibold">
                Partnership
              </span>
            )}
          </div>

          {/* Name */}
          <div>
            <h3 className="text-white font-semibold leading-tight">{product.nameEn}</h3>
            <p className="text-gray-400 text-xs mt-1">{product.nameAr}</p>
          </div>

          {/* Price and MOQ */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-500 text-xs">FOB Price</p>
              <p className="text-[#d4a843] font-bold">{product.priceRange}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">MOQ</p>
              <p className="text-white font-semibold">{product.moq.toLocaleString()}</p>
            </div>
          </div>

          {/* Supplier */}
          <div className="pt-2 border-t border-[#242830]">
            <p className="text-gray-400 text-xs">{product.supplier}</p>
            <p className="text-gray-500 text-xs">{product.country}</p>
          </div>

          {/* Rating and Certifications */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
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

          {/* Action Button */}
          <span className="block w-full mt-3 px-3 py-2 bg-[#c41e3a] bg-opacity-20 text-[#c41e3a] rounded-lg hover:bg-opacity-30 transition-colors font-semibold text-sm text-center">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
