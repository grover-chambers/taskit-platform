import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const ALLOWED_SIGNUP_ROLES = ['CUSTOMER', 'RIDER'];

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`signup:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many signup attempts. Try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, phone, email, password, role, licenseNumber, plateNumber } = body;
    if (!name || !phone || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!ALLOWED_SIGNUP_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role for signup' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email }] }
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Phone or Email already registered' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        phone,
        email,
        password: hashedPassword,
        role,
      }
    });
    if (role === 'RIDER' && licenseNumber && plateNumber) {
      await prisma.riderDetail.create({
        data: {
          id: user.id,
          licenseNumber,
          plateNumber,
        }
      });
    }

    sendVerificationEmail(email, name).catch(err => {
      console.error('Verification email failed:', err);
    });

    return NextResponse.json({ success: true, message: 'Account created successfully' });
  } catch (error: unknown) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
