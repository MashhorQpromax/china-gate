'use client';

import React, { useState } from 'react';
import ShippingCompanyCard from './ShippingCompanyCard';
import { SHIPPING_COMPANIES_SEA, SHIPPING_COMPANIES_AIR } from '@/lib/constants';

interface ShippingSelectorProps {
  onConfirm?: (data: ShippingSelectorData) => void;
  onBack?: () => void;
  fobValue?: number;
}

export interface ShippingSelectorData {
  type: 'SEA' | 'AIR' | 'LAND' | 'MULTIMODAL';
  company: string;
  containerSize?: string;
  insurance: boolean;
  inspection: boolean;
  totalCost: number;
}

const DEMO_SEA_OPTIONS = [
  {
    id: 'cosco',
    name: 'COSCO Shipping',
    type: 'SEA' as const,
    route: 'Shanghai (CNSHA) → King Abdul Aziz (SAWHA)',
    price20: '$1,200',
    price40: '$2,100',
    transitDays: '28-32 days',
    rating: 4.7,
    notes: 'Reliable service, competitive rates',
  },
  {
    id: 'maersk',
    name: 'Maersk',
    type: 'SEA' as const,
    route: 'Shanghai (CNSHA) → Jeddah (SAWJD)',
    price20: '$1,350',
    price40: '$2,350',
    transitDays: '25-28 days',
    rating: 4.8,
    notes: 'Premium service, excellent tracking',
  },
  {
    id: 'msc',
    name: 'MSC',
    type: 'SEA' as const,
    route: 'Shanghai (CNSHA) → Dubai (AEJEB)',
    price20: '$1,100',
    price40: '$1,950',
    transitDays: '22-26 days',
    rating: 4.6,
    notes: 'Fast service, good rates',
  },
];

const DEMO_AIR_OPTIONS = [
  {
    id: 'saudia_cargo',
    name: 'Saudia Cargo',
    type: 'AIR' as const,
    route: 'Shanghai (SHA) → Riyadh (RUH)',
    price: '$3.50/kg',
    transitDays: '4-6 days',
    rating: 4.5,
    notes: 'Reliable Saudi carrier',
  },
  {
    id: 'emirates_skycargo',
    name: 'Emirates SkyCargo',
    type: 'AIR' as const,
    route: 'Shanghai (SHA) → Dubai (DXB)',
    price: '$3.20/kg',
    transitDays: '3-5 days',
    rating: 4.8,
    notes: 'Fast & reliable service',
  },
  {
    id: 'qatar_airways_cargo',
    name: 'Qatar Airways Cargo',
    type: 'AIR' as const,
    route: 'Shanghai (SHA) → Doha (DOH)',
    price: '$3.45/kg',
    transitDays: '4-6 days',
    rating: 4.7,
    notes: 'Excellent connectivity',
  },
];

