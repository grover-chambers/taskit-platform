import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
    return NextResponse.json({ zones });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
