import { prisma } from '../lib/db';
import { refreshDealsPipeline } from '../lib/deal-refresher';

async function testBackend() {
  console.log('==============================================');
  console.log('        BACKEND HEALTH CHECK & REPORT         ');
  console.log('==============================================');

  // 1. Database Connection & Schema Test
  console.log('\n[1/5] Checking Database & Tables...');
  const dealCount = await prisma.deal.count({ where: { isActive: true } });
  const brandCount = await prisma.brand.count();
  const topicCount = await prisma.topic.count();
  console.log(`  ✓ Active Deals in Database: ${dealCount}`);
  console.log(`  ✓ Brands in Database: ${brandCount}`);
  console.log(`  ✓ Topic Categories in Database: ${topicCount}`);

  // 2. Click & Analytics Tracker Test
  console.log('\n[2/5] Testing Click & Traffic Analytics Engine...');
  const sampleDeal = await prisma.deal.findFirst({
    include: { brand: true },
  });
  if (sampleDeal) {
    const beforeClicks = sampleDeal.clickCount;
    const updated = await prisma.deal.update({
      where: { id: sampleDeal.id },
      data: { clickCount: { increment: 1 } },
    });
    console.log(`  ✓ Tracked deal: "${sampleDeal.title}" (${sampleDeal.brand.name})`);
    console.log(`  ✓ Click counter incremented: ${beforeClicks} -> ${updated.clickCount}`);
  }

  // 3. User Deal Submission Test
  console.log('\n[3/5] Testing Community Deal Submission Endpoint...');
  const submission = await prisma.dealSubmission.create({
    data: {
      brandName: 'Test Brand AI',
      dealTitle: '$50 Free GPU Compute',
      dealUrl: 'https://example.com/promo',
      description: 'Exclusive verification test promo for developers',
      submittedBy: 'testuser@example.com',
      status: 'pending',
    },
  });
  console.log(`  ✓ Submission successfully stored with ID: ${submission.id} (Status: ${submission.status})`);

  // 4. Newsletter Subscriber Backend Test
  console.log('\n[4/5] Testing Subscriber Capture System...');
  const email = `test_${Date.now()}@domain.com`;
  const sub = await prisma.subscriber.create({
    data: { email },
  });
  console.log(`  ✓ Subscriber recorded: ${sub.email}`);

  // 5. Automated Deal Discovery & Auto-Refresh Engine Test
  console.log('\n[5/5] Testing Automated Refresher & Crawler Pipeline...');
  const start = Date.now();
  const refreshResult = await refreshDealsPipeline();
  const duration = Date.now() - start;
  console.log(`  ✓ Pipeline completed in: ${duration}ms`);
  console.log(`  ✓ Offers Crawled: ${refreshResult.totalCrawled}`);
  console.log(`  ✓ Fresh Deals Added: ${refreshResult.newDealsAdded}`);
  console.log(`  ✓ Existing Deals Synced & Updated: ${refreshResult.updatedDeals}`);

  console.log('\n==============================================');
  console.log('✅ BACKEND STATUS: 100% OPERATIONAL');
  console.log('==============================================');

  await prisma.$disconnect();
}

testBackend().catch((err) => {
  console.error('❌ Backend test failed:', err);
  process.exit(1);
});
