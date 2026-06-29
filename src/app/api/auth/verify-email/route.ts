import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyEmailVerifyToken } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_token', request.url));
  }

  const payload = verifyEmailVerifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_token', request.url));
  }

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login?error=user_not_found', request.url));
  }

  if (user.emailVerified) {
    return NextResponse.redirect(new URL('/auth/login?message=already_verified', request.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return NextResponse.redirect(new URL('/auth/login?message=email_verified', request.url));
}
