import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        zone: true,
        customer: { select: { id: true, name: true, phone: true } },
        rider: {
          select: {
            id: true,
            name: true,
            phone: true,
            riderDetail: { select: { plateNumber: true, rating: true } },
          },
        },
        shop: true,
        orderItems: { include: { product: true } },
        statusLogs: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, riderId, paymentStatus, mpesaTransactionCode } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (riderId) updateData.riderId = riderId;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (mpesaTransactionCode) updateData.mpesaTransactionCode = mpesaTransactionCode;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    if (status) {
      await prisma.orderStatus.create({
        data: {
          orderId: order.id,
          status,
          note: `Status updated to ${status}`,
        },
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
