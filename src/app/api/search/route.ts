import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import catalogData from '../../../../prisma/catalog-data.json';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query) {
      return NextResponse.json({ deals: [], brands: [], topics: [], totalMatches: 0 });
    }

    const qLower = query.toLowerCase();

    // 1. Try Live DB search first
    try {
      const [deals, brands, topics] = await Promise.all([
        prisma.deal.findMany({
          where: {
            isActive: true,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { shortDescription: { contains: query, mode: 'insensitive' } },
              { promoCode: { contains: query, mode: 'insensitive' } },
              { brand: { name: { contains: query, mode: 'insensitive' } } },
              { topic: { name: { contains: query, mode: 'insensitive' } } },
            ],
          },
          select: {
            id: true,
            title: true,
            slug: true,
            dealType: true,
            discountAmount: true,
            promoCode: true,
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
          take: 6,
          orderBy: { clickCount: 'desc' },
        }),
        prisma.brand.findMany({
          where: {
            name: { contains: query, mode: 'insensitive' },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            website: true,
            _count: { select: { deals: { where: { isActive: true } } } },
          },
          take: 4,
          orderBy: { deals: { _count: 'desc' } },
        }),
        prisma.topic.findMany({
          where: {
            name: { contains: query, mode: 'insensitive' },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            _count: { select: { deals: { where: { isActive: true } } } },
          },
          take: 3,
        }),
      ]);

      if (deals.length > 0 || brands.length > 0 || topics.length > 0) {
        return NextResponse.json({
          deals,
          brands,
          topics,
          totalMatches: deals.length,
        });
      }
    } catch {
      // Fallback to in-memory catalog search below
    }

    // 2. High-speed in-memory fallback search
    const brandsMap = new Map((catalogData.brands || []).map((b: any) => [b.id, b]));
    const topicsMap = new Map((catalogData.topics || []).map((t: any) => [t.id, t]));

    const matchingDeals = (catalogData.deals || [])
      .filter((d: any) => d.isActive)
      .map((d: any) => {
        const b = brandsMap.get(d.brandId);
        const t = topicsMap.get(d.topicId);
        return {
          id: d.id,
          title: d.title,
          slug: d.slug,
          dealType: d.dealType,
          discountAmount: d.discountAmount,
          promoCode: d.promoCode,
          brand: {
            name: b?.name || 'Partner',
            slug: b?.slug || 'partner',
            logoUrl: b?.logoUrl || null,
            website: b?.website || null,
          },
          topic: {
            name: t?.name || 'Tools',
            slug: t?.slug || 'tools',
          },
        };
      })
      .filter(
        (d: any) =>
          d.title.toLowerCase().includes(qLower) ||
          d.brand.name.toLowerCase().includes(qLower) ||
          d.topic.name.toLowerCase().includes(qLower) ||
          (d.promoCode && d.promoCode.toLowerCase().includes(qLower))
      )
      .slice(0, 6);

    const matchingBrands = (catalogData.brands || [])
      .filter((b: any) => b.name.toLowerCase().includes(qLower))
      .slice(0, 4)
      .map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logoUrl: b.logoUrl,
        website: b.website,
        _count: {
          deals: (catalogData.deals || []).filter((d: any) => d.brandId === b.id && d.isActive).length,
        },
      }));

    const matchingTopics = (catalogData.topics || [])
      .filter((t: any) => t.name.toLowerCase().includes(qLower))
      .slice(0, 3)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        icon: t.icon,
        _count: {
          deals: (catalogData.deals || []).filter((d: any) => d.topicId === t.id && d.isActive).length,
        },
      }));

    return NextResponse.json({
      deals: matchingDeals,
      brands: matchingBrands,
      topics: matchingTopics,
      totalMatches: matchingDeals.length,
    });
  } catch (error) {
    console.error('Instant search error:', error);
    return NextResponse.json({ deals: [], brands: [], topics: [], totalMatches: 0 });
  }
}
