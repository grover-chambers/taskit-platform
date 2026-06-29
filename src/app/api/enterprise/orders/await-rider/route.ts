import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
    });
    if (!membership || (membership.role !== 'OPERATOR' && membership.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Only operators and owners can set orders to await rider' }, { status: 403 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.enterpriseClientId !== membership.enterpriseClientId) {
      return NextResponse.json({ error: 'Order does not belong to your enterprise' }, { status: 403 });
    }
    if (order.status !== 'PACKED') {
      return NextResponse.json({ error: `Order status is ${order.status}, must be PACKED to await rider` }, { status: 409 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'AWAITING_RIDER' },
    });

    await prisma.orderStatus.create({
      data: {
        orderId,
        status: 'AWAITING_RIDER',
        note: 'Packed order dispatched to rider queue',
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: membership.enterpriseClientId,
        userId: session.user.id,
        action: 'AWAIT_RIDER',
        entityType: 'ORDER',
        entityId: orderId,
        details: 'Order moved to rider queue',
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
