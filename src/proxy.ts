import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidAdminKey } from '@/lib/admin-auth';

function unauthorized() {
  return NextResponse.json(
    { success: false, error: 'Authentication required' },
    { status: 401, headers: { 'Cache-Control': 'no-store' } }
  );
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Always allow the admin dashboard page itself to load so the Login Gate panel displays
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  // 2. Always allow the dedicated login route so the client can submit the master key
  if (pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 3. Check custom header x-admin-key
  const adminKey = request.headers.get('x-admin-key');
  if (isValidAdminKey(adminKey)) {
    return NextResponse.next();
  }

  // 4. Check cookie 'paradox_admin_key'
  const cookieKey = request.cookies.get('paradox_admin_key')?.value;
  if (cookieKey && isValidAdminKey(decodeURIComponent(cookieKey))) {
    return NextResponse.next();
  }

  // 5. Check Authorization header
  const authorization = request.headers.get('authorization');

  // 5a. Bearer token
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice(7).trim();
    if (isValidAdminKey(token)) {
      return NextResponse.next();
    }
  }

  // 5b. Basic Auth
  if (authorization?.startsWith('Basic ')) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(':');
      const password = separator >= 0 ? decoded.slice(separator + 1) : decoded;

      if (isValidAdminKey(password)) {
        return NextResponse.next();
      }
    } catch {
      // ignore decoding error
    }
  }

  return unauthorized();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
