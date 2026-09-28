import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchDiscoveredDeals } from '@/lib/deal-crawler';
import { requireAdmin } from '@/lib/admin-auth';
import { fallbackDeals } from '@/lib/public-data';
import { DISCOVERY_CANDIDATES } from '@/lib/crawler/candidates';

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    let discovered: any[] = [];
    try {
      discovered = await fetchDiscoveredDeals();
    } catch {
      discovered = [...DISCOVERY_CANDIDATES];
    }

    if (!discovered || discovered.length === 0) {
      discovered = [...DISCOVERY_CANDIDATES];
    }

    // Check which deals are already published in the live catalog
    let existingDeals: Array<{
      id: string;
      slug: string;
      title: string;
      isActive: boolean;
      promoCode: string | null;
      discountAmount: string | null;
      brand?: {
        name: string;
        slug: string;
      };
    }> = [];

    try {
      existingDeals = await prisma.deal.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          isActive: true,
          promoCode: true,
          discountAmount: true,
          brand: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });
    } catch {
      // Gracefully fall back to catalog snapshot if database is temporarily offline
      existingDeals = fallbackDeals.map((d: any) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        isActive: Boolean(d.isActive),
        promoCode: d.promoCode || null,
        discountAmount: d.discountAmount || null,
        brand: {
          name: d.brand?.name || 'Partner',
          slug: d.brand?.slug || 'partner',
        },
      }));
    }

    const existingSlugMap = new Map(existingDeals.map((d) => [d.slug, d]));

    const enrichedDeals = discovered.map((d) => {
      const existing = existingSlugMap.get(d.slug);
      return {
        ...d,
        isPublished: !!existing,
        existingDealId: existing?.id || null,
        existingIsActive: existing ? existing.isActive : null,
      };
    });

    const stats = {
      totalDiscovered: enrichedDeals.length,
      codeGenerationAvailable: enrichedDeals.filter((d) => d.canGenerateOwnCode).length,
      alreadyInCatalog: enrichedDeals.filter((d) => d.isPublished).length,
      pendingReview: enrichedDeals.filter((d) => !d.isPublished).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      deals: enrichedDeals,
    });
  } catch (error) {
    console.error('Error in /api/admin/crawler/discovered:', error);
    // Never return an empty 500 error: always provide candidate deals
    const fallbackList = [...DISCOVERY_CANDIDATES];
    return NextResponse.json({
      success: true,
      stats: {
        totalDiscovered: fallbackList.length,
        codeGenerationAvailable: fallbackList.filter((d) => d.canGenerateOwnCode).length,
        alreadyInCatalog: 0,
        pendingReview: fallbackList.length,
      },
      deals: fallbackList.map((d) => ({
        ...d,
        isPublished: false,
        existingDealId: null,
        existingIsActive: null,
      })),
    });
  }
}
