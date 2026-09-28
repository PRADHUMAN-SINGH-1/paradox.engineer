import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { after } from 'next/server';
import { sendDealSubmissionNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { brandName, dealTitle, dealUrl, description, submittedBy } = data;

    if (!brandName || !dealTitle || !dealUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dealSubmission = await prisma.dealSubmission.create({
      data: {
        brandName,
        dealTitle,
        dealUrl,
        description: description || null,
        submittedBy: submittedBy || null,
        status: 'PENDING'
      },
    });

    after(() =>
      sendDealSubmissionNotification(dealSubmission).catch((error) =>
        console.error('Admin submission email failed:', error)
      )
    );

    return NextResponse.json({ success: true, dealSubmission }, { status: 201 });
  } catch (error) {
    console.error('Deal submission error:', error);
    return NextResponse.json({ error: 'Failed to submit deal' }, { status: 500 });
  }
}
