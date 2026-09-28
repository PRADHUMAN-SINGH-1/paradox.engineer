import { getPublicDeals, sortDeals, paginateDeals } from '@/lib/public-data';
import DealGrid from '@/components/DealGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ page?: string }> }): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const page = Number(resolved.page) || 1;

  return {
    title: 'No Credit Card Required Deals',
    description: 'Verified digital tools, free trials, and developer platform grants that do not require credit card details upfront.',
    alternates: { canonical: SITE_URL + '/no-credit-card' },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}


export default async function NoCreditCardPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolved = searchParams ? await searchParams : {};
  const { page } = resolved;
  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const allDeals = await getPublicDeals();
  const filteredDeals = sortDeals(allDeals.filter((deal) => !deal.needsCreditCard), 'latest');
  const totalDeals = filteredDeals.length;
  const deals = paginateDeals(filteredDeals, currentPage, limit);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">No Credit Card</span>
      </nav>

      <div id="curated-deals" className="pb-4 border-b border-slate-200 dark:border-zinc-800 scroll-mt-20">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          No Credit Card Required
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl">
          Showing {totalDeals} verified tools and developer tiers that activate with email verification only. Zero billing info needed upfront.
        </p>
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/no-credit-card" />
        </div>
      )}
    </div>
  );
}
