import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashOtp } from '@/lib/otp';
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

    if (!membership || !membership.enterpriseClient) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const client = membership.enterpriseClient;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pendingOrders, activeOrders, availableRiders, busyRiders, offlineRiders, todayDelivered, todayRevenue] = await Promise.all([
      prisma.order.findMany({
        where: {
          enterpriseClientId: client.id,
          status: { in: ['RECEIVED', 'ACCEPTED', 'PRICED', 'PAID', 'PACKED', 'AWAITING_RIDER'] },
          riderId: null,
        },
        include: {
          customer: { select: { name: true, phone: true } },
          zone: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.order.findMany({
        where: {
          enterpriseClientId: client.id,
          status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] },
        },
        select: {
          id: true,
          errandDescription: true,
          status: true,
          contactPhone: true,
          deliveryOtp: true,
          customer: { select: { name: true, phone: true } },
          rider: {
            select: {
              name: true,
              phone: true,
              riderDetail: { select: { plateNumber: true, rating: true } },
            },
          },
          zone: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.riderDetail.findMany({
        where: { isOnline: true, currentOrderId: null, kycStatus: 'VERIFIED' },
        select: {
          id: true,
          plateNumber: true,
          rating: true,
          totalTrips: true,
          user: { select: { name: true } },
        },
      }),
      prisma.riderDetail.findMany({
        where: { isOnline: true, currentOrderId: { not: null } },
        include: {
          user: { select: { name: true } },
          currentOrder: { select: { id: true, errandDescription: true, status: true } },
        },
      }),
      prisma.riderDetail.findMany({
        where: { isOnline: false },
        select: {
          id: true,
          plateNumber: true,
          rating: true,
          kycStatus: true,
          user: { select: { name: true } },
        },
      }),
      prisma.order.count({
        where: {
          enterpriseClientId: client.id,
          status: 'DELIVERED',
          createdAt: { gte: today },
        },
      }),
      prisma.order.aggregate({
        where: {
          enterpriseClientId: client.id,
          status: 'DELIVERED',
          createdAt: { gte: today },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return NextResponse.json({
      pendingOrders,
      activeOrders,
      availableRiders,
      busyRiders,
      offlineRiders,
      todayDelivered,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
    });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
      include: { enterpriseClient: true },
    });

    if (!membership || !membership.enterpriseClient) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const client = membership.enterpriseClient;

    const { orderId, riderId } = await request.json();
    if (!orderId || !riderId) {
      return NextResponse.json({ error: 'orderId and riderId required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');
      if (order.enterpriseClientId !== client.id) throw new Error('Order does not belong to your enterprise');
      if (order.riderId) throw new Error('Order already assigned');
      if (!['RECEIVED', 'ACCEPTED', 'AWAITING_RIDER', 'PACKED'].includes(order.status)) {
        throw new Error(`Order status ${order.status} cannot be assigned`);
      }

      const rider = await tx.riderDetail.findUnique({ where: { id: riderId } });
      if (!rider) throw new Error('Rider not found');
      if (!rider.isOnline) throw new Error('Rider is not online');
      if (rider.kycStatus !== 'VERIFIED') throw new Error('Rider is not verified');
      if (rider.currentOrderId) throw new Error('Rider already has an active job');

      const otp = Math.random().toString().slice(2, 6);
      const otpHash = await hashOtp(otp);
      const shortId = orderId.slice(-7).toUpperCase();

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          riderId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
          deliveryOtp: otpHash,
          otpGeneratedAt: new Date(),
        },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status: 'ASSIGNED',
          note: 'Rider dispatched via Mtaago',
        },
      });

      await tx.riderDetail.update({
        where: { id: riderId },
        data: { currentOrderId: orderId },
      });

      await tx.notification.create({
        data: {
          userId: riderId,
          title: 'New Job',
          body: `Order #${shortId} assigned via Mtaago`,
          type: 'ORDER',
        },
      });

      if (order.contactPhone) {
        await tx.notification.create({
          data: {
            userId: order.customerId,
            title: 'Rider Dispatched',
            body: `Your order #${shortId} has a rider. Delivery OTP: ${otp}`,
            type: 'ORDER',
          },
        });
      }

      return { order: updatedOrder, otp };
    });

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://taskit-platform.vercel.app'}/track/${orderId}`;
    const message = `Haraka Dispatch: Your delivery is on the way!\n\nTrack live: ${trackingUrl}\nDelivery OTP: ${result.otp}\n\nGive this OTP to the rider on arrival.`;
    const whatsappLink = `https://wa.me/${result.order.contactPhone}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      order: result.order,
      otp: result.otp,
      trackingUrl,
      whatsappLink,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const conflictMessages = ['already assigned', 'already has an active job', 'does not belong', 'not online', 'not verified', 'cannot be assigned'];
      const isConflict = conflictMessages.some((m) => error.message.includes(m));
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Internal server error' }, { status: isConflict ? 409 : 500 });
      }
      return NextResponse.json({ error: error.message }, { status: isConflict ? 409 : 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
