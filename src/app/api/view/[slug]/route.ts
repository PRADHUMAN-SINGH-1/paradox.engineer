import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.deal.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('View tracking failed:', error);
    return new NextResponse(null, { status: 204 });
  }
}
