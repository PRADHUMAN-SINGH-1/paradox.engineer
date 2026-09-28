import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = 'https://paradox.engineer';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/latest`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/student`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/startups`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/no-credit-card`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Category types
  const categoryTypes = ['freebies', 'discounts', 'trials', 'credits', 'promo-codes'];
  const categoryRoutes: MetadataRoute.Sitemap = categoryTypes.map((type) => ({
    url: `${BASE_URL}/category/${type}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Fetch dynamic deals
  const deals = await prisma.deal.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const dealRoutes: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${BASE_URL}/resources/${deal.slug}`,
    lastModified: deal.updatedAt,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // Fetch dynamic brands
  const brands = await prisma.brand.findMany({
    where: { deals: { some: { isActive: true } } },
    select: { slug: true, updatedAt: true },
  });

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${BASE_URL}/brands/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // Fetch dynamic topics
  const topics = await prisma.topic.findMany({
    select: { slug: true, updatedAt: true },
  });

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${BASE_URL}/topics/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...dealRoutes,
    ...brandRoutes,
    ...topicRoutes,
  ];
}
