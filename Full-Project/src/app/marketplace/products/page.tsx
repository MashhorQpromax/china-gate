'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/marketplace/ProductCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  product_count: number;
}

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  base_price: number;
  currency: string;
  moq: number;
  moq_unit: string;
  avg_rating: number;
  review_count: number;
  view_count: number;
  order_count: number;
  certifications: string[];
  origin_country: string;
  main_image_url: string;
  status: string;
  featured: boolean;
  brand_name: string;
  short_description_en: string;
  categories?: { name_en: string; name_ar: string; slug: string };
  supplier_id: string;
}

type SortOption = 'newest' | 'price_low' | 'price_high' | 'rating' | 'popular';

export default function ProductsMarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const itemsPerPage = viewMode === 'grid' ? 12 : 10;

  // Check if user is logged in
  useEffect(() => {
    const hasToken = document.cookie.includes('access_token=');
    setIsLoggedIn(hasToken);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: 'active',
      });

      if (selectedCategory) params.set('category_id', selectedCategory);
      if (searchTerm) params.set('search', searchTerm);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);

      // Map sort options to API params
      switch (sortBy) {
        case 'price_low':
          params.set('sort_by', 'price');
          params.set('sort_order', 'asc');
          break;
        case 'price_high':
          params.set('sort_by', 'price');
          params.set('sort_order', 'desc');
          break;
        case 'rating':
          params.set('sort_by', 'rating');
          break;
        case 'popular':
          params.set('sort_by', 'popular');
          break;
        default:
          params.set('sort_by', 'created_at');
      }

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
  }, [currentPage, itemsPerPage, selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <DashboardLayout
      user={isLoggedIn ? { name: 'User', initials: 'U' } : { name: 'Guest', initials: 'G' }}
      isAuthenticated={isLoggedIn}
      onLogin={() => router.push('/login')}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Product Marketplace</h1>
            <p className="text-gray-400">
              {totalProducts > 0
                ? `Browse ${totalProducts} verified products from trusted suppliers`
                : 'Browse verified suppliers and products'}
            </p>
          </div>
          <Link
            href={isLoggedIn ? '/marketplace/requests' : '/login?redirect=/marketplace/requests'}
            className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            + Submit RFQ
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products, suppliers, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1d23] border border-[#242830] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-[#1a1d23] border border-[#242830] rounded-lg p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#c41e3a] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#c41e3a] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                List
              </button>
            </div>

            {/* Category Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Category</h3>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <input
                  type="radio"
                  checked={selectedCategory === ''}
                  onChange={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 accent-[#c41e3a]"
                />
                <span className="text-gray-300">All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCategory === cat.id}
                    onChange={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">
                    {cat.name_en}
                    {cat.product_count > 0 && (
                      <span className="text-gray-500 ml-1">({cat.product_count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {/* Price Range Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Price Range (USD)</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-[#c41e3a] outline-none"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-[#c41e3a] outline-none"
                />
              </div>
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setCurrentPage(1);
                  }}
                  className="text-xs text-[#c41e3a] hover:text-red-400 transition-colors"
                >
                  Clear price filter
                </button>
              )}
            </div>

            {/* Sort (mobile-friendly duplicate) */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3 lg:hidden">
              <h3 className="font-semibold text-white">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-gray-400">
                  {loading ? 'Loading...' : `Showing ${totalProducts} product${totalProducts !== 1 ? 's' : ''}`}
                </p>
                {(selectedCategory || searchTerm || minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchTerm('');
                      setMinPrice('');
                      setMaxPrice('');
                      setCurrentPage(1);
                    }}
                    className="text-xs text-[#c41e3a] hover:text-red-400 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="hidden lg:block bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 animate-pulse">
                    <div className="bg-[#242830] h-48 rounded-lg mb-4" />
                    <div className="bg-[#242830] h-4 rounded w-3/4 mb-2" />
                    <div className="bg-[#242830] h-4 rounded w-1/2 mb-4" />
                    <div className="bg-[#242830] h-8 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      nameEn: product.name_en,
                      nameAr: product.name_ar || '',
                      priceRange: product.base_price
                        ? `$${product.base_price.toLocaleString()}`
                        : 'Contact for price',
                      moq: product.moq,
                      supplier: product.brand_name || 'Verified Supplier',
                      country: product.origin_country || 'China',
                      rating: product.avg_rating || 0,
                      certifications: product.certifications || [],
                      availableForPartnership: product.featured || false,
                      image: product.main_image_url,
                      description: product.short_description_en || '',
                    }}
                    isListView={viewMode === 'list'}
                  />
                ))}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
