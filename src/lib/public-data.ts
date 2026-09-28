import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import catalogData from '../../prisma/catalog-data.json';

// Pre-computed fallback indexes for resilient offline/build serving
const fallbackBrandsRaw = catalogData.brands || [];
const fallbackTopicsRaw = catalogData.topics || [];
const fallbackDealsRaw = (catalogData.deals || []).filter((d: any) => d.isActive);

const brandsMap = new Map(fallbackBrandsRaw.map((b: any) => [b.id, b]));
const topicsMap = new Map(fallbackTopicsRaw.map((t: any) => [t.id, t]));

export const fallbackDeals = fallbackDealsRaw.map((d: any) => {
  const b = brandsMap.get(d.brandId);
  const t = topicsMap.get(d.topicId);
  return {
    ...d,
    brand: {
      name: b?.name || 'Partner',
      slug: b?.slug || 'partner',
      logoUrl: b?.logoUrl || null,
      website: b?.website || null,
    },
    topic: {
      id: t?.id || d.topicId,
      name: t?.name || 'Tools',
      slug: t?.slug || 'tools',
      icon: t?.icon || '🏷️',
    },
  };
});

export const fallbackTopics = fallbackTopicsRaw.map((t: any) => ({
  id: t.id,
  name: t.name,
  slug: t.slug,
  icon: t.icon,
  _count: {
    deals: fallbackDeals.filter((d: any) => d.topicId === t.id).length,
  },
}));

export const fallbackBrands = fallbackBrandsRaw.map((b: any) => ({
  id: b.id,
  name: b.name,
  slug: b.slug,
  logoUrl: b.logoUrl,
  website: b.website,
  deals: fallbackDeals
    .filter((d: any) => d.brandId === b.id)
    .map((d: any) => ({
      id: d.id,
      dealType: d.dealType,
      isTrending: Boolean(d.isTrending),
      clickCount: d.clickCount || 0,
      viewCount: d.viewCount || 0,
      topic: { slug: d.topic?.slug || 'tools' },
    })),
  _count: {
    deals: fallbackDeals.filter((d: any) => d.brandId === b.id).length,
  },
}));

export const getPublicDeals = unstable_cache(
  async () => {
    try {
      return await prisma.deal.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          slug: true,
          dealType: true,
          discountAmount: true,
          promoCode: true,
          clickCount: true,
          viewCount: true,
          isTrending: true,
          isLimitedTime: true,
          isStudentDeal: true,
          isStartupDeal: true,
          needsCreditCard: true,
          expiryDate: true,
          createdAt: true,
          updatedAt: true,
          brand: {
            select: {
              name: true,
              slug: true,
              logoUrl: true,
              website: true,
            },
          },
          topic: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return fallbackDeals;
    }
  },
  ['paradox-public-active-deals-v6'],
  { revalidate: 60, tags: ['paradox:deals'] }
);

export const getPublicTopics = unstable_cache(
  async () => {
    try {
      return await prisma.topic.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          _count: {
            select: { deals: { where: { isActive: true } } },
          },
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return fallbackTopics;
    }
  },
  ['paradox-public-topics-v6'],
  { revalidate: 300, tags: ['paradox:topics'] }
);

export const getDealTypeCounts = unstable_cache(
  async () => {
    try {
      return await prisma.deal.groupBy({
        by: ['dealType'],
        where: { isActive: true },
        _count: { id: true },
      });
    } catch {
      const counts: Record<string, number> = {};
      for (const d of fallbackDeals) {
        counts[d.dealType] = (counts[d.dealType] || 0) + 1;
      }
      return Object.entries(counts).map(([dealType, count]) => ({
        dealType,
        _count: { id: count },
      }));
    }
  },
  ['paradox-public-deal-type-counts-v6'],
  { revalidate: 60, tags: ['paradox:deals'] }
);

export const getPopularBrands = unstable_cache(
  async () => {
    try {
      return await prisma.brand.findMany({
        where: { deals: { some: { isActive: true } } },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          website: true,
          _count: {
            select: { deals: { where: { isActive: true } } },
          },
        },
        orderBy: { name: 'asc' },
        take: 16,
      });
    } catch {
      return fallbackBrands.filter((b) => b._count.deals > 0).slice(0, 16);
    }
  },
  ['paradox-public-popular-brands-v6'],
  { revalidate: 120, tags: ['paradox:brands', 'paradox:deals'] }
);

export const getPublicBrands = unstable_cache(
  async () => {
    try {
      return await prisma.brand.findMany({
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
      });
    } catch {
      return fallbackBrands;
    }
  },
  ['paradox-public-brands-v6'],
  { revalidate: 120, tags: ['paradox:brands', 'paradox:deals'] }
);

