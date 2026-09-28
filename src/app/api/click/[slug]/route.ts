import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const deal = await prisma.deal.update({
      where: { slug },
      data: { clickCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, clickCount: deal.clickCount }, { status: 200 });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
