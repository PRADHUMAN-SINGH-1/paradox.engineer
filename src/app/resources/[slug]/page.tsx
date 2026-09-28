import { getDealBySlug, getRelatedDeals } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import Link from 'next/link';
import ClaimActionBox from '@/components/ClaimActionBox';
import DealGrid from '@/components/DealGrid';
import BrandLogo from '@/components/BrandLogo';
import ExpiryBadge from '@/components/ExpiryBadge';
import ViewTracker from '@/components/ViewTracker';



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return { title: 'Offer Not Found' };

  const title = deal.title + ' – Promo Code & Deal';
  const description = deal.shortDescription + ' Verified ' + deal.dealType + ' for ' + deal.brand.name + '. Step-by-step claim instructions and eligibility rules.';

  return {
    title,
    description,
    alternates: { canonical: SITE_URL + '/resources/' + deal.slug },
    openGraph: {
      title,
      description,
      url: SITE_URL + '/resources/' + deal.slug,
      siteName: 'Paradox',
      type: 'article',
      images: deal.brand.logoUrl ? [{ url: deal.brand.logoUrl }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal) {
    notFound();
  }

  const relatedDeals = await getRelatedDeals(deal.topic.slug, deal.slug);

  let howToClaim: string[] = [];
  let keyBenefits: string[] = [];
  let eligibility: string[] = [];
  try { howToClaim = JSON.parse(deal.howToClaim || '[]'); } catch(e){}
  try { keyBenefits = JSON.parse(deal.keyBenefits || '[]'); } catch(e){}
  try { eligibility = JSON.parse(deal.eligibility || '[]'); } catch(e){}

  // Semantic structured data for a single deal page.
  // Product rich results are not used here because Paradox is an aggregator, not the merchant.
  const schemaWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: deal.title,
    description: deal.shortDescription,
    url: SITE_URL + '/resources/' + deal.slug,
    isPartOf: { '@type': 'WebSite', name: 'Paradox', url: SITE_URL },
    about: { '@type': 'Thing', name: deal.brand.name },
    datePublished: new Date(deal.createdAt).toISOString(),
    dateModified: new Date(deal.updatedAt).toISOString(),
    inLanguage: 'en',
  };

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: deal.topic.name,
        item: SITE_URL + `/topics/${deal.topic.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deal.brand.name,
        item: SITE_URL + `/brands/${deal.brand.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: deal.title,
        item: SITE_URL + `/resources/${deal.slug}`,
      },
    ],
  };

  return (
    <>
      <ViewTracker slug={deal.slug} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Schema.org Structured Data for Google SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />

      {/* Clean Modern Breadcrumbs */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <Link href={`/topics/${deal.topic.slug}`} className="hover:text-blue-600 dark:hover:text-white transition font-medium">{deal.topic.name}</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <Link href={`/brands/${deal.brand.slug}`} className="hover:text-blue-600 dark:hover:text-white transition font-medium">{deal.brand.name}</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">{deal.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Deal Information & Documentation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 p-1.5 flex items-center justify-center shrink-0">
                  <BrandLogo
                    name={deal.brand.name}
                    logoUrl={deal.brand.logoUrl}
                    website={deal.brand.website}
                    size="md"
                  />
                </div>
                <div>
                  <Link
                    href={`/brands/${deal.brand.slug}`}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-white transition block"
                  >
                    {deal.brand.name}
                  </Link>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 block font-normal">
                    {deal.topic.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ExpiryBadge expiryDate={deal.expiryDate} isLimitedTime={deal.isLimitedTime} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {deal.title}
            </h1>

            {/* Highlighted Value Pill */}
            {deal.discountAmount && (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800/80 px-3.5 py-1.5 rounded-xl">
                <span>Value:</span>
                <span>{deal.discountAmount}</span>
              </div>
            )}

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed pt-3 border-t border-slate-100 dark:border-zinc-800">
              {deal.fullDescription}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[11px] text-slate-500 dark:text-zinc-400">
              <span>Last verified: <time dateTime={new Date(deal.updatedAt).toISOString()}>{new Date(deal.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></span>
              <span>Category: {deal.topic.name}</span>
              <span>Official source linked below</span>
            </div>
          </div>

          {/* How to Claim Steps */}
          {howToClaim.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>📋</span>
                <span>How to Claim this Offer</span>
              </h2>
              <div className="space-y-3">
                {howToClaim.map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 leading-relaxed font-medium"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Benefits */}
          {keyBenefits.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>✨</span>
                <span>Key Benefits & Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {keyBenefits.map((benefit: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-950 dark:border-zinc-800 flex items-start gap-2.5 font-medium text-slate-700 dark:text-zinc-300"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Requirements */}
          {eligibility.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>🎯</span>
                <span>Eligibility & Requirements</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                {eligibility.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedDeals.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related Developer Deals</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  More verified offers in {deal.topic.name}.
                </p>
              </div>
              <DealGrid deals={relatedDeals as any} />
            </section>
          )}

          {deal.termsUrl && (
            <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 pt-2">
              <span>Official Terms:</span>
              <a
                href={deal.termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:underline font-medium"
              >
                View Official Terms & Conditions ↗
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Execution Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-20 self-start">
          <ClaimActionBox
            slug={deal.slug}
            brandName={deal.brand.name}
            claimUrl={deal.claimUrl || deal.affiliateUrl || deal.brand.website || '#'}
            websiteUrl={deal.brand.website}
            logoUrl={deal.brand.logoUrl}
            promoCode={deal.promoCode}
            dealType={deal.dealType}
            isStudentDeal={deal.isStudentDeal}
            needsCreditCard={deal.needsCreditCard}
            clickCount={deal.clickCount}
            viewCount={deal.viewCount}
            expiryDate={deal.expiryDate}
            isLimitedTime={deal.isLimitedTime}
            updatedAt={deal.updatedAt}
          />
        </div>
      </div>
      </div>
    </>
  );
}
