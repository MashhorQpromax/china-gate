/** @type {import('next').NextConfig} */

// Uncomment and configure PWA when @ducanh2912/next-pwa is installed
// const withPWA = require('@ducanh2912/next-pwa').default({
//   dest: 'public',
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   swcMinify: true,
//   disable: process.env.NODE_ENV === 'development',
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// })

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Skip TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization domains
  images: {
    domains: [
      'localhost',
      'api.example.com',
      // Add production domains here
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects configuration
  async redirects() {
    return [
      // Add redirects here
    ]
  },

  // Rewrites configuration
  async rewrites() {
    return {
      beforeFiles: [
        // Add rewrites here
      ],
    }
  },

  // Webpack configuration for optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },
      }
    }
    return config
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'China Gate',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Industrial sourcing platform connecting Chinese factories with Gulf businesses',
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Experimental features (optional, use with caution)
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
}

// Uncomment to enable PWA
// module.exports = withPWA(nextConfig)

module.exports = nextConfig
