'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiUser {
  id: string;
  full_name_en: string;
  full_name_ar: string | null;
  email: string;
  account_type: string;
  company_name: string | null;
  country: string | null;
  account_status: string;
  is_suspended: boolean;
  created_at: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const typeLabels: Record<string, string> = {
  gulf_buyer: 'Buyer',
  chinese_supplier: 'Supplier',
  gulf_manufacturer: 'Manufacturer',
  admin: 'Admin',
};

const typeColors: Record<string, string> = {
  gulf_buyer: 'bg-blue-500/20 text-blue-400',
  chinese_supplier: 'bg-purple-500/20 text-purple-400',
  gulf_manufacturer: 'bg-orange-500/20 text-orange-400',
  admin: 'bg-red-500/20 text-red-400',
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (searchTerm) params.set('search', searchTerm);
      if (filterType !== 'all') params.set('type', filterType);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in as admin to manage users');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        setUsers(json.data || []);
        setTotal(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
          <p className="text-gray-400">Manage company users and their roles</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
          />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors min-w-[200px]"
          >
            <option value="all">All Types</option>
            <option value="admin">Admin</option>
            <option value="gulf_buyer">Buyer</option>
            <option value="chinese_supplier">Supplier</option>
            <option value="gulf_manufacturer">Manufacturer</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1f2b] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchUsers} className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1f2b] border border-gray-700 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0c0f14] border-b border-[#242830]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Country</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242830]">
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-500">No users found</td></tr>
                  )}
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#242830] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-semibold text-sm">
                            {(user.full_name_en || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-white font-semibold">{user.full_name_en}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${typeColors[user.account_type] || 'bg-gray-500/20 text-gray-400'}`}>
                          {typeLabels[user.account_type] || user.account_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{user.company_name || '-'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{user.country || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          user.is_suspended
                            ? 'bg-red-600/20 text-red-400'
                            : user.account_status === 'active'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {user.is_suspended ? 'Suspended' : (user.account_status || 'Active').charAt(0).toUpperCase() + (user.account_status || 'active').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
