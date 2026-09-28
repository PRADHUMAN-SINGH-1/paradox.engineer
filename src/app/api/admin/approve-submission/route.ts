import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { sendDealPublishedEmail, sendNewDealNotifications } from '@/lib/email';

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    const submission = await prisma.dealSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 1. Ensure Brand exists
    const brandSlug = submission.brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let domain = '';
    try {
      domain = new URL(submission.dealUrl).hostname;
    } catch {
      domain = `${brandSlug}.com`;
    }
    const computedLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    let brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
    });

    if (!brand) {
      brand = await prisma.brand.create({
        data: {
          name: submission.brandName,
          slug: brandSlug,
          website: submission.dealUrl,
          logoUrl: computedLogo,
        },
      });
    }

    // 2. Assign default Topic (e.g. Developer Tools)
    let topic = await prisma.topic.findFirst({
      where: { slug: 'vibe-coding' },
    });
    if (!topic) {
      topic = await prisma.topic.findFirst();
    }
    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          name: 'Developer Tools',
          slug: 'vibe-coding',
          icon: '💻',
        },
      });
    }

    // 3. Generate unique deal slug
    const baseSlug = `${brandSlug}-${submission.dealTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`.slice(0, 40);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // 4. Create live Deal
    const deal = await prisma.deal.create({
      data: {
        title: submission.dealTitle,
        slug: uniqueSlug,
        shortDescription: submission.description || `Special developer perk from ${submission.brandName}.`,
        fullDescription: submission.description || `Special developer discount and credit tier for ${submission.brandName}. Click Claim Deal to activate.`,
        dealType: 'credit',
        discountAmount: 'Promotional Tier',
        claimUrl: submission.dealUrl,
        howToClaim: JSON.stringify([
          `Navigate to ${submission.brandName} promotional portal via the claim link.`,
          'Register or sign in with your developer credentials.',
          'Complete activation to receive the credits.',
        ]),
        keyBenefits: JSON.stringify([
          'Official partner promotional credit tier',
          'Instant developer activation',
        ]),
        eligibility: JSON.stringify([
          'New account registrations or active developers',
        ]),
        isActive: true,
        isTrending: true,
        needsCreditCard: false,
        isStudentDeal: false,
        isStartupDeal: false,
        brandId: brand.id,
        topicId: topic.id,
        clickCount: 1,
        viewCount: 10,
      },
    });

    // 5. Update submission status to approved
    await prisma.dealSubmission.update({
      where: { id: submissionId },
      data: { status: 'approved' },
    });

    revalidateTag('paradox:deals', 'max');
    revalidateTag('paradox:brands', 'max');
    revalidateTag('paradox:topics', 'max');

    after(async () => {
      if (submission.submittedBy) {
        await sendDealPublishedEmail(submission.submittedBy, {
          id: deal.id,
          slug: deal.slug,
          title: deal.title,
          brandName: brand.name,
        }).catch((error) => console.error('Submitter publication email failed:', error));
      }

      await sendNewDealNotifications({
        id: deal.id,
        slug: deal.slug,
        title: deal.title,
        shortDescription: deal.shortDescription,
        discountAmount: deal.discountAmount,
        dealType: deal.dealType,
        brandName: brand.name,
      }).catch((error) => console.error('New deal subscriber emails failed:', error));
    });

    return NextResponse.json({ success: true, deal, brand });
  } catch (error) {
    console.error('Failed to approve deal submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
