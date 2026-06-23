import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    const zones = await prisma.zone.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { price: 'asc' },
    });
    return NextResponse.json({ zones });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, price } = await req.json();
    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price required' }, { status: 400 });
    }
    const zone = await prisma.zone.create({
      data: { name, price: parseInt(String(price)) },
    });
    return NextResponse.json({ zone });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Zone name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
