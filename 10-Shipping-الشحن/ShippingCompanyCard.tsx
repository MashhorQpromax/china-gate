'use client';

import React from 'react';

interface ShippingCompanyCardProps {
  name: string;
  type: 'SEA' | 'AIR' | 'LAND';
  route: string;
  priceRange: string;
  transitDays: string;
  rating: number;
  notes?: string;
  onSelect?: () => void;
  onDetails?: () => void;
}

export default function ShippingCompanyCard({
  name,
  type,
  route,
  priceRange,
  transitDays,
  rating,
  notes,
  onSelect,
  onDetails,
}: ShippingCompanyCardProps) {
  const getTypeColor = (shippingType: string) => {
    switch (shippingType) {
      case 'SEA':
        return 'bg-blue-500/20 text-blue-300';
      case 'AIR':
        return 'bg-purple-500/20 text-purple-300';
      case 'LAND':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const renderStars = (rate: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rate) ? 'text-yellow-400' : 'text-gray-600'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1f2b] rounded-lg p-5 border border-gray-700 hover:border-[#c41e3a] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getTypeColor(type)}`}>
            {type}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Route</p>
          <p className="text-white text-sm font-mono">{route}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-400 text-sm">Price Range</p>
            <p className="text-[#d4a843] font-semibold">{priceRange}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Transit Time</p>
            <p className="text-white font-semibold">{transitDays}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">Rating</p>
          {renderStars(rating)}
          <p className="text-gray-400 text-xs mt-1">{rating.toFixed(1)}/5</p>
        </div>

        {notes && (
          <div>
            <p className="text-gray-400 text-sm">Notes</p>
            <p className="text-gray-300 text-sm">{notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-700">
        {onDetails && (
          <button
            onClick={onDetails}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Details
          </button>
        )}
        {onSelect && (
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-2 bg-[#c41e3a] text-white rounded text-sm hover:bg-red-700 transition-colors font-semibold"
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
}
