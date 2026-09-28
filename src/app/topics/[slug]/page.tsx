import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import DealGrid from '@/components/DealGrid';
import SortTabs from '@/components/SortTabs';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Metadata } from 'next';


export async function generateStaticParams() {
  const topics = await prisma.topic.findMany({ select: { slug: true } });
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) return { title: 'Topic Not Found' };
  return {
    title: `${topic.name} Deals & Perks | Paradox`,
    description: `Verified infrastructure credits, software tiers, and discounts for ${topic.name}.`,
  };
}

export const revalidate = 120;

export default async function TopicDealsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string; page?: string }>;
}) {
  const { slug } = await params;
  const resolved = searchParams ? await searchParams : {};
  const { sort, page } = resolved;
  
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) {
    notFound();
  }

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
      where: { topicId: topic.id, isActive: true },
      include: { brand: true, topic: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.deal.count({ where: { topicId: topic.id, isActive: true } }),
  ]);

  const totalPages = Math.ceil(totalDeals / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <Link href="/topics" className="hover:text-blue-600 dark:hover:text-white transition font-medium">Topics</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">{topic.name}</span>
      </nav>

      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <span>{topic.name}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Showing {totalDeals} active verified deals in this category
        </p>
      </div>

      <div id="curated-deals" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 scroll-mt-20">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          Showing {skip + 1}–{Math.min(skip + limit, totalDeals)} of {totalDeals} perks
        </div>
        <SortTabs currentSort={sortParam} baseUrl={`/topics/${topic.slug}`} />
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/topics/${topic.slug}`} />
        </div>
      )}
    </div>
  );
}
