import { refreshDealsPipeline } from '../lib/deal-refresher';
import { prisma } from '../lib/db';

async function run() {
  console.log('🚀 Starting Automated Deal Refresher Pipeline...');
  const start = Date.now();
  try {
    const result = await refreshDealsPipeline();
    console.log(`✅ Refresh finished in ${Date.now() - start}ms!`);
    console.log(`📊 Total Crawled: ${result.totalCrawled}`);
    console.log(`✨ New Deals Added: ${result.newDealsAdded}`);
    console.log(`🔄 Deals Updated: ${result.updatedDeals}`);
    console.log('\n--- Summary of Processed Offers ---');
    result.dealsSummary.forEach((deal, idx) => {
      console.log(`${idx + 1}. [${deal.action.toUpperCase()}] ${deal.brand} - ${deal.title}`);
    });
  } catch (err) {
    console.error('❌ Error executing refresh pipeline:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
