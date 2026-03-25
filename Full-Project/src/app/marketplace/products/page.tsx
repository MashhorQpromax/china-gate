'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/marketplace/ProductCard';
import { Currency, Incoterm } from '@/types';

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  priceMin: number;
  priceMax: number;
  currency: Currency;
  moq: number;
  category: string;
  supplier: {
    id: string;
    nameEn: string;
    country: string;
  };
  rating: number;
  certifications: string[];
  availableForPartnership: boolean;
  image?: string;
}

const demoProducts: Product[] = [
  {
    id: 'prod-001',
    nameEn: 'Carbon Steel Flat Sheets',
    nameAr: 'ألواح الفولاذ الكربوني المسطحة',
    priceMin: 450,
    priceMax: 650,
    currency: 'USD',
    moq: 5000,
    category: 'Steel & Metals',
    supplier: {
      id: 'company-003',
      nameEn: 'Zhejiang Steel Manufacturing',
      country: 'China',
    },
    rating: 4.8,
    certifications: ['ISO9001', 'ISO14001'],
    availableForPartnership: true,
  },
  {
    id: 'prod-002',
    nameEn: 'Stainless Steel Coils',
    nameAr: 'ملفات الفولاذ المقاوم للصدأ',
    priceMin: 550,
    priceMax: 750,
    currency: 'USD',
    moq: 3000,
    category: 'Steel & Metals',
    supplier: {
      id: 'company-003',
      nameEn: 'Zhejiang Steel Manufacturing',
      country: 'China',
    },
    rating: 4.9,
    certifications: ['ISO9001', 'ISO14001'],
    availableForPartnership: false,
  },
  {
    id: 'prod-003',
    nameEn: 'Electronic Capacitors',
    nameAr: 'المكثفات الإلكترونية',
    priceMin: 0.5,
    priceMax: 2.5,
    currency: 'USD',
    moq: 10000,
    category: 'Electronics',
    supplier: {
      id: 'company-005',
      nameEn: 'Shanghai Electronics Components',
      country: 'China',
    },
    rating: 4.7,
    certifications: ['ISO9001', 'CE', 'IATF'],
    availableForPartnership: true,
  },
  {
    id: 'prod-004',
    nameEn: 'Solar Panels 400W',
    nameAr: 'الألواح الشمسية 400 واط',
    priceMin: 180,
    priceMax: 220,
    currency: 'USD',
    moq: 200,
    category: 'Solar & Renewable',
    supplier: {
      id: 'company-006',
      nameEn: 'Jiangsu Solar Panel Manufacturing',
      country: 'China',
    },
    rating: 4.6,
    certifications: ['ISO9001', 'CE'],
    availableForPartnership: true,
  },
  {
    id: 'prod-005',
    nameEn: 'Copper Wire (MM2)',
    nameAr: 'سلك النحاس',
    priceMin: 8,
    priceMax: 12,
    currency: 'USD',
    moq: 1000,
    category: 'Raw Materials',
    supplier: {
      id: 'company-003',
      nameEn: 'Zhejiang Steel Manufacturing',
      country: 'China',
    },
    rating: 4.8,
    certifications: ['ISO9001'],
    availableForPartnership: false,
  },
];

const categories = ['All', 'Steel & Metals', 'Electronics', 'Solar & Renewable', 'Raw Materials'];
const incoterms = ['FOB', 'CIF', 'EXW', 'DDP'];

type SortOption = 'price_low' | 'price_high' | 'newest' | 'rating' | 'moq';

export default function ProductsMarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [moqRange, setMoqRange] = useState({ min: 0, max: 50000 });
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === 'grid' ? 12 : 10;

  const filtered = useMemo(() => {
    let result = demoProducts.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice =
        product.priceMin >= priceRange.min && product.priceMax <= priceRange.max;
      const matchesMOQ = product.moq >= moqRange.min && product.moq <= moqRange.max;
      const matchesCountry =
        selectedCountry === 'All' || product.supplier.country === selectedCountry;
      const matchesCertifications =
        selectedCertifications.length === 0 ||
        selectedCertifications.every(cert => product.certifications.includes(cert));
      const matchesSearch =
        product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameAr.includes(searchTerm) ||
        product.supplier.nameEn.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesCategory &&
        matchesPrice &&
        matchesMOQ &&
        matchesCountry &&
        matchesCertifications &&
        matchesSearch
      );
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.priceMin - b.priceMin;
        case 'price_high':
          return b.priceMax - a.priceMax;
        case 'rating':
          return b.rating - a.rating;
        case 'moq':
          return a.moq - b.moq;
        case 'newest':
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCategory, priceRange, moqRange, selectedCertifications, selectedCountry, sortBy, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const countries = ['All', ...new Set(demoProducts.map(p => p.supplier.country))];
  const allCertifications = Array.from(new Set(demoProducts.flatMap(p => p.certifications)));

  return (
    <DashboardLayout
      user={{ name: 'Buyer', initials: 'B' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Product Marketplace</h1>
            <p className="text-gray-400">Browse verified suppliers and products</p>
          </div>
          <button className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            + Add Product
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products, suppliers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
        />

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
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{cat}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Price Range (USD)</h3>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
            </div>

            {/* MOQ Range */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">MOQ Range</h3>
              <input
                type="number"
                placeholder="Min"
                value={moqRange.min}
                onChange={(e) => {
                  setMoqRange({ ...moqRange, min: parseInt(e.target.value) || 0 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={moqRange.max}
                onChange={(e) => {
                  setMoqRange({ ...moqRange, max: parseInt(e.target.value) || 50000 });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white text-sm"
              />
            </div>

            {/* Country Filter */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Country</h3>
              {countries.map(country => (
                <label key={country} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="radio"
                    checked={selectedCountry === country}
                    onChange={() => {
                      setSelectedCountry(country);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{country}</span>
                </label>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white">Certifications</h3>
              {allCertifications.map(cert => (
                <label key={cert} className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedCertifications.includes(cert)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCertifications([...selectedCertifications, cert]);
                      } else {
                        setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
                      }
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 accent-[#c41e3a]"
                  />
                  <span className="text-gray-300">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="moq">Lowest MOQ</option>
              </select>
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      nameEn: product.nameEn,
                      nameAr: product.nameAr,
                      priceRange: `$${product.priceMin}-$${product.priceMax}`,
                      moq: product.moq,
                      supplier: product.supplier.nameEn,
                      country: product.supplier.country,
                      rating: product.rating,
                      certifications: product.certifications,
                      availableForPartnership: product.availableForPartnership,
                    }}
                    isListView={viewMode === 'list'}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
                <p className="text-gray-400">No products found matching your filters.</p>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
