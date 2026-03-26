'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface SupplierProduct {
  id: string;
  name_en: string;
  name_ar: string;
  sku: string;
  base_price: number;
  currency: string;
  stock_quantity: number;
  stock_status: string;
  status: string;
  main_image_url: string;
  view_count: number;
  order_count: number;
  inquiry_count: number;
  avg_rating: number;
  review_count: number;
  featured: boolean;
  created_at: string;
  categories: { name_en: string } | null;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-600/20', text: 'text-green-400' },
  draft: { bg: 'bg-gray-600/20', text: 'text-gray-400' },
  pending_review: { bg: 'bg-yellow-600/20', text: 'text-yellow-400' },
  inactive: { bg: 'bg-orange-600/20', text: 'text-orange-400' },
  rejected: { bg: 'bg-red-600/20', text: 'text-red-400' },
  archived: { bg: 'bg-gray-800/40', text: 'text-gray-500' },
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  draft: 'Draft',
  pending_review: 'Pending Review',
  inactive: 'Inactive',
  rejected: 'Rejected',
  archived: 'Archived',
};

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, page]);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      supplier_id: 'me',
    });
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    }

    fetch(`/api/products?${params}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotal(data.pagination.total || 0);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch {
      // handle error silently
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to archive "${productName}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch {
      // handle error silently
    }
  };

  const getRandomColor = (id: string) => {
    const colors = ['#8B0000', '#C41E3A', '#D4A843', '#1a1d23', '#242830'];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  return (
    <DashboardLayout user={{ name: 'Supplier', initials: 'S' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Products</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your product catalog ({total} products)
            </p>
          </div>
          <Link
            href="/dashboard/supplier/products/new"
            className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1d23] border border-[#242830] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#242830] text-white rounded-lg hover:bg-[#2a2f38] transition-colors"
            >
              Search
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2.5 text-white focus:border-[#c41e3a] outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="inactive">Inactive</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-[#242830] rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-[#242830] rounded w-1/3" />
                    <div className="h-4 bg-[#242830] rounded w-1/4" />
                    <div className="h-4 bg-[#242830] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
            <p className="text-gray-400 mb-6">
              Start building your catalog by adding your first product
            </p>
            <Link
              href="/dashboard/supplier/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <span className="text-lg">+</span>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 hover:border-[#3a3f48] transition-colors"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#242830]">
                    {product.main_image_url && product.main_image_url.startsWith('http') ? (
                      <img
                        src={product.main_image_url}
                        alt={product.name_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getRandomColor(product.id)}40 0%, ${getRandomColor(product.id)} 100%)`,
                        }}
                      >
                        <span className="text-xs font-bold text-white opacity-80 text-center px-1">
                          {product.name_en.substring(0, 15)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-semibold truncate">
                            {product.name_en}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]?.bg || 'bg-gray-600/20'} ${statusColors[product.status]?.text || 'text-gray-400'}`}>
                            {statusLabels[product.status] || product.status}
                          </span>
                          {product.featured && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#d4a843]/20 text-[#d4a843]">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">
                          SKU: {product.sku} {product.categories ? `• ${product.categories.name_en}` : ''}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#d4a843] font-bold">
                          ${product.base_price?.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {product.currency || 'USD'}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>👁 {product.view_count || 0} views</span>
                      <span>📩 {product.inquiry_count || 0} inquiries</span>
                      <span>📦 {product.order_count || 0} orders</span>
                      {product.avg_rating > 0 && (
                        <span>⭐ {product.avg_rating} ({product.review_count})</span>
                      )}
                      <span className="text-gray-600">
                        Added {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href={`/marketplace/products/${product.id}`}
                        className="px-3 py-1 text-xs bg-[#242830] text-gray-300 rounded hover:bg-[#2a2f38] transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/supplier/products/${product.id}/edit`}
                        className="px-3 py-1 text-xs bg-[#242830] text-gray-300 rounded hover:bg-[#2a2f38] transition-colors"
                      >
                        Edit
                      </Link>
                      {product.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'pending_review')}
                          className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                        >
                          Submit for Review
                        </button>
                      )}
                      {product.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'inactive')}
                          className="px-3 py-1 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/30 transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                      {product.status === 'inactive' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'active')}
                          className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(product.id, product.name_en)}
                        className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors ml-auto"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-[#242830] text-white rounded disabled:opacity-40 hover:bg-[#2a2f38] transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm px-3">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-[#242830] text-white rounded disabled:opacity-40 hover:bg-[#2a2f38] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
