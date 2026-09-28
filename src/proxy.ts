import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function unauthorized() {
  const response = new NextResponse('Authentication required', { status: 401 });
  response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export function proxy(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Para@638823';

  // Allow the custom client-side admin login gateway page to render
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.next();
  }

  // 1. Check custom header x-admin-key
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === adminPassword) {
    return NextResponse.next();
  }

  // 2. Check Authorization header
  const authorization = request.headers.get('authorization');

  // 2a. Bearer token
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice(7).trim();
    if (token === adminPassword) {
      return NextResponse.next();
    }
  }

  // 2b. Basic Auth
  if (authorization?.startsWith('Basic ')) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(':');
      const username = separator >= 0 ? decoded.slice(0, separator) : '';
      const password = separator >= 0 ? decoded.slice(separator + 1) : '';

      if ((username === 'admin' || username === '') && password === adminPassword) {
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
