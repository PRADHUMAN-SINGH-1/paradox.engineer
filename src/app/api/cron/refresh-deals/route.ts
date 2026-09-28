import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { sendNewDealNotifications } from '@/lib/email';
import { refreshDealsPipeline } from '@/lib/deal-refresher';


export async function GET(request: Request) {
  try {
    const result = await refreshDealsPipeline();
    revalidateTag('paradox:deals', 'max');
    revalidateTag('paradox:brands', 'max');
    revalidateTag('paradox:topics', 'max');
    after(async () => {
      for (const deal of result.dealsSummary.filter((item) => item.action === 'created')) {
        if (!deal.slug || !deal.shortDescription || !deal.dealType) continue;
        await sendNewDealNotifications({
          id: deal.slug,
          slug: deal.slug,
          title: deal.title,
          shortDescription: deal.shortDescription,
          discountAmount: deal.discountAmount,
          dealType: deal.dealType,
          brandName: deal.brand,
        }).catch((error) => console.error('Crawler subscriber email failed:', error));
      }
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to auto-refresh deals:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error refreshing deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = await refreshDealsPipeline();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to trigger deal refresh:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute deal refresh pipeline' },
      { status: 500 }
    );
  }
}
