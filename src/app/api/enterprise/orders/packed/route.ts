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
      return NextResponse.json({ error: 'Only operators and owners can mark orders as packed' }, { status: 403 });
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
    if (order.status !== 'PAID') {
      return NextResponse.json({ error: `Order status is ${order.status}, must be PAID to pack` }, { status: 409 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PACKED' },
    });

    await prisma.orderStatus.create({
      data: {
        orderId,
        status: 'PACKED',
        note: 'Order packed and ready for rider assignment',
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: membership.enterpriseClientId,
        userId: session.user.id,
        action: 'MARK_PACKED',
        entityType: 'ORDER',
        entityId: orderId,
        details: 'Order marked as packed',
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
