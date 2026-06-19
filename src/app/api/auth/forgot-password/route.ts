import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'No account found with that email' }, { status: 404 });

    // Store reset request as a setting so admin can see it
    await prisma.setting.upsert({
      where: { key: `password_reset_${email}` },
      update: { value: JSON.stringify({ name: user.name, email, phone: user.phone, requestedAt: new Date().toISOString() }) },
      create: { key: `password_reset_${email}`, value: JSON.stringify({ name: user.name, email, phone: user.phone, requestedAt: new Date().toISOString() }) },
    });

    return NextResponse.json({ success: true, message: 'Request sent. Admin will contact you shortly.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
