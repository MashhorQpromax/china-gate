'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_SHIPMENTS } from '@/lib/demo-data';
import { ShipmentStatus } from '@/types';

interface ShipmentFilter {
  status: ShipmentStatus | 'ALL';
  company: string;
  type: string;
}

export default function ShippingPage() {
  const [filters, setFilters] = useState<ShipmentFilter>({
    status: 'ALL',
    company: 'ALL',
    type: 'ALL',
  });

  // Demo stats
  const stats = [
    { label: 'Active Shipments', value: 12, color: 'text-blue-400' },
    { label: 'In Transit', value: 8, color: 'text-yellow-400' },
    { label: 'Delivered This Month', value: 24, color: 'text-green-400' },
    { label: 'Avg Transit Time', value: '25 days', color: 'text-purple-400' },
  ];

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.DELIVERED:
        return 'bg-green-500/20 text-green-300';
      case ShipmentStatus.IN_TRANSIT:
        return 'bg-blue-500/20 text-blue-300';
      case ShipmentStatus.CUSTOMS_CLEARANCE:
        return 'bg-orange-500/20 text-orange-300';
      case ShipmentStatus.PORT_ARRIVED:
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Shipping & Logistics</h1>
            <p className="text-gray-400 mt-1">Manage and track your shipments</p>
          </div>
          <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            📦 Book Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as ShipmentStatus | 'ALL' })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Statuses</option>
                <option value="SHIPPED">Shipped</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="PORT_ARRIVED">Port Arrived</option>
                <option value="CUSTOMS_CLEARANCE">Customs Clearance</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Shipping Company</label>
              <select
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Companies</option>
                <option value="cosco">COSCO Shipping</option>
                <option value="maersk">Maersk</option>
                <option value="msc">MSC</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none transition-colors"
              >
                <option value="ALL">All Types</option>
                <option value="SEA">Sea</option>
                <option value="AIR">Air</option>
                <option value="LAND">Land</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipments List */}
        <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-[#0c0f14]">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Tracking #</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Route</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Shipping Co.</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">ETA</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Progress</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_SHIPMENTS.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-700 hover:bg-[#0c0f14] transition-colors">
                    <td className="px-6 py-4 text-white font-mono text-sm">{shipment.referenceNumber}</td>
                    <td className="px-6 py-4 text-white text-sm">
                      {shipment.originPort} → {shipment.destinationPort}
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{shipment.carrierName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {shipment.expectedArrivalDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-full"
                            style={{ width: '65%' }}
                          />
                        </div>
                        <span className="text-gray-400 text-xs">65%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/shipping/${shipment.id}`}
                        className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold transition-colors"
                      >
                        Track →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {DEMO_SHIPMENTS.length === 0 && (
          <div className="bg-[#1a1f2b] rounded-lg p-12 text-center border border-gray-700">
            <p className="text-gray-400 mb-4">📦 No shipments found</p>
            <button className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              Create Your First Shipment
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
