import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, DM_Sans } from 'next/font/google';
import './globals.css';
import TrackingProvider from '@/lib/tracking/TrackingProvider';

// Font imports
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'China Gate — بوابة الصين',
  description: 'Connecting China and Saudi Arabia through seamless B2B trade, marketplace solutions, and strategic partnerships.',
  keywords: ['B2B', 'Trade', 'China', 'Saudi Arabia', 'Marketplace', 'Import Export'],
  authors: [{ name: 'China Gate' }],
  creator: 'China Gate',
  publisher: 'China Gate',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chinagate.example.com',
    siteName: 'China Gate',
    title: 'China Gate — بوابة الصين',
    description: 'Connecting China and Saudi Arabia through seamless B2B trade, marketplace solutions, and strategic partnerships.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexArabic.variable} ${dmSans.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
