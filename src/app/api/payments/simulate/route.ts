import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

const WEBHOOK_SECRET = process.env.MPESA_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    }
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Already paid' }, { status: 409 });
    }

    const code = 'DEMO' + Math.random().toString(36).substring(2, 8).toUpperCase();

    await prisma.order.update({
      where: { id: orderId },
      data: {
        mpesaTransactionCode: code,
        paymentStatus: 'PENDING_VERIFICATION',
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    await fetch(`${baseUrl}/api/webhooks/mpesa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify({ orderId, mpesaTransactionCode: code, confirmed: true }),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
