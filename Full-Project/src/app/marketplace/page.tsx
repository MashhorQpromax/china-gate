'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name_en: string;
  base_price: number;
  currency: string;
  moq: number;
  moq_unit: string;
  main_image_url: string;
  avg_rating: number;
  review_count: number;
  brand_name: string;
  origin_country: string;
  short_description_en: string;
}

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  product_count?: number;
}

interface RFQ {
  id: string;
  title: string;
  quantity: number;
  max_budget: number | null;
  currency: string;
  status: string;
  quotation_count: number;
  created_at: string;
  profiles: { company_name: string; country: string } | null;
}

interface Supplier {
  id: string;
  full_name_en: string;
  company_name: string;
  country: string;
  city: string;
  avatar_url: string;
  productCount: number;
  verification: { is_verified: boolean; verification_level: string } | null;
}

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  textiles: '👔',
  machinery: '⚙️',
  food: '🍜',
  chemicals: '🧪',
  construction: '🏗️',
  automotive: '🚗',
  medical: '🏥',
};

export default function MarketplacePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentRfqs, setRecentRfqs] = useState<RFQ[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRfqs, setTotalRfqs] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user?.id || data?.data?.id) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded >= 5) setLoadingData(false); };

    // Fetch featured products
    fetch('/api/products?status=active&featured=true&limit=4')
      .then(r => r.json())
      .then(d => { setFeaturedProducts(d.products || []); setTotalProducts(d.pagination?.total || 0); })
      .catch(() => {})
      .finally(checkDone);

    // Fetch latest products
    fetch('/api/products?status=active&limit=8&sort_by=created_at&sort_order=desc')
      .then(r => r.json())
      .then(d => { setLatestProducts(d.products || []); if (d.pagination?.total) setTotalProducts(d.pagination.total); })
      .catch(() => {})
      .finally(checkDone);

    // Fetch categories
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || d || []))
      .catch(() => {})
      .finally(checkDone);

    // Fetch recent RFQs
    fetch('/api/rfq?limit=5')
      .then(r => r.json())
      .then(d => { setRecentRfqs(d.data || []); setTotalRfqs(d.pagination?.total || d.data?.length || 0); })
      .catch(() => {})
      .finally(checkDone);

    // Fetch top suppliers
    fetch('/api/suppliers?limit=6')
      .then(r => r.json())
      .then(d => setTopSuppliers(d.suppliers || []))
      .catch(() => {})
      .finally(checkDone);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getRandomColor = (id: string) => {
    const colors = ['#8B0000', '#C41E3A', '#D4A843', '#1a1d23', '#242830'];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <DashboardLayout
      user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }}
      isAuthenticated={isLoggedIn}
      onLogin={() => router.push('/login')}
    >
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#c41e3a] to-[#d4a843] rounded-2xl p-8 md:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            China-Gulf Trade Marketplace
          </h1>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Connect with verified suppliers and buyers across the China-Gulf trade corridor
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, categories..."
              className="flex-1 bg-white/10 backdrop-blur border border-white/30 rounded-lg px-5 py-3 text-white placeholder-white/60 focus:border-white outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#c41e3a] rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-6 text-white/80 text-sm">
            <span>{totalProducts > 0 ? `${totalProducts}+` : '...'} Products</span>
            <span>|</span>
            <span>{categories.length || '...'} Categories</span>
            <span>|</span>
            <span>{totalRfqs > 0 ? `${totalRfqs}+` : '...'} Active RFQs</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/marketplace/products"
            className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#c41e3a] transition-colors group"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#c41e3a] transition-colors">
              Browse Products
            </h3>
            <p className="text-gray-400 text-sm">
              Explore products from verified Chinese suppliers
            </p>
          </Link>
          <Link
            href="/marketplace/requests"
            className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#d4a843] transition-colors group"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#d4a843] transition-colors">
              Purchase Requests
            </h3>
            <p className="text-gray-400 text-sm">
              View and respond to buying opportunities from Gulf buyers
            </p>
          </Link>
          <Link
            href={isLoggedIn ? '/marketplace/requests/new' : '/login?redirect=/marketplace/requests/new'}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-[#d4a843] transition-colors group"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#d4a843] transition-colors">
              Post RFQ
            </h3>
            <p className="text-gray-400 text-sm">
              Submit a purchase request and receive quotes from suppliers
            </p>
          </Link>
          <Link
            href="/marketplace/inquiry-cart"
            className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 hover:border-blue-500 transition-colors group"
          >
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
              Inquiry Cart
            </h3>
            <p className="text-gray-400 text-sm">
              Review and send inquiries to suppliers
            </p>
          </Link>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Categories</h2>
            <Link href="/marketplace/categories" className="text-[#d4a843] text-sm hover:underline">
              Browse All Categories →
            </Link>
          </div>
          {loadingData && categories.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 text-center animate-pulse">
                  <div className="w-8 h-8 bg-[#242830] rounded mx-auto mb-2" />
                  <div className="h-4 bg-[#242830] rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map(cat => (
                <Link
                  key={cat.id}
                  href={`/marketplace/products?category=${cat.id}`}
                  className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 text-center hover:border-[#c41e3a] transition-colors group"
                >
                  <div className="text-2xl mb-2">
                    {categoryIcons[cat.slug] || '📦'}
                  </div>
                  <p className="text-white text-sm font-medium group-hover:text-[#c41e3a] transition-colors">
                    {cat.name_en}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Products */}
        {(loadingData || featuredProducts.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Featured Products</h2>
              <Link href="/marketplace/products" className="text-[#d4a843] text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loadingData && featuredProducts.length === 0 ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-square bg-[#242830]" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-[#242830] rounded w-3/4" />
                      <div className="h-4 bg-[#242830] rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : featuredProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/marketplace/products/${product.id}`}
                  className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden hover:border-[#d4a843] transition-colors group"
                >
                  <div className="aspect-square relative overflow-hidden">
                    {product.main_image_url ? (
                      <img src={product.main_image_url} alt={product.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold px-3 text-center"
                        style={{ background: `linear-gradient(135deg, ${getRandomColor(product.id)}40, ${getRandomColor(product.id)})` }}>
                        {product.name_en.slice(0, 40)}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#d4a843] text-[#0c0f14] rounded text-xs font-bold">
                      Featured
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">{product.name_en}</h3>
                    <p className="text-[#d4a843] font-bold text-sm">
                      ${product.base_price?.toLocaleString()}
                      <span className="text-gray-500 font-normal text-xs"> / {product.moq_unit || 'unit'}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-xs">MOQ: {product.moq}</span>
                      {product.avg_rating > 0 && (
                        <span className="text-yellow-400 text-xs">
                          {'★'.repeat(Math.round(product.avg_rating))} ({product.review_count})
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest Products */}
        {(loadingData || latestProducts.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Latest Products</h2>
              <Link href="/marketplace/products?sort_by=created_at" className="text-[#d4a843] text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/marketplace/products/${product.id}`}
                  className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden hover:border-[#c41e3a] transition-colors group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {product.main_image_url ? (
                      <img src={product.main_image_url} alt={product.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold px-2 text-center"
                        style={{ background: `linear-gradient(135deg, ${getRandomColor(product.id)}40, ${getRandomColor(product.id)})` }}>
                        {product.name_en.slice(0, 30)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">{product.name_en}</h3>
                    <p className="text-[#d4a843] font-bold text-sm">
                      ${product.base_price?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">MOQ: {product.moq} {product.moq_unit}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Suppliers */}
        {topSuppliers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Top Suppliers</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {topSuppliers.map(supplier => (
                <Link
                  key={supplier.id}
                  href={`/marketplace/suppliers/${supplier.id}`}
                  className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 text-center hover:border-[#c41e3a]/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#c41e3a] flex items-center justify-center text-xl font-bold mx-auto mb-2 overflow-hidden">
                    {supplier.avatar_url ? (
                      <img src={supplier.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (supplier.company_name || supplier.full_name_en || 'S').charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-[#c41e3a] transition-colors line-clamp-1">
                    {supplier.company_name || supplier.full_name_en}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{supplier.country || 'China'}</p>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-400">{supplier.productCount} products</span>
                    {supplier.verification?.is_verified && (
                      <span className="text-[10px] text-green-400 font-medium">✓</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent RFQs */}
        {recentRfqs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Recent Purchase Requests</h2>
              <Link href="/marketplace/requests" className="text-[#d4a843] text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentRfqs.map(rfq => (
                <Link
                  key={rfq.id}
                  href={`/marketplace/requests/${rfq.id}`}
                  className="block bg-[#1a1d23] border border-[#242830] rounded-lg p-4 hover:border-[#d4a843] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{rfq.title}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-400">
                        <span>Qty: {rfq.quantity?.toLocaleString()}</span>
                        {rfq.max_budget && (
                          <span>Budget: ${rfq.max_budget.toLocaleString()} {rfq.currency}</span>
                        )}
                        {rfq.profiles && (
                          <span>{rfq.profiles.company_name} ({rfq.profiles.country})</span>
                        )}
                        <span>{rfq.quotation_count || 0} quotes</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rfq.status === 'open' ? 'bg-green-500/20 text-green-400' :
                      rfq.status === 'receiving_quotes' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {rfq.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {!isLoggedIn && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Start Trading Today
            </h2>
            <p className="text-gray-400 mb-6">
              Join ChinaGate to connect with verified suppliers and buyers
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
