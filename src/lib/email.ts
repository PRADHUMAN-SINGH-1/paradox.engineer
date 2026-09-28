import { prisma } from '@/lib/db';

const RESEND_API_URL = 'https://api.resend.com';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('Email service is not configured');
  }

  return { apiKey, from };
}

async function resendRequest(path: string, body: unknown, idempotencyKey: string) {
  const { apiKey } = getConfig();

  const response = await fetch(`${RESEND_API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email provider error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  idempotencyKey,
  replyTo,
}: {
  to: string[];
  subject: string;
  html: string;
  idempotencyKey: string;
  replyTo?: string;
}) {
  const { from } = getConfig();

  return resendRequest(
    '/emails',
    {
      from,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    },
    idempotencyKey,
  );
}

export async function sendNewDealNotifications(deal: {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  discountAmount?: string | null;
  dealType: string;
  brandName: string;
}) {
  const subscribers = await prisma.subscriber.findMany({
    select: { email: true },
    orderBy: { createdAt: 'asc' },
  });

  if (subscribers.length === 0) return { sent: 0 };

  const { from } = getConfig();
  const batches: Array<{ email: string }[]> = [];

  for (let i = 0; i < subscribers.length; i += 100) {
    batches.push(subscribers.slice(i, i + 100));
  }

  let sent = 0;

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    await resendRequest(
      '/emails/batch',
      batch.map(({ email }) => ({
        from,
        to: [email],
        subject: `New Paradox deal: ${deal.title}`,
        html: newDealEmailHtml(deal),
        tags: [
          { name: 'category', value: 'new_deal' },
          { name: 'deal_id', value: deal.id },
        ],
      })),
      `new-deal-${deal.id}-batch-${batchIndex}`,
    );
    sent += batch.length;
  }

  return { sent };
}

function newDealEmailHtml(deal: {
  slug: string;
  title: string;
  shortDescription: string;
  discountAmount?: string | null;
  dealType: string;
  brandName: string;
}) {
  const dealUrl = `https://www.paradox.engineer/resources/${encodeURIComponent(deal.slug)}`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px;">
        <div style="font-size:14px;font-weight:700;color:#2563eb;margin-bottom:18px;">PARADOX • NEW DEAL</div>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 10px;">${escapeHtml(deal.title)}</h1>
        <p style="margin:0 0 6px;color:#64748b;font-size:14px;">${escapeHtml(deal.brandName)} · ${escapeHtml(deal.dealType)}</p>
        ${deal.discountAmount ? `<div style="display:inline-block;margin:12px 0;padding:7px 11px;border-radius:9px;background:#eff6ff;color:#1d4ed8;font-weight:700;">${escapeHtml(deal.discountAmount)}</div>` : ''}
        <p style="font-size:15px;line-height:1.65;color:#475569;">${escapeHtml(deal.shortDescription)}</p>
        <a href="${dealUrl}" style="display:inline-block;margin-top:10px;padding:13px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">View Deal</a>
        <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">You received this because you subscribed to the Paradox developer perks digest.</p>
      </div>
    </div>
  </body>
</html>`;
}

export async function sendDealSubmissionNotification(submission: {
  id: string;
  brandName: string;
  dealTitle: string;
  dealUrl: string;
  description?: string | null;
  submittedBy?: string | null;
}) {
  const adminEmail = 'pradhumansingh196@gmail.com';

  return sendTransactionalEmail({
    to: [adminEmail],
    subject: `New Paradox deal submission: ${submission.dealTitle}`,
    replyTo: submission.submittedBy || undefined,
    idempotencyKey: `deal-submission-${submission.id}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;padding:28px 18px;">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:26px;">
        <div style="font-size:13px;font-weight:700;color:#2563eb;margin-bottom:16px;">PARADOX • NEW SUBMISSION</div>
        <h1 style="font-size:24px;margin:0 0 14px;">${escapeHtml(submission.dealTitle)}</h1>
        <p><strong>Brand:</strong> ${escapeHtml(submission.brandName)}</p>
        <p><strong>Offer URL:</strong> <a href="${escapeHtml(submission.dealUrl)}">${escapeHtml(submission.dealUrl)}</a></p>
        <p><strong>Submitted by:</strong> ${escapeHtml(submission.submittedBy || 'Not provided')}</p>
        <p><strong>Description:</strong><br>${escapeHtml(submission.description || 'Not provided')}</p>
        <p><strong>Submission ID:</strong> ${escapeHtml(submission.id)}</p>
      </div>
    </div>
  </body>
</html>`,
  });
}

export async function sendSubscriptionWelcomeEmail(email: string) {
  return sendTransactionalEmail({
    to: [email],
    subject: 'Welcome to the Paradox developer perks digest',
    idempotencyKey: `subscriber-welcome-${email.toLowerCase()}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px;">
        <div style="font-size:14px;font-weight:700;color:#2563eb;margin-bottom:16px;">PARADOX</div>
        <h1 style="font-size:26px;margin:0 0 10px;">You're subscribed.</h1>
        <p style="font-size:15px;line-height:1.6;color:#475569;">We'll email you when new developer deals and perks are published.</p>
        <a href="https://www.paradox.engineer" style="display:inline-block;margin-top:10px;padding:13px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">Browse Paradox</a>
      </div>
    </div>
  </body>
</html>`,
  });
}

export async function sendDealPublishedEmail(email: string, deal: {
  id: string;
  slug: string;
  title: string;
  brandName: string;
}) {
  return sendTransactionalEmail({
    to: [email],
    subject: `Your Paradox deal is live: ${deal.title}`,
    idempotencyKey: `deal-published-${deal.id}-${email.toLowerCase()}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px;">
        <div style="font-size:14px;font-weight:700;color:#059669;margin-bottom:16px;">PARADOX • PUBLISHED</div>
        <h1 style="font-size:26px;margin:0 0 10px;">${escapeHtml(deal.title)}</h1>
        <p style="font-size:15px;line-height:1.6;color:#475569;">Your submitted ${escapeHtml(deal.brandName)} deal has been published in the Paradox directory.</p>
        <a href="https://www.paradox.engineer/resources/${encodeURIComponent(deal.slug)}" style="display:inline-block;margin-top:10px;padding:13px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">View Published Deal</a>
      </div>
    </div>
  </body>
</html>`,
  });
}
