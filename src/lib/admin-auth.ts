import { NextResponse } from 'next/server';

export function requireAdmin(request: Request): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { success: false, error: 'Admin authentication is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Basic ')) {
    const response = NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
    response.headers.set('WWW-Authenticate', 'Basic realm="Paradox Admin"');
    return response;
  }

  try {
    const decoded = atob(authorization.slice(6));
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
