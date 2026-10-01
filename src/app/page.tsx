import { getPublicDeals, getPublicTopics, getPopularBrands, sortDeals, paginateDeals, matchesDealSearch } from '@/lib/public-data';
import PopularBrands from '@/components/PopularBrands';
import NewArrivalCard from '@/components/NewArrivalCard';
import DealCard from '@/components/DealCard';
import FeaturedPerksSpotlight from '@/components/FeaturedPerksSpotlight';
import TopicFilterBar from '@/components/TopicFilterBar';
import SortTabs from '@/components/SortTabs';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ q?: string; topic?: string }> }): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const q = resolved.q?.trim();
  const topic = resolved.topic?.trim();

  let title = 'Developer Deals, Cloud Credits & Software Perks';
  if (q) title = `Search results for "${q}"`;
  else if (topic) title = `Verified Developer Perks for ${topic}`;

  return {
    title,
    description: 'Verified digital discounts, developer cloud credits, AI token grants, and student savings, updated daily.',
    alternates: { canonical: SITE_URL },
    robots: q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; page?: string; q?: string; topic?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { sort, page, q, topic } = resolvedParams;
  const currentPage = Number(page) || 1;
  const sortParam = sort || 'latest';
  const searchQuery = q?.trim() || '';
  const activeTopic = topic?.trim() || '';
  const limit = 12;

  const [allDeals, topics, popularBrands] = await Promise.all([
    getPublicDeals(),
    getPublicTopics(),
    getPopularBrands(),
  ]);

  // Dynamic Multi-Dimensional Filter: Search + Topic
  let filteredDeals = allDeals;
  if (searchQuery) {
    filteredDeals = filteredDeals.filter((deal) => matchesDealSearch(deal, searchQuery));
  }
  if (activeTopic) {
    filteredDeals = filteredDeals.filter((deal) => (deal as any).topic?.slug === activeTopic);
  }

  const directoryDeals = paginateDeals(sortDeals(filteredDeals, sortParam), currentPage, limit);
  const totalDeals = filteredDeals.length;

  // Spotlight: 3 top cloud credits / AI foundation grants featured prominently up top
  const spotlightDeals = allDeals
    .filter((d) => (d.dealType === 'credit' || d.isTrending) && !d.slug.includes('youtube'))
    .slice(0, 3);

  const newArrivals = allDeals.slice(0, 4);

  const totalPages = Math.ceil(totalDeals / limit);
  // Build Pagination URL preserving topic & search query
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('q', searchQuery);
  if (activeTopic) queryParams.set('topic', activeTopic);
  if (sortParam !== 'latest') queryParams.set('sort', sortParam);
  const qs = queryParams.toString();
  const paginationBaseUrl = qs ? `/?${qs}` : '/';

  // Active topic metadata
  const currentTopicObj = topics.find((t) => t.slug === activeTopic);

  // Schema.org WebSite with SearchAction and Organization for Google Search Sitelinks
  const schemaWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Paradox',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE_URL + '/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const schemaOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Paradox',
    url: SITE_URL,
    logo: SITE_URL + '/icon.svg',
    description: 'Curated index of software credits, cloud infrastructure perks, AI tokens, and developer discounts.',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* Schema.org Sitelinks & Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />

      {/* Search Results Mode */}
      {searchQuery ? (
        <section id="curated-deals" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-zinc-800 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Found {totalDeals} {totalDeals === 1 ? 'deal' : 'deals'} matching your query
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>&larr;</span> Clear search
            </Link>
          </div>

          {directoryDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directoryDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-slate-500 dark:text-zinc-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No deals found for &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-4">
                Try searching for brands like &ldquo;Claude&rdquo;, &ldquo;DigitalOcean&rdquo;, &ldquo;Vultr&rdquo;, or categories like &ldquo;Credits&rdquo;.
              </p>
              <Link
                href="/"
                className="inline-flex text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs shadow-indigo-500/25 transition"
              >
                Browse All Deals
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={paginationBaseUrl}
            />
          </div>
        </section>
      ) : (
        <>
          {/* Modern Engineering Hero Panel */}
          <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#101013] border border-slate-200/90 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Top hairline accent (sleek indigo accent) */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700"></div>

            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">Live Catalog</span>
                <span className="text-slate-300 dark:text-zinc-600">•</span>
                <span>{allDeals.length} Active Programs</span>
                <span className="text-slate-300 dark:text-zinc-600">•</span>
                <span>Live Catalog • Active programs are reviewed before publication</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                Curated Developer Perks & Cloud Infrastructure Grants
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-normal">
                The curated index of verified software discounts, infrastructure credits, and developer grants. Hand-verified daily for active status, coupon codes, and expirations.
              </p>
            </div>

            {/* Quick Access Filter Matrix */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <Link
                href="/startups"
                className="group p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-[#121215] dark:hover:bg-[#1a1a20] border border-slate-200/80 hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700/60 transition flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Startup Grants</div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">AWS, GCP, Miro, Postman</div>
                </div>
              </Link>

              <Link
                href="/no-credit-card"
                className="group p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-[#121215] dark:hover:bg-[#1a1a20] border border-slate-200/80 hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-700/60 transition flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">No CC Required</div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Zero billing friction</div>
                </div>
              </Link>

              <Link
                href="/student"
                className="group p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-[#121215] dark:hover:bg-[#1a1a20] border border-slate-200/80 hover:border-sky-300 dark:border-zinc-800 dark:hover:border-sky-700/60 transition flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Student Perks</div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">GitHub, Figma, JetBrains</div>
                </div>
              </Link>

              <Link
                href="/category/credits"
                className="group p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-[#121215] dark:hover:bg-[#1a1a20] border border-slate-200/80 hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700/60 transition flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">&rarr;</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Cloud Credits</div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">DigitalOcean, Vultr, Supabase</div>
                </div>
              </Link>
            </div>
          </section>

          {/* 1. Feature Trending Cloud & AI Perks Up Top */}
          <FeaturedPerksSpotlight deals={spotlightDeals as any} />

          {/* 2. Popular Brands Bar */}
          <PopularBrands brands={popularBrands} />

          {/* 3. Interactive Topic Filter Bar (Replaces 4x3 static topic grid) */}
          <TopicFilterBar
            topics={topics}
            activeTopic={activeTopic}
            currentSort={sortParam}
            searchQuery={searchQuery}
          />

          {/* 4. Active Deals Directory */}
          <section id="curated-deals" className="space-y-4 pt-1 scroll-mt-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3.5 border-b border-slate-200 dark:border-zinc-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {currentTopicObj ? `${currentTopicObj.name} Perks` : 'All Curated Perks & Deals'}
                  </h2>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750">
                    {totalDeals} Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  <span>
                    {currentTopicObj
                      ? `Browsing verified deals in ${currentTopicObj.name}`
                      : 'Curated discounts, cloud credits, and developer tools'}
                  </span>
                  {activeTopic && (
                    <>
                      <span>•</span>
                      <Link
                        href="/#curated-deals"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Reset filter &times;
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <SortTabs currentSort={sortParam} baseUrl={paginationBaseUrl} />
            </div>

            {directoryDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directoryDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  No active perks found in this category currently.
                </p>
                <Link
                  href="/#curated-deals"
                  className="mt-3 inline-flex text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs shadow-indigo-500/25 transition"
                >
                  View All Perks
                </Link>
              </div>
            )}

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={paginationBaseUrl}
              />
            </div>
          </section>

          {/* 5. New Arrivals Secondary Shelf */}
          {newArrivals.length > 0 && !activeTopic && (
            <section className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Recently Added Deals
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                    NEW
                  </span>
                </div>
                <Link
                  href="/latest"
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition flex items-center gap-1"
                >
                  <span>Browse latest additions</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newArrivals.map((deal) => (
                  <NewArrivalCard key={deal.id} deal={deal as any} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
