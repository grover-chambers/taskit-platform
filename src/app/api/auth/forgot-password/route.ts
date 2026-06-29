import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

const COOLDOWN_MS = 60_000;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`forgot:${ip}`, { windowMs: 60_000, max: 3 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const recentReset = await prisma.passwordReset.findFirst({
      where: { email, createdAt: { gt: new Date(Date.now() - COOLDOWN_MS) } },
      orderBy: { createdAt: 'desc' },
    });
    if (recentReset) {
      return NextResponse.json({ error: 'Please wait a minute before requesting again' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    await prisma.passwordReset.create({
      data: {
        email,
        tokenHash: crypto.randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 60 * 60_000),
      }
    });

    await sendPasswordResetEmail(user.email, user.name || 'User');

    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 500 });
  }
}
