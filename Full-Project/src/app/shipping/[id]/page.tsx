'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ShipmentDetail {
  id: string;
  reference_number: string;
  deal_id: string | null;
  supplier_id: string;
  buyer_id: string;
  shipping_type: string | null;
  carrier_name: string | null;
  carrier_contact: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  origin_port: string | null;
  destination_port: string | null;
  transit_ports: string[] | null;
  booking_date: string | null;
  departure_date: string | null;
  estimated_arrival: string | null;
  container_type: string | null;
  container_number: string | null;
  bl_number: string | null;
  packages_count: number | null;
  total_weight: number | null;
  total_volume: number | null;
  weight_unit: string | null;
  volume_unit: string | null;
  insured: boolean;
  insurance_value: number | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  freight_cost: number | null;
  insurance_cost: number | null;
  other_costs: number | null;
  total_shipping_cost: number | null;
  currency: string;
  status: string;
  documents: any;
  notes: string | null;
  created_at: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

const statusOrder = ['pending', 'booked', 'packed', 'in_warehouse', 'shipped', 'in_transit', 'port_arrived', 'customs_clearance', 'out_for_delivery', 'delivered'];

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  booked: 'Booked',
  packed: 'Packed',
  in_warehouse: 'In Warehouse',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  port_arrived: 'Port Arrived',
  customs_clearance: 'Customs Clearance',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  returned: 'Returned',
  damaged: 'Damaged',
  lost: 'Lost',
};

function getProgress(status: string): number {
  const idx = statusOrder.indexOf(status);
  if (idx === -1) return 0;
  return Math.round((idx / (statusOrder.length - 1)) * 100);
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const shipmentId = params?.id as string;

  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipment = useCallback(async () => {
    if (!shipmentId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/shipments/${shipmentId}`, {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view this shipment');
          return;
        }
        if (res.status === 404) {
          setError('Shipment not found');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setShipment(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch shipment:', err);
      setError('Failed to load shipment details');
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading shipment details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !shipment) {
    return (
      <DashboardLayout>
        <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-3">{error || 'Shipment not found'}</p>
          <div className="flex gap-3 justify-center">
            <a href="/shipping" className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] text-sm">Back to Shipping</a>
            <button onClick={fetchShipment} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const progress = getProgress(shipment.status);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <a href="/shipping" className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold mb-4 inline-block">
            ← Back to Shipping
          </a>
          <h1 className="text-3xl font-bold text-white">Shipment Details</h1>
          <p className="text-gray-400 mt-1">{shipment.reference_number}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">{statusLabels[shipment.status] || shipment.status}</span>
            <span className="text-[#d4a843] font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-[#c41e3a] h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Pending</span>
            <span>In Transit</span>
            <span>Delivered</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipment Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Shipment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference</span>
                <span className="text-white font-mono">{shipment.reference_number}</span>
              </div>
              {shipment.bl_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">B/L Number</span>
                  <span className="text-white font-mono">{shipment.bl_number}</span>
                </div>
              )}
              {shipment.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracking Number</span>
                  <span className="text-white font-mono">{shipment.tracking_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Carrier</span>
                <span className="text-white">{shipment.carrier_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white">{shipment.shipping_type || '-'}</span>
              </div>
              {shipment.container_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Container</span>
                  <span className="text-white font-mono">{shipment.container_number}</span>
                </div>
              )}
              {shipment.container_type && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Container Type</span>
                  <span className="text-white">{shipment.container_type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Route Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Origin</span>
                <span className="text-white">{shipment.origin_port || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Destination</span>
                <span className="text-white">{shipment.destination_port || '-'}</span>
              </div>
              {shipment.booking_date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking Date</span>
                  <span className="text-white">{new Date(shipment.booking_date).toLocaleDateString()}</span>
                </div>
              )}
              {shipment.departure_date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Departure</span>
                  <span className="text-white">{new Date(shipment.departure_date).toLocaleDateString()}</span>
                </div>
              )}
              {shipment.estimated_arrival && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ETA</span>
                  <span className="text-white">{new Date(shipment.estimated_arrival).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cargo Details */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Cargo Details</h3>
            <div className="space-y-3">
              {shipment.packages_count && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Packages</span>
                  <span className="text-white">{shipment.packages_count}</span>
                </div>
              )}
              {shipment.total_weight && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight</span>
                  <span className="text-white">{shipment.total_weight.toLocaleString()} {shipment.weight_unit || 'kg'}</span>
                </div>
              )}
              {shipment.total_volume && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume</span>
                  <span className="text-white">{shipment.total_volume.toLocaleString()} {shipment.volume_unit || 'cbm'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Insurance */}
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Cargo Insurance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Insurance Status</span>
                <span className={`font-semibold ${shipment.insured ? 'text-green-400' : 'text-red-400'}`}>
                  {shipment.insured ? 'Active' : 'Not Insured'}
                </span>
              </div>
              {shipment.insurance_provider && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Provider</span>
                  <span className="text-white">{shipment.insurance_provider}</span>
                </div>
              )}
              {shipment.insurance_value && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage Value</span>
                  <span className="text-white font-semibold">{formatCurrency(shipment.insurance_value, shipment.currency)}</span>
                </div>
              )}
              {shipment.insurance_policy_number && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Policy Number</span>
                  <span className="text-white font-mono">{shipment.insurance_policy_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold text-lg mb-4">Cost Breakdown</h3>
          <div className="space-y-2 text-gray-400">
            {shipment.freight_cost != null && (
              <div className="flex justify-between">
                <span>Freight Cost</span>
                <span className="text-white">{formatCurrency(shipment.freight_cost, shipment.currency)}</span>
              </div>
            )}
            {shipment.insurance_cost != null && (
              <div className="flex justify-between">
                <span>Insurance Cost</span>
                <span className="text-white">{formatCurrency(shipment.insurance_cost, shipment.currency)}</span>
              </div>
            )}
            {shipment.other_costs != null && (
              <div className="flex justify-between">
                <span>Other Costs</span>
                <span className="text-white">{formatCurrency(shipment.other_costs, shipment.currency)}</span>
              </div>
            )}
            {shipment.total_shipping_cost != null && (
              <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
                <span>Total Shipping Cost</span>
                <span className="text-[#d4a843]">{formatCurrency(shipment.total_shipping_cost, shipment.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {shipment.notes && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Notes</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{shipment.notes}</p>
          </div>
        )}

        {/* Tracking Link */}
        {shipment.tracking_url && (
          <div className="bg-[#1a1f2b] rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Track Shipment</h3>
            <a
              href={shipment.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold inline-block"
            >
              Open Tracking Link
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
