'use client';

import { useState } from 'react';

// ============ SVG ICON COMPONENTS ============
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
);

const HandshakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14h2"/><path d="m3 3 7.5 7.5"/><path d="m7 13 2 2"/></svg>
);

const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
);

const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

// ============ CATEGORIES DATA ============
const categories = [
  { name: 'Steel & Metals', nameAr: 'حديد ومعادن', icon: '🏗️', count: '2,400+', href: '/marketplace/products' },
  { name: 'Electronics', nameAr: 'إلكترونيات', icon: '⚡', count: '5,100+', href: '/marketplace/products' },
  { name: 'Textiles', nameAr: 'منسوجات', icon: '🧵', count: '3,200+', href: '/marketplace/products' },
  { name: 'Machinery', nameAr: 'آلات ومعدات', icon: '⚙️', count: '1,800+', href: '/marketplace/products' },
  { name: 'Chemicals', nameAr: 'كيماويات', icon: '🧪', count: '900+', href: '/marketplace/products' },
  { name: 'Building Materials', nameAr: 'مواد بناء', icon: '🧱', count: '2,100+', href: '/marketplace/products' },
  { name: 'Auto Parts', nameAr: 'قطع سيارات', icon: '🔧', count: '1,500+', href: '/marketplace/products' },
  { name: 'Food & Beverage', nameAr: 'أغذية ومشروبات', icon: '🍵', count: '800+', href: '/marketplace/products' },
];

