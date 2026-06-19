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
    const detail = await prisma.riderDetail.findUnique({
      where: { id: session.user.id },
      include: {
        earnings: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    if (!detail) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    const activeJob = await prisma.order.findFirst({
      where: {
        riderId: session.user.id,
        status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] },
      },
      include: {
        zone: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ detail, activeJob });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
