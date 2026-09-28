import { getPublicDeals } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import ClaimActionBox from '@/components/ClaimActionBox';
import BrandLogo from '@/components/BrandLogo';
import ExpiryBadge from '@/components/ExpiryBadge';
import ViewTracker from '@/components/ViewTracker';



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deal = (await getPublicDeals()).find((item) => item.slug === slug);
  if (!deal) return { title: 'Offer Not Found' };

  const title = deal.title + ' – Promo Code & Deal';
  const description = deal.shortDescription + ' Verified ' + deal.dealType + ' for ' + deal.brand.name + '. Step-by-step claim instructions and eligibility rules.';

  return {
    title,
    description,
    alternates: { canonical: '/resources/' + deal.slug },
    openGraph: {
      title,
      description,
      url: 'https://paradox.engineer/resources/' + deal.slug,
      siteName: 'Paradox',
      type: 'article',
      images: deal.brand.logoUrl ? [{ url: deal.brand.logoUrl }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = (await getPublicDeals()).find((item) => item.slug === slug);

  if (!deal) {
    notFound();
  }

  let howToClaim: string[] = [];
  let keyBenefits: string[] = [];
  let eligibility: string[] = [];
  try { howToClaim = JSON.parse(deal.howToClaim || '[]'); } catch(e){}
  try { keyBenefits = JSON.parse(deal.keyBenefits || '[]'); } catch(e){}
  try { eligibility = JSON.parse(deal.eligibility || '[]'); } catch(e){}

  // Rich Schema.org Structured Data (JSON-LD) for Google SERP
  const schemaOffer = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deal.title,
    description: deal.shortDescription,
    image: deal.brand.logoUrl || 'https://paradox.engineer/icon.png',
    brand: {
      '@type': 'Brand',
      name: deal.brand.name,
      url: deal.brand.website || undefined,
    },
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      priceValidUntil: deal.expiryDate ? new Date(deal.expiryDate).toISOString() : '2026-12-31T23:59:59.000Z',
      availability: 'https://schema.org/InStock',
      url: `https://paradox.engineer/resources/${deal.slug}`,
      category: deal.topic.name,
      description: deal.discountAmount || 'Verified Developer Tier & Discount',
    },
  };

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://paradox.engineer',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: deal.topic.name,
        item: `https://paradox.engineer/topics/${deal.topic.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deal.brand.name,
        item: `https://paradox.engineer/brands/${deal.brand.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: deal.title,
        item: `https://paradox.engineer/resources/${deal.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOffer) }}
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
          />
        </div>
      </div>
      </div>
    </>
  );
}
