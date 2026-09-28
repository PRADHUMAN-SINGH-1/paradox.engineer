import { getPublicDeals, getPublicTopics, getPopularBrands, sortDeals, paginateDeals, matchesDealSearch } from '@/lib/public-data';
import TopicCard from '@/components/TopicCard';
import PopularBrands from '@/components/PopularBrands';
import NewArrivalCard from '@/components/NewArrivalCard';
import DealCard from '@/components/DealCard';
import SortTabs from '@/components/SortTabs';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';


export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ q?: string }> }): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const q = resolved.q?.trim();

  return {
    title: q ? 'Search results for ' + q + ' | Paradox' : 'Paradox – Digital Deals, Developer Perks & Discounts, Sorted.',
    description: 'Verified digital discounts, developer cloud credits, AI token grants, and student savings, updated daily.',
    alternates: { canonical: SITE_URL },
    robots: q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; page?: string; q?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { sort, page, q } = resolvedParams;
  const currentPage = Number(page) || 1;
  const sortParam = sort || 'latest';
  const searchQuery = q?.trim() || '';
  const limit = 12;
  const [allDeals, topics, popularBrands] = await Promise.all([
    getPublicDeals(),
    getPublicTopics(),
    getPopularBrands(),
  ]);

  const filteredDeals = searchQuery
    ? allDeals.filter((deal) => matchesDealSearch(deal, searchQuery))
    : allDeals;

  const directoryDeals = paginateDeals(sortDeals(filteredDeals, sortParam), currentPage, limit);
  const totalDeals = filteredDeals.length;
  const newArrivals = allDeals.slice(0, 6);

  const totalPages = Math.ceil(totalDeals / limit);
  const paginationBaseUrl = searchQuery ? `/?q=${encodeURIComponent(searchQuery)}` : '/';

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
    url: 'https://paradox.engineer',
    logo: SITE_URL + '/icon.png',
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
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No deals found for &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-4">
                Try searching for brands like &ldquo;Claude&rdquo;, &ldquo;Supabase&rdquo;, or categories like &ldquo;Student&rdquo;.
              </p>
              <Link
                href="/"
                className="inline-flex text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
          {/* Resourify-styled Hero */}
          <section className="space-y-2 pt-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Paradox – Digital Deals, Sorted.
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              <p>
                The best digital discounts, developer deals, freelancer offers, and student savings, updated daily.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                Last updated 1 day ago
              </span>
            </div>
          </section>

          {/* Browse Deals by Topic (4 columns x 3 rows) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Browse deals by topic
                </h2>
              </div>
              <Link
                href="/topics"
                className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition flex items-center gap-1"
              >
                <span>Show all topics</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} dealCount={topic._count.deals} />
              ))}
            </div>
          </section>

          {/* Popular Brands Pill Bar */}
          <PopularBrands brands={popularBrands} />

          {/* New Arrivals Section */}
          {newArrivals.length > 0 && (
            <section className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">⭐</span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    New Arrivals
                  </h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider">
                    NEW
                  </span>
                </div>
                <Link
                  href="/latest"
                  className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition flex items-center gap-1"
                >
                  <span>Show all new arrivals</span>
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

          {/* Active Deals Directory */}
          <section id="curated-deals" className="space-y-4 pt-2 scroll-mt-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 dark:border-zinc-800 gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  All Curated Perks & Deals
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Showing {directoryDeals.length} of {totalDeals} active offers
                </p>
              </div>
              <SortTabs currentSort={sortParam} baseUrl="/" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directoryDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal as any} />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={paginationBaseUrl}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
