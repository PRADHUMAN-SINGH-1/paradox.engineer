import { NextResponse } from 'next/server';
import { isValidAdminKey } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = String(body.key || body.password || request.headers.get('x-admin-key') || '').trim();

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Please enter the admin master key.' },
        { status: 400 }
      );
    }

    if (!isValidAdminKey(key)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect master key. Please try again.' },
        { status: 401 }
      );
    }

    const canonicalKey = (process.env.ADMIN_PASSWORD || 'Para@638823').replace(/^["']|["']$/g, '').trim();

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      key: canonicalKey,
    });

    // Set cookie on response for seamless navigation
    response.cookies.set('paradox_admin_key', canonicalKey, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Error in /api/admin/login:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
