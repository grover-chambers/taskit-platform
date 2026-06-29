import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`check-lockout:${ip}`, { windowMs: 60_000, max: 20 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ locked: false });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true, loginAttempts: true }
  });

  if (!user) {
    return NextResponse.json({ locked: false });
  }

  const isLocked = user.lockedUntil && new Date(user.lockedUntil) > new Date();
  return NextResponse.json({
    locked: !!isLocked,
    attempts: user.loginAttempts || 0,
    lockedUntil: isLocked ? user.lockedUntil : null,
  });
}
