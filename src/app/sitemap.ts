import { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import { SITE_URL } from '@/lib/site';

const getSitemapData = unstable_cache(
  async () => {
    const [deals, brands, topics] = await Promise.all([
      prisma.deal.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.brand.findMany({
        where: { deals: { some: { isActive: true } } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.topic.findMany({
        where: { deals: { some: { isActive: true } } },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return { deals, brands, topics };
  },
  ['paradox-sitemap-v1'],
  { revalidate: 3600, tags: ['paradox:sitemap', 'paradox:deals', 'paradox:brands', 'paradox:topics'] }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: SITE_URL + '/latest', changeFrequency: 'daily', priority: 0.9 },
    { url: SITE_URL + '/student', changeFrequency: 'daily', priority: 0.9 },
    { url: SITE_URL + '/startups', changeFrequency: 'daily', priority: 0.9 },
    { url: SITE_URL + '/no-credit-card', changeFrequency: 'daily', priority: 0.85 },
    { url: SITE_URL + '/brands', changeFrequency: 'daily', priority: 0.8 },
    { url: SITE_URL + '/topics', changeFrequency: 'daily', priority: 0.8 },
    { url: SITE_URL + '/affiliate-disclosure', changeFrequency: 'monthly', priority: 0.4 },
    { url: SITE_URL + '/about', changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryTypes = ['freebies', 'discounts', 'trials', 'credits', 'promo-codes'];
  const categoryRoutes: MetadataRoute.Sitemap = categoryTypes.map((type) => ({
    url: SITE_URL + '/category/' + type,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const { deals, brands, topics } = await getSitemapData();

  const dealRoutes: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: SITE_URL + '/resources/' + deal.slug,
    lastModified: deal.updatedAt,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: SITE_URL + '/brands/' + brand.slug,
    lastModified: brand.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: SITE_URL + '/topics/' + topic.slug,
    lastModified: topic.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...dealRoutes, ...brandRoutes, ...topicRoutes];
}
