import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), 'prisma', 'catalog-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('catalog-data.json not found!');
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Starting Supabase seed: ${data.topics.length} topics, ${data.brands.length} brands, ${data.deals.length} deals...`);

  // 1. Seed Topics
  for (const topic of data.topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { name: topic.name, icon: topic.icon },
      create: { id: topic.id, name: topic.name, slug: topic.slug, icon: topic.icon },
    });
  }
  console.log(`✓ Seeded ${data.topics.length} topics into Supabase`);

  // 2. Seed Brands
  for (const brand of data.brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, logoUrl: brand.logoUrl, website: brand.website },
      create: { id: brand.id, name: brand.name, slug: brand.slug, logoUrl: brand.logoUrl, website: brand.website },
    });
  }
  console.log(`✓ Seeded ${data.brands.length} brands into Supabase`);

  // 3. Seed Deals
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
  console.log(`✓ Seeded ${data.deals.length} deals into Supabase`);

  const topicCount = await prisma.topic.count();
  const brandCount = await prisma.brand.count();
  const dealCount = await prisma.deal.count();
  console.log(`Verification: Supabase PostgreSQL now contains ${topicCount} topics, ${brandCount} brands, and ${dealCount} deals!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
