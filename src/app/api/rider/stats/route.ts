import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED', 'CANCELLED'],
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const riderDetail = await prisma.riderDetail.findUnique({
      where: { id: session.user.id },
      include: {
        user: { select: { name: true, phone: true, email: true, createdAt: true } },
        documents: { orderBy: { createdAt: 'desc' } },
      },
    });

    let orders: any[] = [];
    let activeOrder: any = null;

    if (riderDetail?.currentOrderId) {
      activeOrder = await prisma.order.findUnique({
        where: { id: riderDetail.currentOrderId },
        include: {
          customer: { select: { name: true, phone: true } },
          zone: true,
          shop: { select: { name: true, location: true } },
          statusLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    orders = await prisma.order.findMany({
      where: { riderId: session.user.id },
      include: {
        customer: { select: { name: true, phone: true } },
        zone: true,
        shop: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const availableOrders = await prisma.order.findMany({
      where: {
        riderId: null,
        status: 'ACCEPTED',
        paymentStatus: 'PAID',
      },
      include: {
        customer: { select: { name: true, phone: true } },
        zone: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    return NextResponse.json({
      riderDetail,
      activeOrder,
      orders,
      availableOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status, isOnline, locationEnabled, notificationsEnabled } = await request.json();

    if (isOnline !== undefined) {
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: { isOnline, ...(locationEnabled !== undefined ? { locationEnabled } : {}), ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}) },
      });
      return NextResponse.json({ success: true });
    }

    if (locationEnabled !== undefined) {
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: { locationEnabled },
      });
      return NextResponse.json({ success: true });
    }

    if (notificationsEnabled !== undefined) {
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: { notificationsEnabled },
      });
      return NextResponse.json({ success: true });
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.riderId !== session.user.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    }
    if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 409 }
      );
    }

    if (status === 'DELIVERED') {
      const { deliveryOtp } = await request.json();
      if (!deliveryOtp) {
        return NextResponse.json({ error: 'Delivery OTP required' }, { status: 400 });
      }
      if (deliveryOtp !== order.deliveryOtp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 403 });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      if (status === 'IN_TRANSIT') {
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        await tx.order.update({
          where: { id: orderId },
          data: { deliveryOtp: otp },
        });
        const customer = await tx.user.findUnique({ where: { id: order.customerId } });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Delivery OTP',
              body: `Your delivery OTP is ${otp}. Share this with your rider to confirm delivery.`,
              type: 'ORDER',
            },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status,
          note: status === 'IN_TRANSIT'
            ? `Rider is on the way. Delivery OTP sent to customer.`
            : `Rider updated status to ${status}`,
        },
      });

      if (status === 'DELIVERED') {
        await tx.riderDetail.update({
          where: { id: session.user.id },
          data: {
            currentOrderId: null,
            totalTrips: { increment: 1 },
          },
        });

        const zone = await tx.zone.findUnique({ where: { id: order.zoneId } });
        const earning = zone ? Math.round(zone.price * 0.7) : 100;

        await tx.riderEarning.create({
          data: {
            riderId: session.user.id,
            orderId,
            amount: earning,
          },
        });

        await tx.riderDetail.update({
          where: { id: session.user.id },
          data: { todayEarnings: { increment: earning } },
        });

        const customer = await tx.user.findUnique({
          where: { id: order.customerId },
        });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Order Delivered!',
              body: `Your order #${orderId.slice(-7).toUpperCase()} has been delivered`,
              type: 'ORDER',
            },
          });
        }
      }

      if (status === 'PICKED_UP') {
        const customer = await tx.user.findUnique({
          where: { id: order.customerId },
        });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Order Picked Up',
              body: `Your rider has picked up order #${orderId.slice(-7).toUpperCase()}`,
              type: 'ORDER',
            },
          });
        }
      }

      return updated;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