export const getBrandBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        const brand = await prisma.brand.findUnique({
          where: { slug },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            website: true,
            deals: {
              where: { isActive: true },
              select: {
                id: true,
                title: true,
                shortDescription: true,
                slug: true,
                dealType: true,
                discountAmount: true,
                promoCode: true,
                clickCount: true,
                viewCount: true,
                isTrending: true,
                isLimitedTime: true,
                isStudentDeal: true,
                isStartupDeal: true,
                needsCreditCard: true,
                expiryDate: true,
                createdAt: true,
                updatedAt: true,
                brand: {
                  select: {
                    name: true,
                    slug: true,
                    logoUrl: true,
                    website: true,
                  },
                },
                topic: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
        if (brand) return brand;
      } catch {
        // Fallback
      }
      return fallbackBrands.find((b) => b.slug === slug) || null;
    },
    ['paradox-brand', slug],
    { revalidate: 120, tags: ['paradox:brand:' + slug, 'paradox:brands', 'paradox:deals'] }
  )();

export const getTopicBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        const topic = await prisma.topic.findUnique({
          where: { slug },
        });
        if (topic) return topic;
      } catch {
        // Fallback
      }
      return fallbackTopicsRaw.find((t: any) => t.slug === slug) || null;
    },
    ['paradox-topic', slug],
    { revalidate: 300, tags: ['paradox:topic:' + slug, 'paradox:topics'] }
  )();

export const getDealsByTopic = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        return await prisma.deal.findMany({
          where: { topic: { slug }, isActive: true },
          select: {
            id: true,
            title: true,
            shortDescription: true,
            slug: true,
            dealType: true,
            discountAmount: true,
            promoCode: true,
            clickCount: true,
            viewCount: true,
            isTrending: true,
            isLimitedTime: true,
            isStudentDeal: true,
            isStartupDeal: true,
            needsCreditCard: true,
            expiryDate: true,
            createdAt: true,
            updatedAt: true,
            brand: {
              select: {
                name: true,
                slug: true,
                logoUrl: true,
                website: true,
              },
            },
            topic: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        return fallbackDeals.filter((d: any) => d.topic?.slug === slug);
      }
    },
    ['paradox-topic-deals', slug],
    { revalidate: 120, tags: ['paradox:topic:' + slug, 'paradox:deals'] }
  )();

export const getRelatedDeals = (topicSlug: string, excludeSlug: string) =>
  unstable_cache(
    async () => {
      try {
        return await prisma.deal.findMany({
          where: {
            isActive: true,
            slug: { not: excludeSlug },
            topic: { slug: topicSlug },
          },
          select: {
            id: true,
            title: true,
            shortDescription: true,
            slug: true,
            dealType: true,
            discountAmount: true,
            promoCode: true,
            clickCount: true,
            viewCount: true,
            isTrending: true,
            isLimitedTime: true,
            isStudentDeal: true,
            isStartupDeal: true,
            needsCreditCard: true,
            expiryDate: true,
            createdAt: true,
            updatedAt: true,
            brand: {
              select: {
                name: true,
                slug: true,
                logoUrl: true,
                website: true,
              },
            },
            topic: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 4,
        });
      } catch {
        return fallbackDeals
          .filter((d: any) => d.topic?.slug === topicSlug && d.slug !== excludeSlug)
          .slice(0, 4);
      }
    },
    ['paradox-related-deals', topicSlug, excludeSlug],
    { revalidate: 120, tags: ['paradox:topic:' + topicSlug, 'paradox:deals'] }
  )();

export const getDealBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        const deal = await prisma.deal.findUnique({
          where: { slug },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            fullDescription: true,
            dealType: true,
            discountAmount: true,
            promoCode: true,
            affiliateUrl: true,
            claimUrl: true,
            howToClaim: true,
            keyBenefits: true,
            eligibility: true,
            termsUrl: true,
            isStudentDeal: true,
            isStartupDeal: true,
            needsCreditCard: true,
            isTrending: true,
            isLimitedTime: true,
            clickCount: true,
            viewCount: true,
            expiryDate: true,
            createdAt: true,
            updatedAt: true,
            brand: { select: { id: true, name: true, slug: true, logoUrl: true, website: true } },
            topic: { select: { id: true, name: true, slug: true, icon: true } },
          },
        });
        if (deal) return deal;
      } catch {
        // Fallback
      }
      return fallbackDeals.find((d: any) => d.slug === slug) || null;
    },
    ['paradox-deal', slug],
    { revalidate: 300, tags: ['paradox:deal:' + slug, 'paradox:deals'] }
  )();

export function sortDeals(deals: any[], sortParam: string): any[] {
  const sorted = [...deals];

  if (sortParam === 'popular') {
    sorted.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sortParam === 'claimed') {
    sorted.sort((a, b) => b.clickCount - a.clickCount);
  } else if (sortParam === 'last_updated') {
    sorted.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } else {
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return sorted;
}

export function paginateDeals<T>(deals: T[], page: number, limit = 12): T[] {
  const start = Math.max(0, (page - 1) * limit);
  return deals.slice(start, start + limit);
}

export function matchesDealSearch(deal: any, searchQuery: string): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;

  const text = [
    deal.title,
    deal.shortDescription,
    deal.brand?.name,
    deal.topic?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const keywordMatch =
    ((query.includes('student') || query.includes('edu')) && deal.isStudentDeal) ||
    ((query.includes('no cc') ||
      query.includes('nocc') ||
      query.includes('no credit card')) &&
      !deal.needsCreditCard) ||
    (query.includes('startup') && deal.isStartupDeal) ||
    (query.includes('credit') && deal.dealType === 'credit') ||
    ((query.includes('free') || query.includes('freebie')) &&
      deal.dealType === 'freebie') ||
    (query.includes('trial') && deal.dealType === 'trial');

  return text.includes(query) || Boolean(keywordMatch);
}
