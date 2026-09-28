import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

export const getPublicDeals = unstable_cache(
  async () =>
    prisma.deal.findMany({
      where: { isActive: true },
      include: { brand: true, topic: true },
      orderBy: { createdAt: 'desc' },
    }),
  ['paradox-public-active-deals-v4'],
  { revalidate: 60 }
);

export const getPublicTopics = unstable_cache(
  async () =>
    prisma.topic.findMany({
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
    }),
  ['paradox-public-topics-v4'],
  { revalidate: 300 }
);

export const getPublicBrands = unstable_cache(
  async () =>
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
  ['paradox-public-brands-v4'],
  { revalidate: 120 }
);

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
    deal.fullDescription,
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
