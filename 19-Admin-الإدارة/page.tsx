'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Product {
  id: string;
  name: string;
  supplier: string;
  category: string;
  price: number;
  status: 'active' | 'pending' | 'rejected';
  featured: boolean;
  date: string;
}

const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Carbon Steel Flat Sheets',
    supplier: 'Zhejiang Steel Manufacturing',
    category: 'Steel & Metals',
    price: 450,
    status: 'active',
    featured: true,
    date: '2024-03-15',
  },
  {
    id: 'prod-002',
    name: 'Electronic Capacitors',
    supplier: 'Shanghai Electronics Components',
    category: 'Electronics',
    price: 2.5,
    status: 'active',
    featured: true,
    date: '2024-03-14',
  },
  {
    id: 'prod-003',
    name: 'LED Components Pack',
    supplier: 'Shanghai Electronics Components',
    category: 'Electronics',
    price: 15,
    status: 'pending',
    featured: false,
    date: '2024-03-20',
  },
  {
    id: 'prod-004',
    name: 'Solar Panels 400W',
    supplier: 'Jiangsu Solar Panel Manufacturing',
    category: 'Solar & Renewable',
    price: 200,
    status: 'active',
    featured: false,
    date: '2024-03-10',
  },
  {
    id: 'prod-005',
    name: 'Power Supply Unit 500W',
    supplier: 'Shanghai Electronics Components',
    category: 'Electronics',
    price: 75,
    status: 'rejected',
    featured: false,
    date: '2024-03-18',
  },
  {
    id: 'prod-006',
    name: 'Stainless Steel Coils',
    supplier: 'Zhejiang Steel Manufacturing',
    category: 'Steel & Metals',
    price: 550,
    status: 'active',
    featured: false,
    date: '2024-03-12',
  },
  {
    id: 'prod-007',
    name: 'Circuit Board Assembly',
    supplier: 'Shanghai Electronics Components',
    category: 'Electronics',
    price: 125,
    status: 'pending',
    featured: false,
    date: '2024-03-21',
  },
  {
    id: 'prod-008',
    name: 'Copper Wire (MM2)',
    supplier: 'Zhejiang Steel Manufacturing',
    category: 'Raw Materials',
    price: 10,
    status: 'active',
    featured: false,
    date: '2024-03-08',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filtered = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (id: string) => {
    setProducts(products.map(p => (p.id === id ? { ...p, status: 'active' } : p)));
  };

  const handleReject = (id: string) => {
    setProducts(products.map(p => (p.id === id ? { ...p, status: 'rejected' } : p)));
  };

  const handleToggleFeatured = (id: string) => {
    setProducts(
      products.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    rejected: 'bg-red-500/20 text-red-400',
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
            <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
            <p className="text-gray-400">Approve or reject product listings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search products or suppliers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
            />
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <p className="text-gray-400 text-sm">{filtered.length} products found</p>
        </div>

        {/* Products Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0c0f14] border-b border-[#242830]">
                <tr className="text-gray-400">
                  <th className="text-left py-4 px-6">Product</th>
                  <th className="text-left py-4 px-6">Supplier</th>
                  <th className="text-left py-4 px-6">Category</th>
                  <th className="text-right py-4 px-6">Price</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-center py-4 px-6">Featured</th>
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#0c0f14]' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-white font-semibold">{product.name}</td>
                    <td className="py-4 px-6 text-gray-300">{product.supplier}</td>
                    <td className="py-4 px-6 text-gray-300">{product.category}</td>
                    <td className="py-4 px-6 text-right text-gray-300">${product.price}</td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[product.status]}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`text-lg ${product.featured ? '⭐' : '☆'}`}
                        title="Toggle featured"
                      >
                        {product.featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">{product.date}</td>
                    <td className="py-4 px-6 text-right space-x-2 flex justify-end gap-2">
                      {product.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="px-3 py-1 text-green-400 hover:text-green-300 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(product.id)}
                            className="px-3 py-1 text-red-400 hover:text-red-300 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-blue-400 hover:text-blue-300 text-xs"
                      >
                        View
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
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Product Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Product Name</p>
                  <p className="text-white font-semibold">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Supplier</p>
                  <p className="text-white">{selectedProduct.supplier}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price</p>
                    <p className="text-white">${selectedProduct.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className={`text-sm ${statusColors[selectedProduct.status]}`}>
                      {selectedProduct.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Featured</p>
                    <p className="text-white">{selectedProduct.featured ? 'Yes ⭐' : 'No'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedProduct.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedProduct.id);
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedProduct.id);
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
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
