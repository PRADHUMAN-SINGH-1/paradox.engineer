import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: { isActive: !deal.isActive },
      select: { id: true, title: true, isActive: true },
    });

    return NextResponse.json({ success: true, deal: updated });
  } catch (error) {
    console.error('Failed to toggle deal status:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
