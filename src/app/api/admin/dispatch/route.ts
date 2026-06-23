import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const assignable = await prisma.order.findMany({
      where: {
        status: { in: ['RECEIVED', 'ACCEPTED'] },
        paymentStatus: 'PAID',
        riderId: null,
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        zone: true,
        shop: { select: { id: true, name: true, location: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const awaitingPayment = await prisma.order.findMany({
      where: {
        status: { in: ['RECEIVED', 'ACCEPTED'] },
        paymentStatus: { in: ['UNPAID', 'PENDING_VERIFICATION'] },
        riderId: null,
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        zone: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const availableRiders = await prisma.riderDetail.findMany({
      where: { isOnline: true, currentOrderId: null, kycStatus: 'VERIFIED' },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        location: true,
      },
    });

    const activeOrders = await prisma.order.findMany({
      where: {
        status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] },
        riderId: { not: null },
      },
      select: {
        id: true,
        status: true,
        errandDescription: true,
        orderType: true,
        deliveryOtp: true,
        pickupLocation: true,
        dropoffLocation: true,
        customer: { select: { name: true, phone: true } },
        rider: {
          select: { id: true, name: true, phone: true, riderDetail: { select: { plateNumber: true } } },
        },
        zone: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ assignable, awaitingPayment, availableRiders, activeOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
