'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface User {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  email: string;
  account_type: string;
  company_name: string;
  country: string;
  account_status: string;
  is_suspended: boolean;
  created_at: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const typeColors: Record<string, string> = {
  gulf_buyer: 'bg-blue-500/20 text-blue-400',
  chinese_supplier: 'bg-green-500/20 text-green-400',
  gulf_manufacturer: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-red-500/20 text-red-400',
};

const typeLabels: Record<string, string> = {
  gulf_buyer: 'Buyer',
  chinese_supplier: 'Supplier',
  gulf_manufacturer: 'Manufacturer',
  admin: 'Admin',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  suspended: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSuspended, setFilterSuspended] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const itemsPerPage = 20;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.set('search', searchTerm);
      if (filterType) params.set('account_type', filterType);
      if (filterSuspended) params.set('is_suspended', filterSuspended);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError('Admin access required');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        setUsers(json.data || []);
        setTotalUsers(json.meta?.total || 0);
        setTotalPages(json.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterSuspended]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1);
      }, 500)
    );
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const getStatus = (user: User) => {
    if (user.is_suspended) return 'suspended';
    return user.account_status || 'active';
  };

  return (
    <DashboardLayout
      user={{ name: 'Admin', initials: 'AD' }}
      isAuthenticated={true}
      userRole="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">
              {loading ? 'Loading...' : `${totalUsers} total users`}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1d23] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-3 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="">All Types</option>
                <option value="gulf_buyer">Buyers</option>
                <option value="chinese_supplier">Suppliers</option>
                <option value="gulf_manufacturer">Manufacturers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div>
              <select
                value={filterSuspended}
                onChange={(e) => {
                  setFilterSuspended(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-3 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="">All Status</option>
                <option value="false">Active</option>
                <option value="true">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0c0f14] border-b border-[#242830]">
                  <tr className="text-gray-400">
                    <th className="text-left py-4 px-6">Name</th>
                    <th className="text-left py-4 px-6">Email</th>
                    <th className="text-left py-4 px-6">Type</th>
                    <th className="text-left py-4 px-6">Company</th>
                    <th className="text-left py-4 px-6">Country</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-left py-4 px-6">Joined</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                  {users.map((user, idx) => {
                    const status = getStatus(user);
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${
                          idx % 2 === 0 ? 'bg-[#0c0f14]' : ''
                        }`}
                      >
                        <td className="py-4 px-6 text-white font-semibold">
                          {user.full_name_en || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`text-xs px-2 py-1 rounded ${typeColors[user.account_type] || 'bg-gray-500/20 text-gray-400'}`}>
                            {typeLabels[user.account_type] || user.account_type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.company_name || '-'}</td>
                        <td className="py-4 px-6 text-gray-300">{user.country || '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`text-xs px-2 py-1 rounded ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-xs">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs"
                          >
                            View
                          </button>
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
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">User Profile</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">{selectedUser.full_name_en || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-white">{typeLabels[selectedUser.account_type] || selectedUser.account_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className={statusColors[getStatus(selectedUser)] || 'text-gray-400'}>
                      {getStatus(selectedUser)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Company</p>
                  <p className="text-white">{selectedUser.company_name || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Country</p>
                    <p className="text-white">{selectedUser.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Joined</p>
                    <p className="text-white">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
