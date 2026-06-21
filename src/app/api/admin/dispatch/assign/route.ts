import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, riderId } = await request.json();
    if (!orderId || !riderId) {
      return NextResponse.json({ error: 'orderId and riderId required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');
      if (order.riderId) throw new Error('Order already assigned');
      if (!['RECEIVED', 'ACCEPTED'].includes(order.status)) {
        throw new Error(`Order status ${order.status} cannot be assigned`);
      }

      const rider = await tx.riderDetail.findUnique({ where: { id: riderId } });
      if (!rider) throw new Error('Rider not found');
      if (!rider.isOnline) throw new Error('Rider is not online');
      if (rider.currentOrderId) throw new Error('Rider already has an active job');

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          riderId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
        },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status: 'ASSIGNED',
          note: `Rider assigned by admin`,
        },
      });

      await tx.riderDetail.update({
        where: { id: riderId },
        data: { currentOrderId: orderId },
      });

      await tx.notification.create({
        data: {
          userId: riderId,
          title: 'New Job Assigned',
          body: `Order #${orderId.slice(-7).toUpperCase()} has been assigned to you`,
          type: 'ORDER',
        },
      });

      const customer = await tx.user.findUnique({
        where: { id: order.customerId },
      });
      if (customer) {
        await tx.notification.create({
          data: {
            userId: customer.id,
            title: 'Rider Assigned',
            body: `A rider has been assigned to your order #${orderId.slice(-7).toUpperCase()}`,
            type: 'ORDER',
          },
        });
      }

      return updatedOrder;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    const status = error.message.includes('already') || error.message.includes('not')
      ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
