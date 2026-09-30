import { getPublicDeals, sortDeals, paginateDeals } from '@/lib/public-data';
import DealGrid from '@/components/DealGrid';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ page?: string }> }): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const page = Number(resolved.page) || 1;

  return {
    title: 'Startup Cloud Infrastructure Credits',
    description: 'Cloud infrastructure grants, database credits, and developer programs for early-stage engineering teams.',
    alternates: { canonical: SITE_URL + '/startups' },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}


export default async function StartupDealsPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolved = searchParams ? await searchParams : {};
  const { page } = resolved;
  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const allDeals = await getPublicDeals();
  const filteredDeals = sortDeals(allDeals.filter((deal) => deal.isStartupDeal), 'latest');
  const totalDeals = filteredDeals.length;
  const deals = paginateDeals(filteredDeals, currentPage, limit);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div id="curated-deals" className="pb-4 border-b border-slate-200 dark:border-zinc-800 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-purple-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Founder & Startup Grants</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 font-sans">
          Startup Infrastructure Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-sans max-w-2xl">
          Cloud computing grants, managed Postgres, and development tooling allocations for technical founders.
        </p>
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/startups" />
        </div>
      )}
    </div>
  );
}
