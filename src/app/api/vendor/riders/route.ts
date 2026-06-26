import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [online, offline] = await Promise.all([
      prisma.riderDetail.findMany({
        where: { isOnline: true, kycStatus: 'VERIFIED' },
        select: {
          plateNumber: true,
          rating: true,
          totalTrips: true,
          todayEarnings: true,
          currentOrderId: true,
          user: { select: { name: true, phone: true } },
        },
      }),
      prisma.riderDetail.findMany({
        where: {
          OR: [{ isOnline: false }, { kycStatus: { not: 'VERIFIED' } }],
        },
        select: {
          plateNumber: true,
          rating: true,
          kycStatus: true,
          isOnline: true,
          user: { select: { name: true, phone: true } },
        },
      }),
    ]);

    const currentOrderIds = online
      .map((r) => r.currentOrderId)
      .filter((id): id is string => id !== null);

    const currentOrders = currentOrderIds.length
      ? await prisma.order.findMany({
          where: { id: { in: currentOrderIds } },
          select: {
            id: true,
            errandDescription: true,
            status: true,
            customer: { select: { name: true, phone: true } },
          },
        })
      : [];

    const orderMap = new Map(currentOrders.map((o) => [o.id, o]));

    const onlineWithOrders = online.map((r) => {
      const { currentOrderId, ...rest } = r;
      return {
        ...rest,
        currentOrder: currentOrderId ? orderMap.get(currentOrderId) ?? null : null,
      };
    });

    return NextResponse.json({ online: onlineWithOrders, offline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
