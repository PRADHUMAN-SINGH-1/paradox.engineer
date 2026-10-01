import { getPublicBrands, getPublicTopics } from '@/lib/public-data';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import BrandsDirectoryClient, {
  BrandData,
  TopicOption,
  CategoryOption,
} from '@/components/BrandsDirectoryClient';

export const revalidate = 120; // Revalidate every 2 minutes

export const metadata: Metadata = {
  title: 'Browse Developer Deals by Brand',
  description:
    'Discover verified developer credits, cloud computing grants, AI API tokens, and software discounts organized by provider.',
  alternates: {
    canonical: SITE_URL + '/brands',
  },
  openGraph: {
    title: 'Browse Developer Deals by Brand',
    description:
      'Discover {/* dynamic brand count rendered below */} verified developer credits, cloud computing grants, AI API tokens, and software discounts organized by provider.',
    url: SITE_URL + '/brands',
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
  const [dbBrands, dbTopics] = await Promise.all([
    getPublicBrands(),
    getPublicTopics(),
  ]);

  const categoryCounts = (dbBrands as any[]).flatMap((brand) => brand.deals).reduce((counts: Map<string, number>, deal: any) => {
    const mappedSlug =
      deal.dealType === 'freebie' ? 'freebies' :
      deal.dealType === 'discount' ? 'discounts' :
      deal.dealType === 'trial' ? 'trials' :
      deal.dealType === 'credit' ? 'credits' :
      deal.dealType === 'promo-code' ? 'promo-codes' :
      deal.dealType;
    counts.set(mappedSlug, (counts.get(mappedSlug) || 0) + 1);
    return counts;
  }, new Map<string, number>());

  // Format topics for dropdown
  const topics: TopicOption[] = (dbTopics as any[]).map((t) => ({
    name: t.name,
    slug: t.slug,
    dealCount: t._count?.deals || 0,
  }));

  // Format categories with deal counts
  const categories: CategoryOption[] = CATEGORIES_CONFIG.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    dealCount: categoryCounts.get(cat.slug) || 0,
  }));

  // Format all brands with computed metadata
  const allBrands: BrandData[] = (dbBrands as any[]).map((b) => {
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
