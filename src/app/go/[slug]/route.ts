import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const deal = await prisma.deal.findUnique({
      where: { slug },
      include: { brand: true },
    });

    if (!deal) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Increment click telemetry
    await prisma.deal.update({
      where: { id: deal.id },
      data: { clickCount: { increment: 1 } },
    }).catch(() => {});

    let rawUrl = deal.claimUrl || deal.affiliateUrl || deal.brand?.website || '/';
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('/')) {
      rawUrl = `https://${rawUrl}`;
    }
    const targetUrl = rawUrl.startsWith('/') ? new URL(rawUrl, req.url) : new URL(rawUrl);
    return NextResponse.redirect(targetUrl, 307);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
