import { prisma } from '@/lib/db';
import DealGrid from '@/components/DealGrid';
import SortTabs from '@/components/SortTabs';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Deals & Developer Perks | Paradox',
  description: 'Chronological index of freshly added software infrastructure credits, trials, and student savings.',
};

export default async function LatestDealsPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  const { sort, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const sortParam = sort || 'latest';
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  let orderBy: any = { createdAt: 'desc' };
  if (sortParam === 'last_updated') orderBy = { updatedAt: 'desc' };
  else if (sortParam === 'popular') orderBy = { viewCount: 'desc' };
  else if (sortParam === 'claimed') orderBy = { clickCount: 'desc' };

  const [deals, totalDeals] = await Promise.all([
    prisma.deal.findMany({
      where: { isActive: true },
      include: { brand: true, topic: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.deal.count({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Latest Verified Deals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Showing {totalDeals} active offers and grants updated daily
        </p>
      </div>

      <div id="curated-deals" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 scroll-mt-20">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          Showing {skip + 1}–{Math.min(skip + limit, totalDeals)} of {totalDeals} perks
        </div>
        <SortTabs currentSort={sortParam} baseUrl="/latest" />
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/latest" />
        </div>
      )}
    </div>
  );
}
