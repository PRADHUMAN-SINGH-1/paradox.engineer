import { getPublicDeals, sortDeals, paginateDeals } from '@/lib/public-data';
import DealGrid from '@/components/DealGrid';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ page?: string }> }): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const page = Number(resolved.page) || 1;

  return {
    title: 'Student Developer Perks & Academic Grants',
    description: 'Verified academic software tiers, free Pro accounts, and student developer packs.',
    alternates: { canonical: SITE_URL + '/student' },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}


export default async function StudentDealsPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolved = searchParams ? await searchParams : {};
  const { page } = resolved;
  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const allDeals = await getPublicDeals();
  const filteredDeals = sortDeals(allDeals.filter((deal) => deal.isStudentDeal), 'latest');
  const totalDeals = filteredDeals.length;
  const deals = paginateDeals(filteredDeals, currentPage, limit);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div id="curated-deals" className="pb-4 border-b border-slate-200 dark:border-zinc-800 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
          </svg>
          <span>Academic Verification Required</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 font-sans">
          Academic Developer Grants
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-sans max-w-2xl">
          Full complimentary Pro tiers and credits for active students and researchers with valid institutional credentials.
        </p>
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/student" />
        </div>
      )}
    </div>
  );
}
