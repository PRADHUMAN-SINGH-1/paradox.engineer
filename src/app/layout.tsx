import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AppShell from '@/components/AppShell';
import { getPublicTopics, getDealTypeCounts } from '@/lib/public-data';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Paradox – Curated Developer Perks, Cloud Credits & Software Deals',
    template: '%s | Paradox',
  },
  description: 'The curated index of verified digital discounts, developer cloud credits, AI token grants, and student savings. Updated daily.',
  keywords: [
    'developer discounts',
    'cloud credits',
    'promo codes',
    'coupon codes',
    'AI credits',
    'student discounts',
    'Vultr promo',
    'DigitalOcean credits',
    'Claude for OSS',
    'software deals',
    'free developer tiers',
    'startup grants',
  ],
  authors: [{ name: 'Paradox Engineering Team' }],
  creator: 'Paradox',
  publisher: 'Paradox',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Paradox – Curated Developer Perks & Cloud Credits',
    description: 'The curated index of developer discounts, cloud infrastructure credits, AI tokens, and student savings, updated daily.',
    url: SITE_URL,
    siteName: 'Paradox',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paradox – Curated Developer Perks & Cloud Credits',
    description: 'Curated index of software credits, cloud infrastructure perks, AI tokens, and developer discounts.',
    creator: '@paradoxengineer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let topics: Array<{
    name: string;
    slug: string;
    icon?: string | null;
    _count?: { deals: number };
  }> = [];

  let categoryCounts = {
    freebies: 10,
    discounts: 8,
    trials: 7,
    credits: 10,
    promoCodes: 1,
  };

  try {
    const [dbTopics, dbDealTypes] = await Promise.all([
      getPublicTopics(),
      getDealTypeCounts(),
    ]);

    topics = dbTopics;

    const counts = {
      freebies: 0,
      discounts: 0,
      trials: 0,
      credits: 0,
      promoCodes: 0,
    };

    for (const entry of dbDealTypes) {
      if (entry.dealType === 'freebie') counts.freebies = entry._count.id;
      if (entry.dealType === 'discount') counts.discounts = entry._count.id;
      if (entry.dealType === 'trial') counts.trials = entry._count.id;
      if (entry.dealType === 'credit') counts.credits = entry._count.id;
      if (entry.dealType === 'promo-code') counts.promoCodes = entry._count.id;
    }

    categoryCounts = counts;
  } catch (error) {
    console.error('Error loading layout navigation items:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Modern Typography: Plus Jakarta Sans (Google Sans geometry) & JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Explicit Favicon / App Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Cuelinks Verification */}
        <meta name="cuelinks-verification" content="VERIFY-CL-PSNIM4UI" />

        {/* Google AdSense Verification & Script */}
        <meta name="google-adsense-account" content="ca-pub-4630615697632107" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630615697632107"
          crossOrigin="anonymous"
        />
        {/* Anti-flicker inline theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('paradox-theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-zinc-100 font-sans antialiased selection:bg-indigo-600 selection:text-white dark:selection:bg-indigo-500 dark:selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AppShell topics={topics} categoryCounts={categoryCounts}>
            {children}
          </AppShell>
        </ThemeProvider>
        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5V0LJN6HTS"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
        >{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5V0LJN6HTS');
        `}</Script>



      </body>
    </html>
  );
}
