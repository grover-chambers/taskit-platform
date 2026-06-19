import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { riderId: session.user.id },
      include: {
        zone: true,
        customer: { select: { name: true, phone: true } },
        shop: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const available = await prisma.order.findMany({
      where: {
        riderId: null,
        status: 'ACCEPTED',
      },
      include: {
        zone: true,
        customer: { select: { name: true, phone: true } },
        shop: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ orders, available });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
