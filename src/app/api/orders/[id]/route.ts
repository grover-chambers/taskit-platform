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
    const { status, riderId, paymentStatus, mpesaTransactionCode, deliveryOtp } = body;

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

    if (status === 'DELIVERED' && currentOrder.deliveryOtp) {
      if (!deliveryOtp) {
        return NextResponse.json({ error: 'Delivery OTP required' }, { status: 400 });
      }

      if (currentOrder.otpLockedUntil && new Date() < new Date(currentOrder.otpLockedUntil)) {
        const remaining = Math.ceil((new Date(currentOrder.otpLockedUntil).getTime() - Date.now()) / 60000);
        return NextResponse.json({ error: `OTP locked. Try again in ${remaining} min.`, otpLocked: true }, { status: 429 });
      }

      const isOtpExpired = currentOrder.otpGeneratedAt && (Date.now() - new Date(currentOrder.otpGeneratedAt).getTime()) > 30 * 60 * 1000;
      if (isOtpExpired && !currentOrder.otpLockedUntil) {
        const newOtp = String(Math.floor(1000 + Math.random() * 9000));
        await prisma.order.update({
          where: { id: params.id },
          data: { deliveryOtp: newOtp, otpGeneratedAt: new Date(), otpAttempts: 0, otpLockedUntil: null },
        });
        const customer = await prisma.user.findUnique({ where: { id: currentOrder.customerId } });
        if (customer) {
          await prisma.notification.create({
            data: { userId: customer.id, title: 'New Delivery OTP', body: `Your previous OTP expired. Your new delivery OTP is ${newOtp}. Share this with your rider.`, type: 'ORDER' },
          });
        }
        return NextResponse.json({ error: 'OTP expired. A new OTP has been sent to the customer.', otpRegenerated: true }, { status: 200 });
      }

      if (deliveryOtp !== currentOrder.deliveryOtp) {
        const newAttempts = (currentOrder.otpAttempts || 0) + 1;
        const lockUntil = newAttempts >= 3 ? new Date(Date.now() + 5 * 60 * 1000) : null;
        await prisma.order.update({
          where: { id: params.id },
          data: { otpAttempts: newAttempts, ...(lockUntil ? { otpLockedUntil: lockUntil } : {}) },
        });
        if (lockUntil) {
          return NextResponse.json({ error: 'Wrong OTP 3 times. Locked for 5 min.', otpLocked: true }, { status: 429 });
        }
        const left = 3 - newAttempts;
        return NextResponse.json({ error: `Invalid OTP. ${left} attempt${left !== 1 ? 's' : ''} remaining.` }, { status: 403 });
      }
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
          data: { deliveryOtp: otp, otpGeneratedAt: new Date(), otpAttempts: 0, otpLockedUntil: null },
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
        await tx.riderDetail.update({
          where: { id: order.riderId },
          data: {
            currentOrderId: null,
            totalTrips: { increment: 1 },
          },
        });

        const existingEarning = await tx.riderEarning.findUnique({ where: { orderId: order.id } });
        if (!existingEarning) {
          const zone = await tx.zone.findUnique({ where: { id: order.zoneId } });
          const earning = zone ? Math.round(zone.price * 0.7) : 100;

          const payout = await tx.payout.create({
            data: {
              riderId: order.riderId,
              amount: earning,
              status: 'PENDING',
              method: 'MPESA',
            },
          });

          await tx.riderEarning.create({
            data: {
              riderId: order.riderId,
              orderId: order.id,
              amount: earning,
              payoutStatus: 'UNPAID',
              payoutId: payout.id,
            },
          });

          await tx.riderDetail.update({
            where: { id: order.riderId },
            data: { todayEarnings: { increment: earning } },
          });
        }

        await tx.order.update({
          where: { id: params.id },
          data: { otpAttempts: 0, otpLockedUntil: null },
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
