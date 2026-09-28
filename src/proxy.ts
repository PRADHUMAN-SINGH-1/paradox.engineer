import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.paradox.engineer';

function unauthorized() {
  const response = new NextResponse('Authentication required', { status: 401 });
  response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function isAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/') ||
    pathname === '/api/admin' || pathname.startsWith('/api/admin/');
}

export function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase();

  // Keep preview deployments and local development accessible.
  const isApexProductionHost = host === 'paradox.engineer';

  if (isApexProductionHost) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  if (!isAdminPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new NextResponse('Admin authentication is not configured', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Basic ')) {
    return unauthorized();
  }

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(':');
    const username = separator >= 0 ? decoded.slice(0, separator) : '';
    const password = separator >= 0 ? decoded.slice(separator + 1) : '';

    if (username !== 'admin' || password !== adminPassword) {
      return unauthorized();
    }

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ['/:path*'],
};
