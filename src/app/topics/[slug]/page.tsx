import { getTopicBySlug, getDealsByTopic, sortDeals, paginateDeals } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import DealGrid from '@/components/DealGrid';
import SortTabs from '@/components/SortTabs';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';


export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string; page?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = searchParams ? await searchParams : {};
  const page = Number(resolved.page) || 1;
  const topic = await getTopicBySlug(slug);
  if (!topic) return { title: 'Topic Not Found' };

  const hasVariant = page > 1 || (resolved.sort && resolved.sort !== 'latest');

  return {
    title: topic.name + ' Deals & Perks',
    description: 'Verified infrastructure credits, software tiers, and discounts for ' + topic.name + '.',
    alternates: { canonical: SITE_URL + '/topics/' + slug },
    robots: hasVariant ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: topic.name + ' Deals & Perks',
      description: 'Verified infrastructure credits, software tiers, and discounts for ' + topic.name + '.',
      url: SITE_URL + '/topics/' + slug,
      siteName: 'Paradox',
      type: 'website',
    },
  };
}


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
  
  const topic = await getTopicBySlug(slug);
  if (!topic) {
    notFound();
  }

  const currentPage = Number(page) || 1;
  const sortParam = sort || 'latest';
  const limit = 12;
  const skip = (currentPage - 1) * limit;
  const topicDeals = await getDealsByTopic(slug);
  const deals = paginateDeals(sortDeals(topicDeals, sortParam), currentPage, limit);
  const totalDeals = topicDeals.length;

  const totalPages = Math.ceil(totalDeals / limit);

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Topics', item: SITE_URL + '/topics' },
      { '@type': 'ListItem', position: 3, name: topic.name, item: SITE_URL + '/topics/' + topic.slug },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }} />
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
    </>
  );
}
