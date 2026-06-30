import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashOtp } from '@/lib/otp';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
    });
    if (!membership) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const availableRiders = await prisma.riderDetail.findMany({
      where: { isOnline: true, currentOrderId: null, kycStatus: 'VERIFIED' },
      select: {
        id: true,
        plateNumber: true,
        rating: true,
        totalTrips: true,
        user: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json({ availableRiders });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
    });
    if (!membership) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }
    if (membership.role !== 'OPERATOR' && membership.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only operators can dispatch' }, { status: 403 });
    }

    const { orderId, riderId } = await request.json();
    if (!orderId || !riderId) {
      return NextResponse.json({ error: 'orderId and riderId required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');
      if (order.enterpriseClientId !== membership.enterpriseClientId) {
        throw new Error('Order does not belong to your enterprise');
      }
      if (order.riderId) throw new Error('Order already assigned');
      if (!['PACKED', 'AWAITING_RIDER', 'RECEIVED', 'ACCEPTED'].includes(order.status)) {
        throw new Error(`Cannot dispatch order in ${order.status} status`);
      }

      const rider = await tx.riderDetail.findUnique({ where: { id: riderId } });
      if (!rider) throw new Error('Rider not found');
      if (!rider.isOnline) throw new Error('Rider is offline');
      if (rider.kycStatus !== 'VERIFIED') throw new Error('Rider not verified');
      if (rider.currentOrderId) throw new Error('Rider has active job');

      const otp = Math.random().toString().slice(2, 6);
      const otpHash = await hashOtp(otp);
      const shortId = orderId.slice(-7).toUpperCase();

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          riderId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
          deliveryOtp: otpHash,
          otpGeneratedAt: new Date(),
        },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status: 'ASSIGNED',
          note: `Rider dispatched by ${membership.role === 'OWNER' ? 'owner' : 'operator'}`,
        },
      });

      await tx.riderDetail.update({
        where: { id: riderId },
        data: { currentOrderId: orderId },
      });

      await tx.notification.create({
        data: {
          userId: riderId,
          title: 'New Job',
          body: `Order #${shortId} assigned to you`,
          type: 'ORDER',
        },
      });

      await tx.notification.create({
        data: {
          userId: order.customerId,
          title: 'Rider Dispatched',
          body: `Order #${shortId} has been assigned a rider. OTP: ${otp}`,
          type: 'ORDER',
        },
      });

      await tx.auditLog.create({
        data: {
          enterpriseClientId: membership.enterpriseClientId,
          userId: session.user.id,
          action: 'DISPATCH_RIDER',
          entityType: 'ORDER',
          entityId: orderId,
          details: `Dispatched rider to order #${shortId}`,
        },
      });

      return { order: updatedOrder, otp };
    });

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://taskit-platform.vercel.app'}/track/${orderId}`;
    const whatsappLink = result.order.contactPhone
      ? `https://wa.me/${result.order.contactPhone}?text=${encodeURIComponent(`Haraka Dispatch: Your delivery is on the way!\n\nTrack: ${trackingUrl}\nOTP: ${result.otp}\n\nGive this OTP to the rider on arrival.`)}`
      : null;

    return NextResponse.json({ success: true, otp: result.otp, trackingUrl, whatsappLink });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const conflictMessages = ['already assigned', 'active job', 'does not belong', 'offline', 'not verified', 'Cannot dispatch'];
      const isConflict = conflictMessages.some(m => error.message.includes(m));
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Internal server error' }, { status: isConflict ? 409 : 500 });
      }
      return NextResponse.json({ error: error.message }, { status: isConflict ? 409 : 500 });
    }
    return sanitizedErrorResponse(error);
  }
}
