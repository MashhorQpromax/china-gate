'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiShipment {
  id: string;
  reference_number: string;
  deal_id: string | null;
  shipping_type: string;
  carrier_name: string;
  tracking_number: string | null;
  origin_port: string;
  destination_port: string;
  status: string;
  estimated_arrival: string | null;
  departure_date: string | null;
  total_shipping_cost: number | null;
  currency: string;
  created_at: string;
}

function getAuthHeaders(): Record<string, string> {
  // httpOnly cookies are sent automatically with fetch when credentials: 'include' is set
  return {};
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500/20 text-gray-300',
  packed: 'bg-gray-500/20 text-gray-300',
  shipped: 'bg-blue-500/20 text-blue-300',
  in_transit: 'bg-blue-500/20 text-blue-300',
  port_arrived: 'bg-purple-500/20 text-purple-300',
  customs_clearance: 'bg-orange-500/20 text-orange-300',
  delivered: 'bg-green-500/20 text-green-300',
  final_delivery: 'bg-green-500/20 text-green-300',
};

const statusOrder = ['pending', 'packed', 'shipped', 'in_transit', 'port_arrived', 'customs_clearance', 'final_delivery', 'delivered'];

function getProgress(status: string): number {
  const idx = statusOrder.indexOf(status);
  if (idx === -1) return 10;
  return Math.round(((idx + 1) / statusOrder.length) * 100);
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState<ApiShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/shipments?page=${page}&limit=20`, {
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view shipments');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        let data = json.data || [];
        // Client-side filtering
        if (statusFilter !== 'all') {
          data = data.filter((s: ApiShipment) => s.status === statusFilter);
        }
        if (typeFilter !== 'all') {
          data = data.filter((s: ApiShipment) => s.shipping_type?.toLowerCase() === typeFilter.toLowerCase());
        }
        setShipments(data);
        setTotal(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Stats from current data
  const activeCount = shipments.filter(s => s.status !== 'delivered').length;
  const inTransitCount = shipments.filter(s => s.status === 'in_transit').length;

  const stats = [
    { label: 'Total Shipments', value: total, color: 'text-blue-400' },
    { label: 'Active', value: activeCount, color: 'text-yellow-400' },
    { label: 'In Transit', value: inTransitCount, color: 'text-green-400' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Shipping & Logistics</h1>
            <p className="text-gray-400 mt-1">Manage and track your shipments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2b] rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Statuses</option>
                {statusOrder.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#0c0f14] text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Types</option>
                <option value="sea">Sea</option>
                <option value="air">Air</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchShipments} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading shipments...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-[#1a1f2b] rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-[#0c0f14]">
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Reference</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Route</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Carrier</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">ETA</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Progress</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">No shipments found</td>
                    </tr>
                  )}
                  {shipments.map((shipment) => {
                    const progress = getProgress(shipment.status);
                    return (
                      <tr key={shipment.id} className="border-b border-gray-700 hover:bg-[#0c0f14] transition-colors">
                        <td className="px-6 py-4 text-white font-mono text-sm">{shipment.reference_number || shipment.tracking_number || '-'}</td>
                        <td className="px-6 py-4 text-white text-sm">
                          {shipment.origin_port || '?'} → {shipment.destination_port || '?'}
                        </td>
                        <td className="px-6 py-4 text-white text-sm">{shipment.carrier_name || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[shipment.status] || 'bg-gray-500/20 text-gray-300'}`}>
                            {(shipment.status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {shipment.estimated_arrival ? new Date(shipment.estimated_arrival).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-[#c41e3a] to-[#d4a843] h-full" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-gray-400 text-xs">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a href={`/shipping/${shipment.id}`} className="text-[#d4a843] hover:text-yellow-300 text-sm font-semibold">
                            Track →
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
