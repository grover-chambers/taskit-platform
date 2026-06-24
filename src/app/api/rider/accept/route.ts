import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const riderDetail = await prisma.riderDetail.findUnique({ where: { id: session.user.id } });
    if (!riderDetail || riderDetail.kycStatus !== 'VERIFIED') {
      return NextResponse.json({ error: 'Account not verified' }, { status: 403 });
    }
    if (!riderDetail.isOnline) {
      return NextResponse.json({ error: 'You must be online to accept jobs' }, { status: 403 });
    }
    if (riderDetail.currentOrderId) {
      return NextResponse.json({ error: 'You already have an active job' }, { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');
      if (order.riderId) throw new Error('Order already assigned to another rider');
      if (!['RECEIVED', 'ACCEPTED'].includes(order.status)) {
        throw new Error(`Order status ${order.status} cannot be accepted`);
      }
      if (order.paymentStatus !== 'PAID') {
        throw new Error('Order payment not confirmed');
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          riderId: session.user.id,
          status: 'ASSIGNED',
          assignedAt: new Date(),
        },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status: 'ASSIGNED',
          note: 'Rider accepted job',
        },
      });

      await tx.riderDetail.update({
        where: { id: session.user.id },
        data: { currentOrderId: orderId },
      });

      const customer = await tx.user.findUnique({ where: { id: order.customerId } });
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
    const status = error.message.includes('already') || error.message.includes('not') || error.message.includes('payment')
      ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
