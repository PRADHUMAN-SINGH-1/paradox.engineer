import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const query = searchParams.get('q')?.trim() || '';

    const where: any = {};

    if (filter === 'active') {
      where.isActive = true;
      where.OR = [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } },
      ];
    } else if (filter === 'inactive') {
      where.isActive = false;
    } else if (filter === 'expired') {
      where.expiryDate = { lte: new Date() };
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { shortDescription: { contains: query } },
        { brand: { name: { contains: query } } },
      ];
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, slug: true, logoUrl: true, website: true } },
        topic: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, deals });
  } catch (error) {
    console.error('Failed to fetch admin deals:', error);
    return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const {
      title,
      brandName,
      brandWebsite,
      topicSlug,
      dealType,
      discountAmount,
      promoCode,
      commissionRate,
      claimUrl,
      shortDescription,
      fullDescription,
      expiryDate,
      isStudentDeal,
      isStartupDeal,
      needsCreditCard,
      isTrending,
      isLimitedTime,
      howToClaim,
      keyBenefits,
      eligibility,
    } = body;

    if (!title || !brandName || !claimUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, Brand Name, and Claim URL are required' },
        { status: 400 }
      );
    }

    // 1. Find or create brand
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) {
      const domain = brandWebsite ? new URL(brandWebsite.startsWith('http') ? brandWebsite : `https://${brandWebsite}`).hostname : `${brandSlug}.com`;
      brand = await prisma.brand.create({
        data: {
          name: brandName,
          slug: brandSlug,
          website: brandWebsite || `https://${domain}`,
          logoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        },
      });
    }

    // 2. Find topic
    let topic = await prisma.topic.findUnique({ where: { slug: topicSlug || 'ai' } });
    if (!topic) {
      topic = await prisma.topic.findFirst();
    }

    if (!topic) {
      return NextResponse.json({ success: false, error: 'No category topic found' }, { status: 400 });
    }

    // 3. Generate unique deal slug
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);
    let slug = `${brand.slug}-${cleanTitle}`;
    let counter = 1;
    while (await prisma.deal.findUnique({ where: { slug } })) {
      slug = `${brand.slug}-${cleanTitle}-${counter++}`;
    }

    // 4. Create deal
    const deal = await prisma.deal.create({
      data: {
        title,
        slug,
        shortDescription: shortDescription || `${brandName} promotional discount and developer tier grant.`,
        fullDescription: fullDescription || `${brandName} offer valid for eligible developers and organizations.`,
        dealType: dealType || 'discount',
        discountAmount: discountAmount || null,
        promoCode: promoCode || null,
        commissionRate: commissionRate || null,
        claimUrl,
        affiliateUrl: claimUrl,
        howToClaim: JSON.stringify(Array.isArray(howToClaim) ? howToClaim : [
          `Visit the official ${brandName} offer portal`,
          'Complete the application or enter promo code at checkout',
          'Access your credits or subscription upgrade'
        ]),
        keyBenefits: JSON.stringify(Array.isArray(keyBenefits) ? keyBenefits : [
          discountAmount || 'Verified promotional discount',
          'Instant access to platform capabilities',
        ]),
        eligibility: JSON.stringify(Array.isArray(eligibility) ? eligibility : [
          'Eligible new and existing users',
        ]),
        isStudentDeal: Boolean(isStudentDeal),
        isStartupDeal: Boolean(isStartupDeal),
        needsCreditCard: Boolean(needsCreditCard),
        isTrending: Boolean(isTrending),
        isLimitedTime: Boolean(isLimitedTime),
        isActive: true,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        brandId: brand.id,
        topicId: topic.id,
      },
    });

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error('Failed to create deal:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
