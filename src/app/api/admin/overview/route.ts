import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      totalDeals,
      totalBrands,
      totalTopics,
      totalSubscribers,
      pendingSubmissions,
      pendingSubmissionsList,
      recentDealsRaw,
    ] = await Promise.all([
      prisma.deal.count({ where: { isActive: true } }),
      prisma.brand.count(),
      prisma.topic.count(),
      prisma.subscriber.count(),
      prisma.dealSubmission.count({ where: { status: { in: ['pending', 'PENDING'] } } }),
      prisma.dealSubmission.findMany({
        where: { status: { in: ['pending', 'PENDING'] } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.deal.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { brand: true },
      }),
    ]);

    const recentDeals = recentDealsRaw.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      brandName: d.brand.name,
      dealType: d.dealType,
      clickCount: d.clickCount,
      viewCount: d.viewCount,
      isActive: d.isActive,
    }));

    return NextResponse.json({
      stats: {
        totalDeals,
        totalBrands,
        totalTopics,
        totalSubscribers,
        pendingSubmissions,
      },
      pendingSubmissions: pendingSubmissionsList,
      recentDeals,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
