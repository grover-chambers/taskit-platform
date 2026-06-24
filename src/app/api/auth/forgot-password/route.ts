import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const resetCooldowns = new Map<string, number>();
const COOLDOWN_MS = 60_000;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const now = Date.now();
    const lastRequest = resetCooldowns.get(email) || 0;
    if (now - lastRequest < COOLDOWN_MS) {
      return NextResponse.json({ error: 'Please wait a minute before requesting again' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    resetCooldowns.set(email, now);

    await sendPasswordResetEmail(user.email, user.name || 'User');

    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 500 });
  }
}
