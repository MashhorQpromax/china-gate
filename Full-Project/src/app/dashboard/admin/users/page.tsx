'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'buyer' | 'supplier' | 'manufacturer';
  company: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  joined: string;
}

const demoUsers: User[] = [
  {
    id: 'user-001',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.rashid@example.com',
    type: 'buyer',
    company: 'Rashid Trading Company',
    country: 'Saudi Arabia',
    status: 'active',
    joined: '2024-01-15',
  },
  {
    id: 'user-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@shanghai-elec.com',
    type: 'supplier',
    company: 'Shanghai Electronics Ltd',
    country: 'China',
    status: 'active',
    joined: '2023-12-20',
  },
  {
    id: 'user-003',
    name: 'Mohammed Hassan',
    email: 'hassan@industrial-supply.com',
    type: 'buyer',
    company: 'Hassan Industrial Supply',
    country: 'UAE',
    status: 'active',
    joined: '2024-02-01',
  },
  {
    id: 'user-004',
    name: 'Liu Wei',
    email: 'liu.wei@zhejiang-steel.com',
    type: 'manufacturer',
    company: 'Zhejiang Heavy Industries',
    country: 'China',
    status: 'active',
    joined: '2023-11-10',
  },
  {
    id: 'user-005',
    name: 'Fatima Al-Saud',
    email: 'fatima.alsaud@example.com',
    type: 'buyer',
    company: 'Saudi Manufacturing Group',
    country: 'Saudi Arabia',
    status: 'suspended',
    joined: '2024-01-05',
  },
  {
    id: 'user-006',
    name: 'John Smith',
    email: 'john.smith@example.com',
    type: 'buyer',
    company: 'Smith Trading International',
    country: 'USA',
    status: 'pending',
    joined: '2024-03-20',
  },
  {
    id: 'user-007',
    name: 'Zhang Ming',
    email: 'zhang.ming@jiangsu-solar.com',
    type: 'supplier',
    company: 'Jiangsu Solar Panel Manufacturing',
    country: 'China',
    status: 'active',
    joined: '2023-10-15',
  },
  {
    id: 'user-008',
    name: 'Noor Al-Otaibi',
    email: 'noor.otaibi@electronics.ae',
    type: 'buyer',
    company: 'Riyadh Electronics Ltd',
    country: 'Kuwait',
    status: 'active',
    joined: '2024-02-10',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(demoUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buyer' | 'supplier' | 'manufacturer'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const itemsPerPage = 10;

  const countries = ['all', ...new Set(users.map(u => u.country))];

  const filtered = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || user.type === filterType;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesCountry = filterCountry === 'all' || user.country === filterCountry;

      return matchesSearch && matchesType && matchesStatus && matchesCountry;
    });
  }, [users, searchTerm, filterType, filterStatus, filterCountry]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSuspend = (id: string) => {
    setUsers(users.map(u => (u.id === id ? { ...u, status: 'suspended' } : u)));
  };

  const handleActivate = (id: string) => {
    setUsers(users.map(u => (u.id === id ? { ...u, status: 'active' } : u)));
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const typeColors = {
    buyer: 'bg-blue-500/20 text-blue-400',
    supplier: 'bg-green-500/20 text-green-400',
    manufacturer: 'bg-purple-500/20 text-purple-400',
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    suspended: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
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
            <p className="text-gray-400">Manage all platform users</p>
          </div>
          <button className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            + Add User
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
            />
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
                Export
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">User Type</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Types</option>
                <option value="buyer">Buyers</option>
                <option value="supplier">Suppliers</option>
                <option value="manufacturer">Manufacturers</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Country</label>
              <select
                value={filterCountry}
                onChange={(e) => {
                  setFilterCountry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Results</label>
              <div className="bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm">
                {filtered.length} users
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0c0f14] border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Type</th>
                  <th className="text-left py-4 px-6">Company</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Joined</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#0c0f14]' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-white font-semibold">{user.name}</td>
                    <td className="py-4 px-6 text-gray-300">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2 py-1 rounded ${typeColors[user.type]}`}>
                        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{user.company}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[user.status]}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">{user.joined}</td>
                    <td className="py-4 px-6 text-right space-x-2 flex justify-end gap-2">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs"
                      >
                        View
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="px-3 py-1 text-yellow-400 hover:text-yellow-300 text-xs"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id)}
                          className="px-3 py-1 text-green-400 hover:text-green-300 text-xs"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-[#c41e3a] text-white'
                    : 'border border-[#242830] text-white hover:bg-[#242830]'
                }`}
              >
                {page}
              </button>
            ))}
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
                  <p className="text-white font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-white">{selectedUser.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className={`${statusColors[selectedUser.status]}`}>
                      {selectedUser.status}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Company</p>
                  <p className="text-white">{selectedUser.company}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Country</p>
                    <p className="text-white">{selectedUser.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Joined</p>
                    <p className="text-white">{selectedUser.joined}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    Save Changes
                  </button>
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
