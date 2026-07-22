import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/auth', '/auth/empresa', '/auth/usuarios', '/auth/mensajes', '/auth/plantillas', '/auth/pront', '/auth/ai'];

  if (protectedPaths.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    const token = request.cookies.get('abiel_admin_token')?.value;
    const expected = process.env.ADMIN_ACCESS_TOKEN?.trim();

    if (!token || !expected || token !== expected) {
      const url = new URL('/validate', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*']
};
