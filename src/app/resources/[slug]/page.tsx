import { getDealBySlug, getRelatedDeals } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import Link from 'next/link';
import ClaimActionBox from '@/components/ClaimActionBox';
import DealCard from '@/components/DealCard';
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
        name: deal.title,
        item: SITE_URL + `/resources/${deal.slug}`,
      },
    ],
  };

  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I claim the ${deal.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: howToClaim.length > 0 
            ? howToClaim.map((step, idx) => `${idx + 1}. ${step}`).join(' ')
            : `Click "Claim Deal" on Paradox to visit ${deal.brand.name} and apply promo code ${deal.promoCode || 'at checkout'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Who is eligible for this ${deal.brand.name} discount?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: eligibility.length > 0
            ? eligibility.join(' ')
            : `This deal is available for developers, students, and startups signing up with ${deal.brand.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What benefits are included in this perk?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: keyBenefits.length > 0
            ? keyBenefits.join(' ')
            : `Get access to ${deal.discountAmount || 'exclusive benefits'} on ${deal.brand.name}.`,
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />

      {/* Clean Modern Breadcrumbs */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <Link href={`/topics/${deal.topic.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">{deal.topic.name}</Link>
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
                <BrandLogo
                  name={deal.brand.name}
                  logoUrl={deal.brand.logoUrl}
                  website={deal.brand.website}
                  size="lg"
                />
                <div>
                  <Link
                    href={`/brands/${deal.brand.slug}`}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 transition block"
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

            {/* Highlighted Value Pill + Key Attribute Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {deal.discountAmount && (
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/90 dark:text-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800/60 px-3 py-1.5 rounded-xl shadow-2xs">
                  <span>Value:</span>
                  <span>{deal.discountAmount}</span>
                </div>
              )}
              {deal.isStartupDeal && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Startup Program</span>
                </span>
              )}
              {!deal.needsCreditCard && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No CC Required</span>
                </span>
              )}
              {deal.isStudentDeal && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/90 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60 shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                  </svg>
                  <span>Student Perk</span>
                </span>
              )}
            </div>

            {/* Offer Expiry Deadline Alert */}
            {deal.expiryDate && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Offer Deadline:</strong> Last date to claim is{' '}
                    <span className="font-semibold">
                      {new Date(deal.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(deal.expiryDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </span>
                </div>
                <ExpiryBadge expiryDate={deal.expiryDate} isLimitedTime={deal.isLimitedTime} showExactTime={true} />
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
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
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
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:underline font-medium"
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

      {/* Full-Width Section: Related Developer Deals */}
      {relatedDeals.length > 0 && (
        <section className="pt-10 mt-6 border-t border-slate-200 dark:border-zinc-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/90 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                <span>⚡</span>
                <span>More in {deal.topic.name}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Related Developer Deals & Grants
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                More verified offers, developer credits, and savings in {deal.topic.name}.
              </p>
            </div>
            <Link
              href={`/topics/${deal.topic.slug}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore all {deal.topic.name}</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedDeals.slice(0, 3).map((rDeal: any) => (
              <DealCard key={rDeal.slug || rDeal.id} deal={rDeal} />
            ))}
          </div>
        </section>
      )}
      </div>
    </>
  );
}
