import { cacheLife } from 'next/cache';
import { prisma } from '@/lib/db';

export async function getPublicDeals() {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });

  return prisma.deal.findMany({
    where: { isActive: true },
    include: { brand: true, topic: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPublicTopics() {
  'use cache';
  cacheLife({ stale: 300, revalidate: 300, expire: 900 });

  return prisma.topic.findMany({
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
}

export async function getPublicBrands() {
  'use cache';
  cacheLife({ stale: 120, revalidate: 120, expire: 600 });

  return prisma.brand.findMany({
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
}

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
