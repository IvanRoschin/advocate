import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { routes } from '@/app/config/routes';

import { UserRole } from './app/types';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const role = token?.role as UserRole | undefined;

  const isAdminRoute = pathname.startsWith('/admin');

  // 👉 защищаем только admin
  if (isAdminRoute) {
    if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(routes.public.auth.signIn, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
