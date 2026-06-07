import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { routes } from '@/app/config/routes';
import { UserRole } from './app/types';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const nonce = crypto.randomUUID();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  const { pathname } = req.nextUrl;
  const role = token?.role as UserRole | undefined;

  if (pathname.startsWith('/admin')) {
    if (role !== UserRole.ADMIN && role !== UserRole.MANAGER) {
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
      'frame-src https://upload-widget.cloudinary.com https://challenges.cloudflare.com',
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
