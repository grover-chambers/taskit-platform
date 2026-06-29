import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, mpesaTransactionCode } = await request.json();

    if (!orderId || !mpesaTransactionCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (existingOrder.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        mpesaTransactionCode,
        paymentStatus: 'PENDING_VERIFICATION',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
