import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { routes } from '@/app/config/routes';
import { UserRole } from './app/types';

const isAdminRole = (role?: UserRole) =>
  role === UserRole.ADMIN || role === UserRole.MANAGER;

const unauthorizedJson = () =>
  NextResponse.json(
    { ok: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
    { status: 401 }
  );

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const nonce = crypto.randomUUID();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  const { pathname } = req.nextUrl;
  const role = token?.role as UserRole | undefined;

  // /api/admin/** — checked before /admin so its own branch (JSON 401,
  // not a redirect) always wins for API calls.
  if (pathname.startsWith('/api/admin')) {
    if (!isAdminRole(role)) {
      return unauthorizedJson();
    }
  } else if (pathname.startsWith('/admin')) {
    if (!isAdminRole(role)) {
      return NextResponse.redirect(new URL(routes.public.auth.signIn, req.url));
    }
  }

  if (pathname.startsWith('/client')) {
    if (!token) {
      return NextResponse.redirect(new URL(routes.public.auth.signIn, req.url));
    }
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://upload-widget.cloudinary.com https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline' https://upload-widget.cloudinary.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://upload-widget.cloudinary.com",
      "font-src 'self' data: https://upload-widget.cloudinary.com",
      "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://upload-widget.cloudinary.com https://challenges.cloudflare.com",
      'frame-src https://upload-widget.cloudinary.com https://challenges.cloudflare.com https://www.google.com',
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
