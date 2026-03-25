'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  brand_name: string;
  base_price: number;
  currency: string;
  status: string;
  featured: boolean;
  created_at: string;
  origin_country: string;
  supplier_id: string;
  categories?: { name_en: string; name_ar: string; slug: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  const itemsPerPage = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (filterStatus) params.set('status', filterStatus);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProducts(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusChange = async (productId: string, newStatus: string) => {
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p))
        );
        if (selectedProduct?.id === productId) {
          setSelectedProduct(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setActionLoading('');
    }
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, featured: !currentFeatured } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    } finally {
      setActionLoading('');
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    pending_review: 'bg-yellow-500/20 text-yellow-400',
    draft: 'bg-gray-500/20 text-gray-400',
    archived: 'bg-red-500/20 text-red-400',
    out_of_stock: 'bg-orange-500/20 text-orange-400',
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
            <p className="text-gray-400">
              {totalProducts > 0 ? `Managing ${totalProducts} products` : 'Approve or reject product listings'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0c0f14] border border-[#242830] rounded px-4 py-3 text-white focus:border-[#c41e3a] outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending_review">Pending Review</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-[#242830] rounded" />
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0c0f14] border-b border-[#242830]">
                  <tr className="text-gray-400">
                    <th className="text-left py-4 px-6">Product</th>
                    <th className="text-left py-4 px-6">Brand</th>
                    <th className="text-left py-4 px-6">Category</th>
                    <th className="text-right py-4 px-6">Price</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-center py-4 px-6">Featured</th>
                    <th className="text-left py-4 px-6">Date</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`border-b border-[#242830] hover:bg-[#242830] transition-colors ${
                        idx % 2 === 0 ? 'bg-[#0c0f14]' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-semibold">{product.name_en}</p>
                          {product.name_ar && (
                            <p className="text-gray-500 text-xs">{product.name_ar}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{product.brand_name || '-'}</td>
                      <td className="py-4 px-6 text-gray-300">{product.categories?.name_en || '-'}</td>
                      <td className="py-4 px-6 text-right text-gray-300">
                        ${product.base_price?.toLocaleString()} {product.currency}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[product.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {formatStatus(product.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          disabled={actionLoading === product.id}
                          className="text-lg"
                          title="Toggle featured"
                        >
                          {product.featured ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {product.status === 'pending_review' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(product.id, 'active')}
                                disabled={actionLoading === product.id}
                                className="px-3 py-1 text-green-400 hover:text-green-300 text-xs disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(product.id, 'archived')}
                                disabled={actionLoading === product.id}
                                className="px-3 py-1 text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
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
                  <p className="text-gray-400 text-sm mb-1">Product Name (EN)</p>
                  <p className="text-white font-semibold">{selectedProduct.name_en}</p>
                </div>
                {selectedProduct.name_ar && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Product Name (AR)</p>
                    <p className="text-white font-semibold">{selectedProduct.name_ar}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm mb-1">Brand</p>
                  <p className="text-white">{selectedProduct.brand_name || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white">{selectedProduct.categories?.name_en || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price</p>
                    <p className="text-white">${selectedProduct.base_price?.toLocaleString()} {selectedProduct.currency}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span className={`text-sm px-2 py-1 rounded ${statusColors[selectedProduct.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {formatStatus(selectedProduct.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Featured</p>
                    <p className="text-white">{selectedProduct.featured ? 'Yes ⭐' : 'No'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Origin</p>
                  <p className="text-white">{selectedProduct.origin_country || '-'}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedProduct.status === 'pending_review' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedProduct.id, 'active');
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedProduct.id, 'archived');
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
