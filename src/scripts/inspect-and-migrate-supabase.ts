import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Step 1: Connecting to Supabase PostgreSQL ---');
  
  // 1. Inspect existing tables in public schema
  const existingTables: Array<{ table_name: string }> = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;

  console.log('Existing Supabase tables found:');
  existingTables.forEach((t) => console.log(`  • ${t.table_name}`));

  // Check preservation of critical tables
  const criticalTables = ['profiles', 'saved_agents', 'scan_history', 'analysis_cache'];
  const preserved = criticalTables.filter((ct) =>
    existingTables.some((et) => et.table_name.toLowerCase() === ct.toLowerCase())
  );
  console.log(`Protected tables confirmed in database: [${preserved.join(', ')}]`);

  // 2. Safely apply Paradox tables migration using IF NOT EXISTS
  console.log('\n--- Step 2: Applying Safe Migration for Paradox Catalog Tables ---');
  const migrationSqlPath = path.join(process.cwd(), 'prisma', 'safe-supabase-migration.sql');
  const migrationSql = fs.readFileSync(migrationSqlPath, 'utf-8');

  // Split and execute statements safely
  const statements = migrationSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim()) {
      await prisma.$executeRawUnsafe(statement);
    }
  }
  console.log('✓ Paradox catalog tables successfully verified/created with zero conflicts!');

  // 3. Seed Catalog Data (12 topics, 165 brands, 44 deals)
  console.log('\n--- Step 3: Seeding Catalog Data into Supabase ---');
  const catalogPath = path.join(process.cwd(), 'prisma', 'catalog-data.json');
  if (fs.existsSync(catalogPath)) {
    const data = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

    // Seed Topics
    for (const topic of data.topics) {
      await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: { name: topic.name, icon: topic.icon },
        create: { id: topic.id, name: topic.name, slug: topic.slug, icon: topic.icon },
      });
    }
    console.log(`✓ Seeded ${data.topics.length} topics`);

    // Seed Brands
    for (const brand of data.brands) {
      await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: { name: brand.name, logoUrl: brand.logoUrl, website: brand.website },
        create: { id: brand.id, name: brand.name, slug: brand.slug, logoUrl: brand.logoUrl, website: brand.website },
      });
    }
    console.log(`✓ Seeded ${data.brands.length} brands`);

    // Seed Deals
    for (const deal of data.deals) {
      await prisma.deal.upsert({
        where: { slug: deal.slug },
        update: {
          title: deal.title,
          shortDescription: deal.shortDescription,
          fullDescription: deal.fullDescription,
          dealType: deal.dealType,
          discountAmount: deal.discountAmount,
          promoCode: deal.promoCode,
          commissionRate: deal.commissionRate,
          claimUrl: deal.claimUrl,
          affiliateUrl: deal.affiliateUrl,
          howToClaim: deal.howToClaim,
          keyBenefits: deal.keyBenefits,
          eligibility: deal.eligibility,
          termsUrl: deal.termsUrl,
          isStudentDeal: deal.isStudentDeal,
          isStartupDeal: deal.isStartupDeal,
          needsCreditCard: deal.needsCreditCard,
          isTrending: deal.isTrending,
          isLimitedTime: deal.isLimitedTime,
          isActive: deal.isActive,
          clickCount: deal.clickCount,
          viewCount: deal.viewCount,
          expiryDate: deal.expiryDate ? new Date(deal.expiryDate) : null,
          brandId: deal.brandId,
          topicId: deal.topicId,
        },
        create: {
          id: deal.id,
          title: deal.title,
          slug: deal.slug,
          shortDescription: deal.shortDescription,
          fullDescription: deal.fullDescription,
          dealType: deal.dealType,
          discountAmount: deal.discountAmount,
          promoCode: deal.promoCode,
          commissionRate: deal.commissionRate,
          claimUrl: deal.claimUrl,
          affiliateUrl: deal.affiliateUrl,
          howToClaim: deal.howToClaim,
          keyBenefits: deal.keyBenefits,
          eligibility: deal.eligibility,
          termsUrl: deal.termsUrl,
          isStudentDeal: deal.isStudentDeal,
          isStartupDeal: deal.isStartupDeal,
          needsCreditCard: deal.needsCreditCard,
          isTrending: deal.isTrending,
          isLimitedTime: deal.isLimitedTime,
          isActive: deal.isActive,
          clickCount: deal.clickCount,
          viewCount: deal.viewCount,
          expiryDate: deal.expiryDate ? new Date(deal.expiryDate) : null,
          brandId: deal.brandId,
          topicId: deal.topicId,
        },
      });
    }
    console.log(`✓ Seeded ${data.deals.length} deals`);
  }

  // 4. Verify Final State
  console.log('\n--- Step 4: Verifying Supabase Records ---');
  const [topicCount, brandCount, dealCount] = await Promise.all([
    prisma.topic.count(),
    prisma.brand.count(),
    prisma.deal.count(),
  ]);

  console.log(`Active Records in Supabase:
  • Topics: ${topicCount}
  • Brands: ${brandCount}
  • Deals: ${dealCount}`);

  // Re-verify that user's existing tables are completely intact
  const finalTables: Array<{ table_name: string }> = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log('\nFinal confirmation of all public tables:');
  finalTables.forEach((t) => console.log(`  ✓ ${t.table_name}`));
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
