import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { revalidateTag } from 'next/cache';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (typeof body.title === 'string') updateData.title = body.title;
    if (typeof body.discountAmount === 'string') updateData.discountAmount = body.discountAmount;
    if (typeof body.promoCode === 'string') updateData.promoCode = body.promoCode || null;
    if (typeof body.commissionRate === 'string') updateData.commissionRate = body.commissionRate || null;
    if (typeof body.claimUrl === 'string') {
      updateData.claimUrl = body.claimUrl;
      updateData.affiliateUrl = body.claimUrl;
    }
    if (typeof body.shortDescription === 'string') updateData.shortDescription = body.shortDescription;
    if (typeof body.fullDescription === 'string') updateData.fullDescription = body.fullDescription;
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;
    if (typeof body.isTrending === 'boolean') updateData.isTrending = body.isTrending;
    if (typeof body.isLimitedTime === 'boolean') updateData.isLimitedTime = body.isLimitedTime;
    if (typeof body.isStudentDeal === 'boolean') updateData.isStudentDeal = body.isStudentDeal;
    if (typeof body.isStartupDeal === 'boolean') updateData.isStartupDeal = body.isStartupDeal;
    if (typeof body.needsCreditCard === 'boolean') updateData.needsCreditCard = body.needsCreditCard;
    if (body.expiryDate !== undefined) {
      updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: { brand: true, topic: true },
    });

    revalidateTag('paradox:deals', 'max');
    revalidateTag('paradox:brands', 'max');

    return NextResponse.json({ success: true, deal: updated });
  } catch (error) {
    console.error('Failed to update deal:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    revalidateTag('paradox:deals', 'max');
    revalidateTag('paradox:brands', 'max');

    return NextResponse.json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Failed to delete deal:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
