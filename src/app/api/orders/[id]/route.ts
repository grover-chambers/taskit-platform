import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_TRANSITIONS: Record<string, string[]> = {
  RECEIVED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

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
            id: true, name: true, phone: true,
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

    if (riderId) {
      return NextResponse.json(
        { error: 'Use POST /api/admin/dispatch/assign for rider assignment' },
        { status: 400 }
      );
    }

    const currentOrder = await prisma.order.findUnique({ where: { id: params.id } });
    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status && !VALID_TRANSITIONS[currentOrder.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentOrder.status} to ${status}` },
        { status: 409 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (mpesaTransactionCode) updateData.mpesaTransactionCode = mpesaTransactionCode;

    const result = await prisma.$transaction(async (tx) => {
      if (status === 'IN_TRANSIT' && !currentOrder.deliveryOtp) {
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        await tx.order.update({
          where: { id: params.id },
          data: { deliveryOtp: otp },
        });
        const customer = await tx.user.findUnique({ where: { id: currentOrder.customerId } });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Delivery OTP',
              body: `Your delivery OTP is ${otp}. Share this with your rider to confirm delivery.`,
              type: 'ORDER',
            },
          });
        }
      }

      const order = await tx.order.update({
        where: { id: params.id },
        data: updateData,
      });

      if (status) {
        await tx.orderStatus.create({
          data: {
            orderId: order.id,
            status,
            note: body.note || `Status updated to ${status}`,
          },
        });
      }

      if (status === 'DELIVERED' && order.riderId) {
        if (currentOrder.deliveryOtp && body.deliveryOtp !== currentOrder.deliveryOtp) {
          throw new Error('Invalid OTP');
        }
        await tx.riderDetail.update({
          where: { id: order.riderId },
          data: {
            currentOrderId: null,
            totalTrips: { increment: 1 },
          },
        });
      }

      if (status === 'CANCELLED' && order.riderId) {
        await tx.riderDetail.update({
          where: { id: order.riderId },
          data: { currentOrderId: null },
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
