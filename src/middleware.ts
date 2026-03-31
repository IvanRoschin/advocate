import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { routes } from '@/app/config/routes';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const rawRole = token?.role;
  const role = typeof rawRole === 'string' ? rawRole.toUpperCase() : 'GUEST';
  const isAdminRoute = pathname.startsWith('/admin');
  const isClientRoute = pathname.startsWith('/client');

  // ✅ ADMIN — доступ везде
  if (role === 'ADMIN') {
    return NextResponse.next();
  }

  // ✅ CLIENT — только public + /client
  if (role === 'CLIENT') {
    if (!isAdminRoute) {
      return NextResponse.next();
    }
  }

  // ✅ GUEST — только public
  if (!isAdminRoute && !isClientRoute) {
    return NextResponse.next();
  }

  // 🚫 Всё остальное — на логин
  return NextResponse.redirect(new URL(routes.public.auth.signIn, req.url));
}

// ⛔ Ограничиваем выполнение middleware
export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
};
