import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ['/admin', '/platform'],
  RIDER: ['/rider'],
  VENDOR: ['/vendor', '/mtaago'],
  CUSTOMER: ['/dashboard', '/book'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  if (!token) {
    const signInUrl = new URL('/auth/login', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = token.role as string;

  if (pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/login')) {
    return NextResponse.next();
  }

  for (const [allowedRole, prefixes] of Object.entries(ROLE_ROUTES)) {
    if (prefixes.some(p => pathname.startsWith(p))) {
      if (role !== allowedRole) {
        const redirectUrl = ROLE_ROUTES[role]?.[0] || '/auth/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  if (pathname.startsWith('/mtaago') && role === 'VENDOR') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/dashboard/:path*',
    '/book/:path*',
    '/rider/:path*',
    '/vendor/:path*',
    '/mtaago/:path*',
    '/platform/:path*',
  ],
};
