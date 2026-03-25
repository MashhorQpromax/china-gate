'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ShippingCompany {
  id: string;
  name: string;
  country: string;
  routes: string[];
  avgPrice: number;
  rating: number;
  status: 'active' | 'inactive';
}

const demoCompanies: ShippingCompany[] = [
  {
    id: 'ship-001',
    name: 'DHL Express',
    country: 'Global',
    routes: ['China-UAE', 'China-Saudi Arabia', 'China-Egypt'],
    avgPrice: 2500,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'ship-002',
    name: 'FedEx International',
    country: 'USA',
    routes: ['China-USA', 'China-Europe', 'China-UAE'],
    avgPrice: 3200,
    rating: 4.6,
    status: 'active',
  },
  {
    id: 'ship-003',
    name: 'CMA CGM',
    country: 'France',
    routes: ['China-Middle East', 'China-Africa', 'China-Europe'],
    avgPrice: 2200,
    rating: 4.5,
    status: 'active',
  },
  {
    id: 'ship-004',
    name: 'Maersk Line',
    country: 'Denmark',
    routes: ['China-Worldwide'],
    avgPrice: 2800,
    rating: 4.9,
    status: 'active',
  },
  {
    id: 'ship-005',
    name: 'local Freight Co',
    country: 'Saudi Arabia',
    routes: ['UAE-Saudi Arabia', 'UAE-Kuwait'],
    avgPrice: 800,
    rating: 4.2,
    status: 'inactive',
  },
];

export default function AdminShippingPage() {
  const [companies, setCompanies] = useState(demoCompanies);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<ShippingCompany>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    country: '',
    avgPrice: '',
  });

  const handleToggleStatus = (id: string) => {
    setCompanies(
      companies.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      )
    );
  };

  const handleStartEdit = (company: ShippingCompany) => {
    setEditingId(company.id);
    setEditingData(company);
  };

  const handleSaveEdit = () => {
    if (editingId && editingData.name && editingData.avgPrice) {
      setCompanies(
        companies.map(c =>
          c.id === editingId ? { ...c, ...editingData } : c
        )
      );
      setEditingId(null);
      setEditingData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.country && newCompany.avgPrice) {
      const company: ShippingCompany = {
        id: `ship-${Date.now()}`,
        name: newCompany.name,
        country: newCompany.country,
        routes: [],
        avgPrice: parseInt(newCompany.avgPrice),
        rating: 0,
        status: 'active',
      };
      setCompanies([...companies, company]);
      setNewCompany({ name: '', country: '', avgPrice: '' });
      setShowAddForm(false);
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">Shipping Management</h1>
            <p className="text-gray-400">Manage shipping companies and routes</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            + Add Company
          </button>
        </div>

        {/* Add Company Form */}
        {showAddForm && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Shipping Company</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Company Name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
              <input
                type="text"
                placeholder="Country"
                value={newCompany.country}
                onChange={(e) => setNewCompany({ ...newCompany, country: e.target.value })}
                className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
              <input
                type="number"
                placeholder="Average Price"
                value={newCompany.avgPrice}
                onChange={(e) => setNewCompany({ ...newCompany, avgPrice: e.target.value })}
                className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddCompany}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map(company => (
            <div
              key={company.id}
              className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors"
            >
              {editingId === company.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingData.name || ''}
                    onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={editingData.country || ''}
                    onChange={(e) => setEditingData({ ...editingData, country: e.target.value })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-2 text-white"
                  />
                  <input
                    type="number"
                    value={editingData.avgPrice || ''}
                    onChange={(e) => setEditingData({ ...editingData, avgPrice: parseInt(e.target.value) })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-2 text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-white mb-1">{company.name}</p>
                      <p className="text-gray-400 text-sm">{company.country}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded ${
                        company.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {company.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">Average Price</p>
                      <p className="text-white font-semibold">${company.avgPrice}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">Rating</p>
                      <p className="text-white font-semibold">{company.rating} ⭐</p>
                    </div>
                  </div>

                  {company.routes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Routes</p>
                      <div className="flex flex-wrap gap-2">
                        {company.routes.map((route, idx) => (
                          <span
                            key={idx}
                            className="bg-[#0c0f14] border border-[#242830] text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(company)}
                      className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(company.id)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
                        company.status === 'active'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {company.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
