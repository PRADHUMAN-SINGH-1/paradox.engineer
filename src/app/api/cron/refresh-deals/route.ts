import { NextResponse } from 'next/server';
import { refreshDealsPipeline } from '@/lib/deal-refresher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const result = await refreshDealsPipeline();
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
