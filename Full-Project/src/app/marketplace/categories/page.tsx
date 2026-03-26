'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string;
  description_ar: string;
  icon_url: string;
  image_url: string;
  parent_id: string | null;
  level: number;
  product_count?: number;
}

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'electronics': '🔌',
  'machinery': '⚙️',
  'textiles': '🧵',
  'chemicals': '🧪',
  'food': '🍜',
  'construction': '🏗️',
  'automotive': '🚗',
  'medical': '🏥',
  'furniture': '🪑',
  'packaging': '📦',
  'agriculture': '🌾',
  'energy': '⚡',
  'security': '🔒',
  'lighting': '💡',
  'tools': '🔧',
};

function getCategoryIcon(slug: string, name: string): string {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (slug?.includes(key) || name?.toLowerCase().includes(key)) {
      return icon;
    }
  }
  return '📁';
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        const cats: Category[] = catData.categories || [];

        // Fetch product counts per category
        const countRes = await fetch('/api/products?limit=1&status=active');
        const countData = await countRes.json();

        // For each category, get product count (batch approach)
        const countsPromises = cats.map(async (cat) => {
          const res = await fetch(`/api/products?category_id=${cat.id}&limit=1&status=active`);
          const data = await res.json();
          return { id: cat.id, count: data.pagination?.total || 0 };
        });

        const counts = await Promise.all(countsPromises);
        const countMap: Record<string, number> = {};
        counts.forEach(c => { countMap[c.id] = c.count; });

        setCategories(cats.map(cat => ({ ...cat, product_count: countMap[cat.id] || 0 })));
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Separate root and sub categories
  const rootCategories = categories.filter(c => !c.parent_id);
  const subCategories = categories.filter(c => c.parent_id);

  // Build tree
  const getChildren = (parentId: string) => subCategories.filter(c => c.parent_id === parentId);

  // Filter by search
  const filtered = searchTerm
    ? rootCategories.filter(c =>
        c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name_ar.includes(searchTerm) ||
        getChildren(c.id).some(sub =>
          sub.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.name_ar.includes(searchTerm)
        )
      )
    : rootCategories;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-[#1a1d23] rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#12151c] border border-[#1e2230] rounded-xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-[#1a1d23] rounded-lg mb-3" />
                <div className="h-5 bg-[#1a1d23] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#1a1d23] rounded w-1/2" />
              </div>
            ))}
          </div>
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
          <span className="text-white">Categories</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Browse Categories</h1>
            <p className="text-gray-400 mt-1">{rootCategories.length} categories with {categories.reduce((sum, c) => sum + (c.product_count || 0), 0)} products</p>
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 bg-[#12151c] border border-[#1e2230] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(category => {
            const children = getChildren(category.id);
            const totalProducts = (category.product_count || 0) + children.reduce((sum, c) => sum + (c.product_count || 0), 0);

            return (
              <div key={category.id} className="bg-[#12151c] border border-[#1e2230] rounded-xl overflow-hidden hover:border-[#c41e3a]/30 transition-all">
                {/* Category Header */}
                <Link
                  href={`/marketplace/products?category=${category.id}`}
                  className="block p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {getCategoryIcon(category.slug, category.name_en)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-white group-hover:text-[#c41e3a] transition-colors">
                        {category.name_en}
                      </h2>
                      {category.name_ar && (
                        <p className="text-sm text-gray-400" dir="rtl">{category.name_ar}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {totalProducts} product{totalProducts !== 1 ? 's' : ''}
                      </p>
                      {category.description_en && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{category.description_en}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-[#c41e3a] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>

                {/* Subcategories */}
                {children.length > 0 && (
                  <div className="border-t border-[#1e2230] px-6 py-3 bg-[#0e1118]">
                    <div className="flex flex-wrap gap-2">
                      {children.slice(0, 5).map(sub => (
                        <Link
                          key={sub.id}
                          href={`/marketplace/products?category=${sub.id}`}
                          className="text-xs px-2.5 py-1 bg-[#1a1d23] border border-[#242830] rounded-full text-gray-300 hover:text-[#c41e3a] hover:border-[#c41e3a]/40 transition-colors"
                        >
                          {sub.name_en}
                          {sub.product_count ? ` (${sub.product_count})` : ''}
                        </Link>
                      ))}
                      {children.length > 5 && (
                        <span className="text-xs text-gray-500 py-1">+{children.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No categories match your search</p>
            <button onClick={() => setSearchTerm('')} className="text-[#c41e3a] mt-2 hover:underline text-sm">Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
