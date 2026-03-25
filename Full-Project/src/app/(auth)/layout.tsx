import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CHINA GATE - Authentication',
  description: 'China Gate - Gulf to China Trade Platform',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <body className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #c41e3a, #c41e3a 10px, transparent 10px, transparent 20px)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative w-full max-w-md">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🇨🇳 CHINA GATE 🇸🇦
            </h1>
            <p className="text-2xl text-red-500 font-bold mb-1">
              بوابة الصين
            </p>
            <p className="text-gray-400 text-sm">
              Trade, Connect, Grow
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-8 backdrop-blur-sm">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-gray-500">
            <p>© 2024 CHINA GATE. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
