import { prisma } from '@/lib/db';
import DealGrid from '@/components/DealGrid';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Developer Perks & Academic Grants | Paradox',
  description: 'Verified academic software tiers, free Pro accounts, and student developer packs.',
};

export const dynamic = 'force-dynamic';

export default async function StudentDealsPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolved = searchParams ? await searchParams : {};
  const { page } = resolved;
  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const [deals, totalDeals] = await Promise.all([
    prisma.deal.findMany({
      where: { isStudentDeal: true, isActive: true },
      include: { brand: true, topic: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.deal.count({ where: { isStudentDeal: true, isActive: true } }),
  ]);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div id="curated-deals" className="pb-4 border-b border-slate-200 dark:border-zinc-800 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700 dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-300 mb-3">
          <span>🎓</span>
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
