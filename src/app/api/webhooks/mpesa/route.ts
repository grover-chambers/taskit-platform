import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const WEBHOOK_SECRET = process.env.MPESA_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.warn('WARNING: MPESA_WEBHOOK_SECRET not set. Webhook validation will fail.');
}

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  try {
    const authHeader = request.headers.get('x-webhook-secret');
    if (authHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const { mpesaTransactionCode, orderId, confirmed } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (confirmed) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'ACCEPTED',
          mpesaReceipt: mpesaTransactionCode,
        },
      });

      await prisma.notification.create({
        data: {
          userId: order.customerId,
          title: 'Payment Confirmed',
          body: `Payment for order #${orderId.slice(-7).toUpperCase()} has been confirmed`,
          type: 'PAYMENT',
        },
      });

      await prisma.notification.create({
        data: {
          userId: order.customerId,
          title: 'Order Accepted',
          body: `Your order #${orderId.slice(-7).toUpperCase()} has been accepted`,
          type: 'ORDER',
        },
      });

      await prisma.orderStatus.create({
        data: {
          orderId,
          status: 'ACCEPTED',
          note: 'Payment confirmed — order accepted',
        },
      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
