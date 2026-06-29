import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyResetToken } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`reset-pw:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const payload = verifyResetToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Reset link is invalid or has expired. Please request a new one.' }, { status: 400 });
    }

    const usedReset = await prisma.passwordReset.findFirst({
      where: { email: payload.email, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!usedReset) {
      return NextResponse.json({ error: 'Reset link is invalid, expired, or already used. Please request a new one.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, loginAttempts: 0, lockedUntil: null },
      }),
      prisma.passwordReset.update({
        where: { id: usedReset.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
