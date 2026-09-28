import { NextResponse } from 'next/server';

export function requireAdmin(request: Request): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Para@638823';

  // 1. Check custom header x-admin-key
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === adminPassword) {
    return null;
  }

  // 2. Check cookie paradox_admin_key
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/paradox_admin_key=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === adminPassword) {
    return null;
  }

  // 3. Check Bearer token
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === adminPassword) {
    return null;
  }

  // 4. Check Basic auth
  if (authHeader?.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6));
      const separator = decoded.indexOf(':');
      const username = separator >= 0 ? decoded.slice(0, separator) : '';
      const password = separator >= 0 ? decoded.slice(separator + 1) : '';

      if ((username === 'admin' || username === '') && password === adminPassword) {
        return null;
      }
    } catch {
      // ignore decoding error
    }
  }

  const response = NextResponse.json(
    { success: false, error: 'Authentication required' },
    { status: 401 }
  );
  response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
  return response;
}
