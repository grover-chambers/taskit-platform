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
    if (!membership || membership.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only owners can intervene' }, { status: 403 });
    }

    const { orderId, action, details } = await req.json();
    if (!orderId || !action) {
      return NextResponse.json({ error: 'orderId and action required' }, { status: 400 });
    }

    if (!['CANCEL', 'ESCALATE_URGENCY', 'FORCE_PACKED', 'FORCE_AWAIT_RIDER', 'FORCE_PAYMENT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.enterpriseClientId !== membership.enterpriseClientId) {
      return NextResponse.json({ error: 'Order does not belong to your enterprise' }, { status: 403 });
    }

    let updateData: any = {};
    let statusNote = '';

    switch (action) {
      case 'CANCEL':
        if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
          return NextResponse.json({ error: `Cannot cancel order in ${order.status}` }, { status: 409 });
        }
        updateData = { status: 'CANCELLED' };
        statusNote = `Owner intervention: Order cancelled. ${details || ''}`;
        if (order.riderId) {
          await prisma.riderDetail.update({
            where: { id: order.riderId },
            data: { currentOrderId: null },
          });
        }
        break;

      case 'ESCALATE_URGENCY':
        updateData = { urgency: 'URGENT' };
        statusNote = `Owner intervention: Urgency escalated to URGENT. ${details || ''}`;
        break;

      case 'FORCE_PAYMENT':
        if (order.status !== 'PRICED') {
          return NextResponse.json({ error: 'Order must be in PRICED status' }, { status: 409 });
        }
        updateData = { status: 'PAID', paymentStatus: 'PAID', paymentMethod: 'MANUAL' };
        statusNote = `Owner intervention: Payment forced through. ${details || ''}`;
        break;

      case 'FORCE_PACKED':
        if (order.status !== 'PAID') {
          return NextResponse.json({ error: 'Order must be in PAID status' }, { status: 409 });
        }
        updateData = { status: 'PACKED' };
        statusNote = `Owner intervention: Force marked as packed. ${details || ''}`;
        break;

      case 'FORCE_AWAIT_RIDER':
        if (order.status !== 'PACKED') {
          return NextResponse.json({ error: 'Order must be in PACKED status' }, { status: 409 });
        }
        updateData = { status: 'AWAITING_RIDER' };
        statusNote = `Owner intervention: Force moved to rider queue. ${details || ''}`;
        break;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    if (updateData.status) {
      await prisma.orderStatus.create({
        data: {
          orderId,
          status: updateData.status,
          note: statusNote,
        },
      });
    } else {
      await prisma.orderStatus.create({
        data: {
          orderId,
          status: order.status,
          note: statusNote,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: membership.enterpriseClientId,
        userId: session.user.id,
        action: `INTERVENE_${action}`,
        entityType: 'ORDER',
        entityId: orderId,
        details: statusNote,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
