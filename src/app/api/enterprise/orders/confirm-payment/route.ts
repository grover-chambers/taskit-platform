import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.enterpriseUser.findFirst({
    where: { userId: session.user.id, active: true },
  });
  if (!membership || membership.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Only operators can confirm payment' }, { status: 403 });
  }

  const { orderId, method, mpesaReceipt } = await req.json();
  if (!orderId || !method) {
    return NextResponse.json({ error: 'orderId and method required' }, { status: 400 });
  }

  if (!['MANUAL', 'MPESA'].includes(method)) {
    return NextResponse.json({ error: 'Method must be MANUAL or MPESA' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.enterpriseClientId !== membership.enterpriseClientId) {
    return NextResponse.json({ error: 'Order does not belong to your enterprise' }, { status: 403 });
  }
  if (order.status !== 'PRICED') {
    return NextResponse.json({ error: `Order status is ${order.status}, cannot confirm payment` }, { status: 409 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      paymentStatus: 'PAID',
      paymentMethod: method,
      mpesaReceipt: method === 'MPESA' ? (mpesaReceipt || null) : null,
    },
  });

  await prisma.orderStatus.create({
    data: {
      orderId,
      status: 'PAID',
      note: method === 'MPESA'
        ? `M-Pesa payment confirmed${mpesaReceipt ? ` — Receipt: ${mpesaReceipt}` : ''}`
        : 'Payment confirmed manually at counter',
    },
  });

  await prisma.auditLog.create({
    data: {
      enterpriseClientId: membership.enterpriseClientId,
      userId: session.user.id,
      action: 'CONFIRM_PAYMENT',
      entityType: 'ORDER',
      entityId: orderId,
      details: `Payment confirmed via ${method}${method === 'MPESA' && mpesaReceipt ? ` — ${mpesaReceipt}` : ''}`,
    },
  });

  return NextResponse.json({ success: true, order: updatedOrder });
}