// ============ MAIN COMPONENT ============
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ======== TOP BAR ======== */}
      <div className="bg-slate-900 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="text-slate-400">Trusted by 12,000+ businesses across China & Gulf Region</span>
          <div className="flex items-center gap-4">
            <a href="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</a>
            <span className="text-slate-600">|</span>
            <button className="text-slate-400 hover:text-white transition-colors">العربية</button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">English</span>
          </div>
        </div>
      </div>

      {/* ======== HEADER / NAVIGATION ======== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CG</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">China Gate</h1>
                <p className="text-[10px] text-slate-500 leading-tight -mt-0.5">بوابة الصين</p>
              </div>
            </a>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, suppliers, or categories..."
                  className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors">
                  <SearchIcon />
                </button>
              </div>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-slate-600 hover:text-blue-700 font-medium transition-colors">
                Sign In
              </a>
              <a href="/register" className="bg-[#c41e3a] text-white text-sm py-2 px-5 rounded-lg font-semibold hover:bg-red-700 transition-all">
                Register Free
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ======== HERO SECTION ======== */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(196, 30, 58, 0.2) 0%, transparent 50%)'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-300 text-sm font-medium">12,000+ Active Businesses</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Gateway to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">China</span>
                {' '}&{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Gulf</span>
                {' '}Trade
              </h2>

              <p className="text-lg text-slate-300 mb-8 max-w-lg">
                The trusted B2B platform connecting verified Chinese manufacturers with Gulf region importers. Secure deals, manage logistics, and grow your business.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="/register" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                  Start Trading Free
                  <ArrowRightIcon />
                </a>
                <a href="/marketplace/products" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all">
                  Browse Products
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  <span>Verified Suppliers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Right Side - Stats Cards */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-blue-400 mb-3"><UsersIcon /></div>
                <div className="text-3xl font-bold text-white mb-1">12,000+</div>
                <div className="text-slate-400 text-sm">Registered Businesses</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-green-400 mb-3"><PackageIcon /></div>
                <div className="text-3xl font-bold text-white mb-1">50,000+</div>
                <div className="text-slate-400 text-sm">Products Listed</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-amber-400 mb-3"><DollarIcon /></div>
                <div className="text-3xl font-bold text-white mb-1">$2.4B+</div>
                <div className="text-slate-400 text-sm">Trade Volume</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-red-400 mb-3"><CheckCircleIcon /></div>
                <div className="text-3xl font-bold text-white mb-1">98.5%</div>
                <div className="text-slate-400 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CATEGORY GRID ======== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Browse by Category</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Explore thousands of verified products across major industrial categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{cat.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{cat.nameAr}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-blue-600 font-medium">{cat.count} products</span>
                  <ChevronRightIcon />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">How China Gate Works</h3>
            <p className="text-slate-500">From discovery to delivery in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Search & Discover', desc: 'Browse verified suppliers and products from China and Gulf region.', bgColor: '#dbeafe', textColor: '#1d4ed8' },
              { step: '02', title: 'Connect & Negotiate', desc: 'Message suppliers directly, request quotes, and negotiate terms.', bgColor: '#dcfce7', textColor: '#15803d' },
              { step: '03', title: 'Secure Payment', desc: 'Use our escrow system with Al-Rajhi Bank integration for safe transactions.', bgColor: '#fef3c7', textColor: '#b45309' },
              { step: '04', title: 'Track & Receive', desc: 'Monitor shipping, customs clearance, and quality inspection in real-time.', bgColor: '#fee2e2', textColor: '#b91c1c' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== FEATURES GRID ======== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Everything You Need to Trade</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              A complete ecosystem of tools designed for China-Gulf trade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <GlobeIcon />, title: 'B2B Marketplace', desc: 'Access 50,000+ verified products from Chinese factories and Gulf distributors.', color: '#1e40af' },
              { icon: <ShieldCheckIcon />, title: 'Escrow Protection', desc: 'Secure transactions with built-in escrow. Funds released only upon delivery confirmation.', color: '#15803d' },
              { icon: <TruckIcon />, title: 'Logistics Management', desc: 'End-to-end shipping tracking from Chinese ports to Saudi customs (FASAH integrated).', color: '#b45309' },
              { icon: <BankIcon />, title: 'Integrated Banking', desc: 'Al-Rajhi Bank integration for wire transfers, LC/LG, and currency conversion.', color: '#7c3aed' },
              { icon: <ClipboardCheckIcon />, title: 'Quality Assurance', desc: 'Third-party inspection services, dispute resolution, and quality certificates.', color: '#c41e3a' },
              { icon: <HandshakeIcon />, title: 'Strategic Partnerships', desc: 'Manufacturing partnerships, technology transfer, and training programs.', color: '#0369a1' },
            ].map((feature) => (
              <div key={feature.title} className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: feature.color + '10', color: feature.color }}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TRUST SECTION ======== */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">Why Businesses Trust China Gate</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built with security, transparency, and reliability at its core
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: '12,000+', label: 'Verified Businesses', detail: 'Across China, Saudi Arabia, UAE, Kuwait, Bahrain, Oman, and Qatar' },
              { stat: '$2.4B+', label: 'Trade Volume', detail: 'Facilitated since platform launch' },
              { stat: '98.5%', label: 'Satisfaction Rate', detail: 'Based on 25,000+ completed transactions' },
              { stat: '24/7', label: 'Support', detail: 'Bilingual customer service in Arabic, English, and Chinese' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{item.stat}</div>
                <div className="text-white font-semibold mb-1">{item.label}</div>
                <div className="text-xs text-slate-400">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TESTIMONIALS ======== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">What Our Traders Say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Mohammed Al-Rashid',
                company: 'Rashid Trading Co.',
                location: 'Riyadh, Saudi Arabia',
                text: 'China Gate transformed our sourcing process. We now connect directly with verified Chinese factories and save 30% on procurement costs.',
                rating: 5,
                initials: 'MR',
              },
              {
                name: 'Li Wei',
                company: 'Zhejiang Steel Manufacturing',
                location: 'Hangzhou, China',
                text: 'The platform opened up the entire Gulf market for us. The integrated banking and LC services make international trade seamless.',
                rating: 5,
                initials: 'LW',
              },
              {
                name: 'Fahad Al-Otaibi',
                company: 'Gulf Industrial Solutions',
                location: 'Jeddah, Saudi Arabia',
                text: 'The quality inspection and dispute resolution features give us complete confidence in every transaction. Excellent platform.',
                rating: 5,
                initials: 'FA',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.company} — {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA SECTION ======== */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow Your Business?</h3>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Join 12,000+ businesses already trading on China Gate. Create your free account today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg">
              Create Free Account
              <ArrowRightIcon />
            </a>
            <a href="/marketplace/products" className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all">
              Explore Marketplace
            </a>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">CG</span>
                </div>
                <span className="font-bold">China Gate</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The trusted B2B platform for China-Gulf trade. Connecting manufacturers, importers, and strategic partners.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h5 className="font-semibold text-white mb-4">Platform</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/marketplace/products" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="/deals" className="hover:text-white transition-colors">Deals</a></li>
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="/banking" className="hover:text-white transition-colors">Banking</a></li>
                <li><a href="/quality" className="hover:text-white transition-colors">Quality</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h5 className="font-semibold text-white mb-4">Services</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/lc" className="hover:text-white transition-colors">Letter of Credit</a></li>
                <li><a href="/lg" className="hover:text-white transition-colors">Letter of Guarantee</a></li>
                <li><a href="/customs" className="hover:text-white transition-colors">Customs Clearance</a></li>
                <li><a href="/partnerships/manufacturing" className="hover:text-white transition-colors">Partnerships</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="font-semibold text-white mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; 2024-2026 China Gate. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Riyadh, Saudi Arabia</span>
              <span>|</span>
              <span>Shanghai, China</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
