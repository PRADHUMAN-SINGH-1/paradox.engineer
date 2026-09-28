import { getPublicDeals, sortDeals, paginateDeals } from '@/lib/public-data';
import { notFound } from 'next/navigation';
import DealGrid from '@/components/DealGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const TYPE_MAP: Record<string, { type: string; name: string; tag: string }> = {
  'freebies': { type: 'freebie', name: 'Free Developer Tiers & Freebies', tag: 'Free' },
  'discounts': { type: 'discount', name: 'Software Discounts', tag: 'Discount' },
  'trials': { type: 'trial', name: 'Extended Pro Trials', tag: 'Trial' },
  'credits': { type: 'credit', name: 'Cloud & API Platform Credits', tag: 'Credit' },
  'promo-codes': { type: 'promo-code', name: 'Exclusive Promo Codes', tag: 'Promo' },
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type: rawType } = await params;
  const category = TYPE_MAP[rawType];
  if (!category) return { title: 'Category Not Found' };
  return {
    title: category.name,
    description: `Verified ${category.name.toLowerCase()} for developers, startups, and engineers.`,
    alternates: { canonical: SITE_URL + '/category/' + rawType },
  };
}


export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { type: rawType } = await params;
  const resolved = searchParams ? await searchParams : {};
  const { page } = resolved;
  
  const category = TYPE_MAP[rawType];
  if (!category) {
    notFound();
  }

  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const allDeals = await getPublicDeals();
  const categoryDeals = allDeals.filter((deal) => deal.dealType === category.type);
  const sortedDeals = sortDeals(categoryDeals, 'latest');
  const totalDeals = sortedDeals.length;
  const deals = paginateDeals(sortedDeals, currentPage, limit);

  const totalPages = Math.ceil(totalDeals / limit);

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Category', item: SITE_URL + '/category/' + rawType },
      { '@type': 'ListItem', position: 3, name: category.name, item: SITE_URL + '/category/' + rawType },
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
        <span className="text-slate-900 dark:text-white font-semibold capitalize">{rawType}</span>
      </nav>

      <div id="curated-deals" className="pb-4 border-b border-slate-200 dark:border-zinc-800 scroll-mt-20">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Showing {totalDeals} active verified offers in {category.tag.toLowerCase()} category
        </p>
      </div>

      <DealGrid deals={deals as any} />
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/category/${rawType}`} />
        </div>
      )}
      </div>
    </>
  );
}
