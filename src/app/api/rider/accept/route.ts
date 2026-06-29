import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

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
      const updateResult = await tx.$executeRaw`
        UPDATE orders
        SET "riderId" = ${session.user.id}, status = 'ASSIGNED', "assignedAt" = NOW()
        WHERE id = ${orderId}::text
          AND "riderId" IS NULL
          AND status IN ('RECEIVED', 'ACCEPTED', 'AWAITING_RIDER')
          AND "paymentStatus" = 'PAID'
      `;

      if (updateResult === 0) {
        throw new Error('Order not available for acceptance');
      }

      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');

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

      const customer = await tx.user.findUnique({ where: { id: order!.customerId } });
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

      await tx.notification.create({
        data: {
          userId: session.user.id,
          title: 'New Job Assigned',
          body: `You accepted order #${orderId.slice(-7).toUpperCase()}`,
          type: 'ORDER',
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const isConflict = message.includes('not available') || message.includes('already') || message.includes('payment');
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Internal server error' }, { status: isConflict ? 409 : 500 });
    }
    return NextResponse.json({ error: message }, { status: isConflict ? 409 : 500 });
  }
}