export default function ShippingSelector({
  onConfirm,
  onBack,
  fobValue = 100000,
}: ShippingSelectorProps) {
  const [shippingType, setShippingType] = useState<'SEA' | 'AIR' | 'LAND' | 'MULTIMODAL'>('SEA');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState<'20ft' | '40ft'>('20ft');
  const [insurance, setInsurance] = useState(false);
  const [inspection, setInspection] = useState(false);

  const options = shippingType === 'SEA' ? DEMO_SEA_OPTIONS : DEMO_AIR_OPTIONS;

  const calculateShippingCost = () => {
    if (!selectedCompany) return 0;

    const company = options.find((c) => c.id === selectedCompany);
    if (!company) return 0;

    let baseCost = 0;
    if (shippingType === 'SEA') {
      baseCost = containerSize === '20ft' ? 1200 : 2100;
    } else {
      baseCost = (fobValue * 0.035) / 1000; // $3.50/kg estimate
    }

    const insuranceCost = insurance ? fobValue * 0.001 : 0; // 0.1% of FOB
    const inspectionCost = inspection ? 500 : 0; // flat fee

    return baseCost + insuranceCost + inspectionCost;
  };

  const shippingCost = calculateShippingCost();
  const cifTotal = fobValue + shippingCost + (insurance ? fobValue * 0.001 : 0);

  const handleConfirm = () => {
    if (!selectedCompany) return;

    const data: ShippingSelectorData = {
      type: shippingType,
      company: selectedCompany,
      containerSize: shippingType === 'SEA' ? containerSize : undefined,
      insurance,
      inspection,
      totalCost: cifTotal,
    };

    onConfirm?.(data);
  };

  return (
    <div className="bg-[#0c0f14] rounded-lg p-6 space-y-6">
      {/* Shipping Type Selection */}
      <div>
        <h3 className="text-white font-semibold mb-4">Shipping Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['SEA', 'AIR', 'LAND', 'MULTIMODAL'] as const).map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                shippingType === type
                  ? 'border-[#c41e3a] bg-[#c41e3a]/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="shippingType"
                value={type}
                checked={shippingType === type}
                onChange={(e) => setShippingType(e.target.value as typeof shippingType)}
                className="w-4 h-4"
              />
              <span className="text-white text-sm font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Container Size for Sea Shipping */}
      {shippingType === 'SEA' && (
        <div>
          <h3 className="text-white font-semibold mb-4">Container Size</h3>
          <div className="flex gap-3">
            {(['20ft', '40ft'] as const).map((size) => (
              <label
                key={size}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  containerSize === size
                    ? 'border-[#c41e3a] bg-[#c41e3a]/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="containerSize"
                  value={size}
                  checked={containerSize === size}
                  onChange={(e) => setContainerSize(e.target.value as '20ft' | '40ft')}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm font-medium">{size}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Available Shipping Companies */}
      <div>
        <h3 className="text-white font-semibold mb-4">Available Shipping Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={`relative cursor-pointer transition-all ${
                selectedCompany === option.id ? 'ring-2 ring-[#d4a843] rounded-lg' : ''
              }`}
              onClick={() => setSelectedCompany(option.id)}
            >
              <ShippingCompanyCard
                name={option.name}
                type={option.type}
                route={option.route}
                priceRange={shippingType === 'SEA' ? `${option.price20} - ${option.price40}` : option.price}
                transitDays={option.transitDays}
                rating={option.rating}
                notes={option.notes}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-[#1a1f2b] rounded-lg p-4 space-y-3">
        <h3 className="text-white font-semibold">Additional Services</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={insurance}
            onChange={(e) => setInsurance(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600"
          />
          <span className="text-white flex-1">
            Cargo Insurance
            <span className="text-gray-400 text-sm ml-2">
              (₹ {(fobValue * 0.001).toLocaleString('en-US', { maximumFractionDigits: 2 })})
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inspection}
            onChange={(e) => setInspection(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600"
          />
          <span className="text-white flex-1">
            Pre-Shipment Inspection
            <span className="text-gray-400 text-sm ml-2">($ 500)</span>
          </span>
        </label>
      </div>

      {/* Cost Summary */}
      <div className="bg-[#1a1f2b] rounded-lg p-4 space-y-2 border border-[#d4a843]">
        <div className="flex justify-between text-gray-400">
          <span>FOB Value</span>
          <span>${fobValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Shipping Cost</span>
          <span className="text-[#d4a843]">${shippingCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
        {insurance && (
          <div className="flex justify-between text-gray-400">
            <span>Insurance</span>
            <span>${(fobValue * 0.001).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
          </div>
        )}
        {inspection && (
          <div className="flex justify-between text-gray-400">
            <span>Pre-Shipment Inspection</span>
            <span>$ 500</span>
          </div>
        )}
        <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold text-lg">
          <span>CIF Total</span>
          <span className="text-[#d4a843]">${cifTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Back
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedCompany}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
            selectedCompany
              ? 'bg-[#c41e3a] text-white hover:bg-red-700'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
