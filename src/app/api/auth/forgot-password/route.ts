import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return NextResponse.json({ error: 'No account found with that phone number' }, { status: 404 });

    // Store reset request as a setting so admin can see it
    await prisma.setting.upsert({
      where: { key: `password_reset_${phone}` },
      update: { value: JSON.stringify({ name: user.name, phone, requestedAt: new Date().toISOString() }) },
      create: { key: `password_reset_${phone}`, value: JSON.stringify({ name: user.name, phone, requestedAt: new Date().toISOString() }) },
    });

    return NextResponse.json({ success: true, message: 'Request sent. Admin will contact you shortly.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
