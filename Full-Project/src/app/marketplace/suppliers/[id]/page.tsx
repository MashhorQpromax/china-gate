'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface SupplierProfile {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  company_name: string;
  country: string;
  city: string;
  phone: string;
  avatar_url: string;
  bio: string;
  role: string;
  created_at: string;
  verification: {
    verification_level: string;
    is_verified: boolean;
    verified_at: string;
    business_license_verified: boolean;
    quality_cert_verified: boolean;
  } | null;
  stats: {
    totalProducts: number;
    completedDeals: number;
    avgRating: number;
    totalReviews: number;
  };
}

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  price: number;
  currency: string;
  moq: number;
  unit: string;
  lead_time_days: number;
  origin_country: string;
  sample_available: boolean;
  main_image_url: string;
  rating_avg: number;
  rating_count: number;
  view_count: number;
  order_count: number;
  category_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

export default function SupplierProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params.id as string;

  const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user?.id || data?.data?.id) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const fetchSupplier = useCallback(async () => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort_by: sortBy,
      });
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory) params.set('category_id', selectedCategory);

      const res = await fetch(`/api/suppliers/${supplierId}?${params}`);
      if (!res.ok) {
        if (res.status === 404) {
          setSupplier(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setSupplier(data.supplier);
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalProducts(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to load supplier:', err);
    } finally {
      setLoading(false);
      setProductsLoading(false);
    }
  }, [supplierId, currentPage, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleContactSupplier = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipient_id: supplierId,
          content: `Hi, I'm interested in your products. I'd like to discuss business opportunities.`,
        }),
      });
      if (res.ok) {
        router.push('/messages');
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency || 'USD'} ${price?.toLocaleString() || '0'}`;
  };

  const getVerificationBadge = (verification: SupplierProfile['verification']) => {
    if (!verification?.is_verified) return null;
    const level = verification.verification_level;
    const colors: Record<string, string> = {
      gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
      bronze: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      basic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[level] || colors.basic}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Verified'}
      </span>
    );
  };

  const memberSince = supplier?.created_at
    ? new Date(supplier.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Skeleton header */}
          <div className="bg-[#12151c] border border-[#1e2230] rounded-xl p-8 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-[#1a1d23] rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-[#1a1d23] rounded w-1/3" />
                <div className="h-4 bg-[#1a1d23] rounded w-1/4" />
                <div className="h-4 bg-[#1a1d23] rounded w-1/2" />
              </div>
            </div>
          </div>
          {/* Skeleton products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#12151c] border border-[#1e2230] rounded-xl p-4 animate-pulse">
                <div className="w-full h-40 bg-[#1a1d23] rounded-lg mb-3" />
                <div className="h-4 bg-[#1a1d23] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#1a1d23] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Supplier Not Found</h1>
          <p className="text-gray-400 mb-4">This supplier profile does not exist or has been removed.</p>
          <Link href="/marketplace" className="text-[#c41e3a] hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-white">{supplier.company_name || supplier.full_name_en}</span>
        </nav>

        {/* Supplier Header Card */}
        <div className="bg-[#12151c] border border-[#1e2230] rounded-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#c41e3a] flex items-center justify-center text-3xl font-bold flex-shrink-0 overflow-hidden">
              {supplier.avatar_url ? (
                <img src={supplier.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (supplier.company_name || supplier.full_name_en || 'S').charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {supplier.company_name || supplier.full_name_en}
                </h1>
                {getVerificationBadge(supplier.verification)}
              </div>

              {supplier.full_name_en && supplier.company_name && (
                <p className="text-gray-400 text-sm mb-1">{supplier.full_name_en}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                {(supplier.city || supplier.country) && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {memberSince && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Member since {memberSince}
                  </span>
                )}
              </div>

              {supplier.bio && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{supplier.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{supplier.stats.totalProducts}</div>
                  <div className="text-xs text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{supplier.stats.completedDeals}</div>
                  <div className="text-xs text-gray-400">Completed Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#d4a843]">
                    {supplier.stats.avgRating > 0 ? `${supplier.stats.avgRating}/5` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {supplier.stats.totalReviews > 0 ? `${supplier.stats.totalReviews} Reviews` : 'No Reviews'}
                  </div>
                </div>
                {supplier.verification?.is_verified && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">Verified</div>
                    <div className="text-xs text-gray-400">
                      {[
                        supplier.verification.business_license_verified && 'License',
                        supplier.verification.quality_cert_verified && 'Quality',
                      ].filter(Boolean).join(' + ') || 'Supplier'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleContactSupplier}
                className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {isLoggedIn ? 'Contact Supplier' : 'Login to Contact'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-[#12151c] border border-[#1e2230] rounded-xl p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${!selectedCategory ? 'text-[#c41e3a] bg-[#c41e3a]/10' : 'text-gray-400 hover:text-white'}`}
                >
                  All ({totalProducts})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${selectedCategory === cat.id ? 'text-[#c41e3a] bg-[#c41e3a]/10' : 'text-gray-400 hover:text-white'}`}
                  >
                    {cat.name_en}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#1e2230] mt-4 pt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-[#0a0d14] border border-[#242830] rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="created_at">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search this supplier's products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#12151c] border border-[#1e2230] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
              />
            </div>

            {/* Products Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
              </p>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-[#12151c] border border-[#1e2230] rounded-xl p-4 animate-pulse">
                    <div className="w-full h-40 bg-[#1a1d23] rounded-lg mb-3" />
                    <div className="h-4 bg-[#1a1d23] rounded w-3/4 mb-2" />
                    <div className="h-4 bg-[#1a1d23] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <p className="text-lg mb-1">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map(product => (
                    <Link
                      key={product.id}
                      href={`/marketplace/products/${product.id}`}
                      className="bg-[#12151c] border border-[#1e2230] rounded-xl overflow-hidden hover:border-[#c41e3a]/40 transition-all group"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-[#1a1d23] overflow-hidden">
                        {product.main_image_url ? (
                          <img
                            src={product.main_image_url}
                            alt={product.name_en}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        {product.sample_available && (
                          <span className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Sample
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-[#c41e3a] transition-colors">
                          {product.name_en}
                        </h3>
                        <div className="text-[#d4a843] font-bold text-sm">
                          {formatPrice(product.price, product.currency)}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>MOQ: {product.moq} {product.unit || 'pcs'}</span>
                          {product.rating_avg > 0 && (
                            <span className="flex items-center gap-0.5 text-yellow-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              {product.rating_avg}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 bg-[#12151c] border border-[#1e2230] rounded-lg text-sm disabled:opacity-30 hover:border-[#c41e3a]/40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 bg-[#12151c] border border-[#1e2230] rounded-lg text-sm disabled:opacity-30 hover:border-[#c41e3a]/40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
