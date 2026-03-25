'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ShipmentTracker from '@/components/shipping/ShipmentTracker';
import { DEMO_SHIPMENTS } from '@/lib/demo-data';

interface ShipmentDetailPageProps {
  params: {
    id: string;
  };
}

export default function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  // Find the shipment from demo data
  const shipment = DEMO_SHIPMENTS.find((s) => s.id === params.id) || DEMO_SHIPMENTS[0];

  const timeline = [
    {
      date: new Date('2024-03-15'),
      event: 'Shipment Booked',
      status: 'completed',
      location: 'Shanghai, China',
    },
    {
      date: new Date('2024-03-16'),
      event: 'Goods Picked Up',
      status: 'completed',
      location: 'Supplier Warehouse',
    },
    {
      date: new Date('2024-03-17'),
      event: 'At Port',
      status: 'completed',
      location: 'Shanghai Port',
    },
    {
      date: new Date('2024-03-18'),
      event: 'Container Loaded',
      status: 'completed',
      location: 'Port Container Terminal',
    },
    {
      date: new Date('2024-04-02'),
      event: 'Currently In Transit',
      status: 'active',
      location: 'Arabian Sea',
    },
    {
      date: new Date('2024-05-15'),
      event: 'Expected Arrival',
      status: 'pending',
      location: 'King Abdul Aziz Port, Saudi Arabia',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/shipping" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to Shipping
          </a>
          <h1 className="text-3xl font-bold text-white">Shipment Details</h1>
          <p className="text-gray-400 mt-1">{shipment.referenceNumber}</p>
        </div>

        {/* Main Tracker */}
        <ShipmentTracker
          trackingNumber={shipment.blNumber || 'N/A'}
          currentLocation="Arabian Sea"
          eta={shipment.expectedArrivalDate.toLocaleDateString()}
          status={shipment.status}
          shippingCompany={shipment.carrierName}
          containerNumber={shipment.containerNumber || 'N/A'}
          progress={65}
        />

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipment Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Shipment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tracking Number</span>
                <span className="text-white font-mono">{shipment.blNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deal Reference</span>
                <span className="text-white font-mono">DEAL-2024-0001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Company</span>
                <span className="text-white">{shipment.carrierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipment Type</span>
                <span className="text-white">{shipment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Container Number</span>
                <span className="text-white font-mono">{shipment.containerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Location</span>
                <span className="text-white">Arabian Sea</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA</span>
                <span className="text-white">{shipment.expectedArrivalDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Cargo Insurance */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Cargo Insurance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Insurance Status</span>
                <span className="text-green-400 font-semibold">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Provider</span>
                <span className="text-white">{shipment.insuranceProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coverage Value</span>
                <span className="text-white font-semibold">
                  ${(shipment.insuranceValue || 0).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Policy Number</span>
                <span className="text-white font-mono">POL-2024-001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Premium Paid</span>
                <span className="text-white">₹ 5,800</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-4">Documents</h3>
          <div className="space-y-2">
            {['Bill of Lading', 'Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Inspection Certificate'].map(
              (doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between p-3 bg-[#0c0f14] rounded-lg border border-gray-700 hover:border-[#c41e3a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <span className="text-white font-semibold">{doc}</span>
                  </div>
                  <a
                    href="#"
                    className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold transition-colors"
                  >
                    Download
                  </a>
                </div>
              )
            )}
          </div>
        </div>

        {/* Timeline of Events */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-6">Timeline</h3>
          <div className="space-y-4">
            {timeline.map((entry, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      entry.status === 'completed'
                        ? 'bg-green-500'
                        : entry.status === 'active'
                          ? 'bg-[#c41e3a]'
                          : 'bg-gray-600'
                    }`}
                  />
                  {idx < timeline.length - 1 && <div className="w-1 h-12 bg-gray-700 my-2" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-white font-semibold">{entry.event}</p>
                  <p className="text-gray-400 text-sm">{entry.date.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{entry.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-4">Cost Breakdown</h3>
          <div className="space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Shipping Cost</span>
              <span className="text-white">$ 2,100</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance</span>
              <span className="text-white">$ 5,800</span>
            </div>
            <div className="flex justify-between">
              <span>Pre-Shipment Inspection</span>
              <span className="text-white">$ 500</span>
            </div>
            <div className="flex justify-between">
              <span>Handling & Documentation</span>
              <span className="text-white">$ 300</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
              <span>Total Shipping Cost</span>
              <span className="text-[#d4a843]">$ 8,700</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-4">Need Help?</h3>
          <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            ☎️ Contact Shipping Company
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
