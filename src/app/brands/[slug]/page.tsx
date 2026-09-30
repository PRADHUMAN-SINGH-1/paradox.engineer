import { getBrandBySlug } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DealGrid from '@/components/DealGrid';
import BrandLogo from '@/components/BrandLogo';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: brand.name + ' Deals, Coupons & Credits',
    description: 'Browse all verified active credits, promo codes, and software tiers from ' + brand.name + '.',
    alternates: { canonical: SITE_URL + '/brands/' + slug },
    openGraph: {
      title: brand.name + ' Deals, Coupons & Credits',
      description: 'Browse all verified active credits, promo codes, and software tiers from ' + brand.name + '.',
      url: SITE_URL + '/brands/' + slug,
      siteName: 'Paradox',
      type: 'website',
    },
  };
}


export default async function BrandDealsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const brandDeals = (brand.deals || []).map((d: any) => ({
    ...d,
    brand: d.brand || {
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl,
      website: brand.website,
    },
  }));

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: SITE_URL + '/brands' },
      { '@type': 'ListItem', position: 3, name: brand.name, item: SITE_URL + '/brands/' + brand.slug },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-white transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <Link href="/brands" className="hover:text-indigo-600 dark:hover:text-white transition font-medium">Brands</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 p-2.5 flex items-center justify-center shrink-0">
          <BrandLogo
            name={brand.name}
            logoUrl={brand.logoUrl}
            website={brand.website}
            size="lg"
          />
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1.5">{brand.name}</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-4 max-w-xl">
            Verified developer perks, software discounts, and platform credits from {brand.name}.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 font-semibold">
              {brandDeals.length} active {brandDeals.length === 1 ? 'offer' : 'offers'}
            </span>
            {brand.website && (
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-medium transition flex items-center gap-1"
              >
                <span>Visit Official Website</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Brand Deals Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Active Offers from {brand.name}
        </h2>

        {brandDeals.length > 0 ? (
          <DealGrid deals={brandDeals as any} />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              There are currently no active deals for {brand.name}.
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
              Our community and automated crawlers update offers daily. Know of a new discount, student grant, or free tier for {brand.name}?
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs shadow-indigo-500/25 transition"
              >
                + Submit Perk for {brand.name}
              </Link>
              <Link
                href="/brands"
                className="inline-flex text-xs font-semibold px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition"
              >
                Browse All Brands
              </Link>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
