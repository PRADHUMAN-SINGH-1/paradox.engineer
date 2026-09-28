import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { after } from 'next/server';
import { sendSubscriptionWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const subscriber = await prisma.subscriber.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    });

    after(() =>
      sendSubscriptionWelcomeEmail(normalizedEmail).catch((error) =>
        console.error('Subscription welcome email failed:', error)
      )
    );

    return NextResponse.json({ success: true, subscriber }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe or already subscribed' }, { status: 500 });
  }
}
