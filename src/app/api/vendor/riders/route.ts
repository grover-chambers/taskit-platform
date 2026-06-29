import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
      include: { enterpriseClient: true },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const enterpriseClientId = membership.enterpriseClientId;

    const enterpriseOrderRiderIds = await prisma.order.findMany({
      where: {
        enterpriseClientId,
        riderId: { not: null },
      },
      select: { riderId: true },
      distinct: ['riderId'],
    });

    const knownRiderIds = enterpriseOrderRiderIds
      .map(o => o.riderId)
      .filter((id): id is string => id !== null);

    const [online, offline] = await Promise.all([
      prisma.riderDetail.findMany({
        where: {
          isOnline: true,
          kycStatus: 'VERIFIED',
          OR: [
            { currentOrderId: null },
            { id: { in: knownRiderIds } },
          ],
        },
        select: {
          id: true,
          plateNumber: true,
          rating: true,
          totalTrips: true,
          todayEarnings: true,
          currentOrderId: true,
          user: { select: { name: true } },
        },
      }),
      prisma.riderDetail.findMany({
        where: {
          id: { in: knownRiderIds.length > 0 ? knownRiderIds : ['__none__'] },
          OR: [{ isOnline: false }, { kycStatus: { not: 'VERIFIED' } }],
        },
        select: {
          id: true,
          plateNumber: true,
          rating: true,
          kycStatus: true,
          isOnline: true,
          user: { select: { name: true } },
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
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
