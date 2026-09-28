import { NextResponse } from 'next/server';

export function requireAdmin(request: Request): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Para@638823';

  // Check x-admin-key header
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === adminPassword) {
    return null;
  }

  // Check Bearer token
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === adminPassword) {
    return null;
  }

  if (!authHeader?.startsWith('Basic ')) {
    const response = NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
    response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
    return response;
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const separator = decoded.indexOf(':');
    const username = separator >= 0 ? decoded.slice(0, separator) : '';
    const password = separator >= 0 ? decoded.slice(separator + 1) : '';

    if (username !== 'admin' || password !== adminPassword) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
      response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
      return response;
    }

    return null;
  } catch {
    const response = NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
    response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
    return response;
  }
}
