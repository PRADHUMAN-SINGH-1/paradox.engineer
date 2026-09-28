import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import BrandsDirectoryClient, {
  BrandData,
  TopicOption,
  CategoryOption,
} from '@/components/BrandsDirectoryClient';

export const revalidate = 120; // Revalidate every 2 minutes

export const metadata: Metadata = {
  title: 'Browse Deals by Brand | Paradox',
  description:
    'Discover 156+ verified developer credits, cloud computing grants, AI API tokens, and software discounts organized by provider.',
  alternates: {
    canonical: 'https://paradox.engineer/brands',
  },
  openGraph: {
    title: 'Browse Deals by Brand | Paradox',
    description:
      'Discover 156+ verified developer credits, cloud computing grants, AI API tokens, and software discounts organized by provider.',
    url: 'https://paradox.engineer/brands',
    siteName: 'Paradox',
    type: 'website',
  },
};

const POPULAR_BRAND_SLUGS = [
  'openai',
  'meta-platforms-inc',
  'xai',
  'google-gemini',
  'anthropic',
  'youtube',
  'lovable',
  'z-ai',
  'duolingo',
  'discord',
  'adobe',
  'google',
  'agentrouter',
  'cursor',
  'google-antigravity',
  'higgsfield-ai',
  'qoder',
  'spotify-ab',
  'civo',
  'apple',
  'pixverse-ai',
  'miro',
  'google-workspace',
  'kiro',
  'vercel',
  'minimax',
  'elevenlabs',
  'vultr',
  'merlin-ai',
  'oracle-corporation',
  'amazon',
  'wispr-ai-inc',
  'perplexity-ai',
  'cloudflare',
  'browser-use-inc',
  'manus-ai',
  'shutterstock',
  'bolt-new',
  'figma',
];

const CATEGORIES_CONFIG = [
  { slug: 'freebies', name: 'Freebies' },
  { slug: 'discounts', name: 'Discounts' },
  { slug: 'trials', name: 'Trials' },
  { slug: 'credits', name: 'Credits' },
  { slug: 'promo-codes', name: 'Promo Codes' },
];

export default async function BrandsPage() {
  // Parallel DB queries
  const [dbBrands, dbTopics, categoryCounts] = await Promise.all([
    prisma.brand.findMany({
      include: {
        deals: {
          where: { isActive: true },
          select: {
            id: true,
            dealType: true,
            isTrending: true,
            clickCount: true,
            viewCount: true,
            topic: { select: { slug: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { deals: { where: { isActive: true } } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.deal.groupBy({
      by: ['dealType'],
      where: { isActive: true },
      _count: true,
    }),
  ]);

  // Format topics for dropdown
  const topics: TopicOption[] = dbTopics.map((t) => ({
    name: t.name,
    slug: t.slug,
    dealCount: t._count.deals,
  }));

  // Format categories with deal counts
  const categoryMap = new Map<string, number>();
  for (const c of categoryCounts) {
    // Map db dealType (e.g. 'freebie', 'discount') to URL slug
    const mappedSlug =
      c.dealType === 'freebie'
        ? 'freebies'
        : c.dealType === 'discount'
        ? 'discounts'
        : c.dealType === 'trial'
        ? 'trials'
        : c.dealType === 'credit'
        ? 'credits'
        : c.dealType === 'promo-code'
        ? 'promo-codes'
        : c.dealType;
    categoryMap.set(mappedSlug, (categoryMap.get(mappedSlug) || 0) + c._count);
  }

  const categories: CategoryOption[] = CATEGORIES_CONFIG.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    dealCount: categoryMap.get(cat.slug) || 0,
  }));

  // Format all brands with computed metadata
  const allBrands: BrandData[] = dbBrands.map((b) => {
    let trendingCount = 0;
    let totalClicks = 0;
    let totalViews = 0;
    const topicSet = new Set<string>();
    const categorySet = new Set<string>();

    for (const d of b.deals) {
      if (d.isTrending) trendingCount++;
      totalClicks += d.clickCount;
      totalViews += d.viewCount;
      if (d.topic?.slug) topicSet.add(d.topic.slug);

      const catSlug =
        d.dealType === 'freebie'
          ? 'freebies'
          : d.dealType === 'discount'
          ? 'discounts'
          : d.dealType === 'trial'
          ? 'trials'
          : d.dealType === 'credit'
          ? 'credits'
          : d.dealType === 'promo-code'
          ? 'promo-codes'
          : d.dealType;
      categorySet.add(catSlug);
    }

    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      website: b.website,
      dealCount: b.deals.length,
      trendingCount,
      totalClicks,
      totalViews,
      topicSlugs: Array.from(topicSet),
      categorySlugs: Array.from(categorySet),
    };
  });

  // Extract the 39 Popular Brands in the exact designated order
  const brandBySlug = new Map(allBrands.map((b) => [b.slug, b]));
  const popularBrands: BrandData[] = [];
  for (const slug of POPULAR_BRAND_SLUGS) {
    const brand = brandBySlug.get(slug);
    if (brand) {
      popularBrands.push(brand);
    }
  }

  // Schema.org BreadcrumbList for SERP
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://paradox.engineer',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Brands',
        item: 'https://paradox.engineer/brands',
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />

      <BrandsDirectoryClient
        popularBrands={popularBrands}
        allBrands={allBrands}
        topics={topics}
        categories={categories}
      />
    </div>
  );
}
