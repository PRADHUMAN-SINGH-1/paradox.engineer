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
    default: 'Paradox – Digital Deals, Developer Perks & Discounts, Sorted.',
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
    icon: '/icon.svg',
    shortcut: '/favicon.svg',
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
    title: 'Paradox – Digital Deals, Sorted.',
    description: 'The best digital discounts, developer deals, freelancer offers, and student savings, updated daily.',
    url: SITE_URL,
    siteName: 'Paradox',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paradox – Digital Deals, Sorted.',
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
      <body className="bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-zinc-100 font-sans antialiased selection:bg-blue-600 selection:text-white dark:selection:bg-zinc-800 dark:selection:text-white transition-colors duration-200">
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

        {/* Skimlinks Affiliate Engine */}
        <Script
          strategy="afterInteractive"
          src="https://s.skimresources.com/js/310009X1798390.skimlinks.js"
        />
      </body>
    </html>
  );
}
