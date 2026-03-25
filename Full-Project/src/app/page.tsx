'use client';


// This is a placeholder that will render a landing page component
// For now, it simply displays a basic welcome message and navigation

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0c0f14] bg-opacity-80 backdrop-blur-md border-b border-[#242830]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🇨🇳🇸🇦</div>
              <h1 className="text-xl font-bold text-white hidden sm:block">China Gate</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Login
              </a>
              <a
                href="/register"
                className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Connect with <span className="text-[#c41e3a]">China</span> & <span className="text-[#d4a843]">Saudi Arabia</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The ultimate B2B marketplace connecting importers, exporters, and strategic partners across continents.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/register"
              className="px-8 py-3 bg-[#c41e3a] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/marketplace"
              className="px-8 py-3 border-2 border-[#d4a843] text-[#d4a843] rounded-lg font-semibold hover:bg-[#d4a843] hover:text-black transition-colors"
            >
              Explore Marketplace
            </a>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1d23] border-t border-b border-[#242830]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose China Gate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#0c0f14] rounded-xl border border-[#242830]">
              <div className="text-3xl mb-4">🌍</div>
              <h4 className="text-xl font-semibold mb-3">Global Reach</h4>
              <p className="text-gray-400">
                Connect with verified traders from China and Saudi Arabia in one unified platform.
              </p>
            </div>
            <div className="p-6 bg-[#0c0f14] rounded-xl border border-[#242830]">
              <div className="text-3xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-3">Secure Transactions</h4>
              <p className="text-gray-400">
                Trade with confidence using our advanced escrow and dispute resolution systems.
              </p>
            </div>
            <div className="p-6 bg-[#0c0f14] rounded-xl border border-[#242830]">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-3">Analytics Dashboard</h4>
              <p className="text-gray-400">
                Track deals, shipments, and partnerships with comprehensive real-time analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0c0f14] border-t border-[#242830] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2024 China Gate. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
