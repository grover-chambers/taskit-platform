import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashOtp, verifyOtp } from '@/lib/otp';
import { sanitizedErrorResponse } from '@/lib/api-error';

const VALID_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED', 'CANCELLED'],
};

const MAX_OTP_ATTEMPTS = 3;
const OTP_LOCKOUT_MINUTES = 5;
const OTP_EXPIRY_MINUTES = 30;

function isSameDay(a: Date | null, b: Date): boolean {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const riderDetail = await prisma.riderDetail.findUnique({
      where: { id: session.user.id },
      include: {
        user: { select: { name: true, phone: true, email: true, createdAt: true } },
        documents: {
          select: { id: true, docType: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    let orders: Record<string, unknown>[] = [];
    let activeOrder: Record<string, unknown> | null = null;

    if (riderDetail?.currentOrderId) {
      activeOrder = await prisma.order.findUnique({
        where: { id: riderDetail.currentOrderId },
        include: {
          customer: { select: { name: true, phone: true } },
          zone: true,
          shop: { select: { name: true, location: true } },
          statusLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    orders = await prisma.order.findMany({
      where: { riderId: session.user.id },
      include: {
        customer: { select: { name: true, phone: true } },
        zone: true,
        shop: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const availableOrders = await prisma.order.findMany({
      where: {
        riderId: null,
        status: { in: ['ACCEPTED', 'AWAITING_RIDER'] },
        paymentStatus: 'PAID',
      },
      include: {
        zone: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const totalAssigned = await prisma.order.count({
      where: { riderId: session.user.id, status: { in: ['DELIVERED', 'CANCELLED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] } },
    });
    const completedOrders = await prisma.order.count({
      where: { riderId: session.user.id, status: 'DELIVERED' },
    });
    const completionRate = totalAssigned > 0 ? Math.round((completedOrders / totalAssigned) * 100) : 0;

    return NextResponse.json({
      riderDetail,
      activeOrder,
      orders,
      availableOrders,
      completionRate,
    });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status, isOnline, locationEnabled, notificationsEnabled, deliveryOtp } = body;

    if (isOnline !== undefined) {
      const now = new Date();
      const rider = await prisma.riderDetail.findUnique({ where: { id: session.user.id } });
      const resetData: Record<string, unknown> = {};
      if (rider && !isSameDay(rider.earningsResetAt, now)) {
        resetData.todayEarnings = 0;
        resetData.earningsResetAt = now;
      }
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: {
          isOnline,
          ...(locationEnabled !== undefined ? { locationEnabled } : {}),
          ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}),
          ...resetData,
        },
      });
      return NextResponse.json({ success: true });
    }

    if (locationEnabled !== undefined) {
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: { locationEnabled },
      });
      return NextResponse.json({ success: true });
    }

    if (notificationsEnabled !== undefined) {
      await prisma.riderDetail.update({
        where: { id: session.user.id },
        data: { notificationsEnabled },
      });
      return NextResponse.json({ success: true });
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.riderId !== session.user.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    }
    if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 409 }
      );
    }

    if (status === 'DELIVERED') {
      if (!deliveryOtp) {
        return NextResponse.json({ error: 'Delivery OTP required' }, { status: 400 });
      }

      const isOtpExpired = order.otpGeneratedAt && (Date.now() - new Date(order.otpGeneratedAt).getTime()) > OTP_EXPIRY_MINUTES * 60 * 1000;
      if (isOtpExpired && !order.otpLockedUntil) {
        const newOtp = String(Math.floor(1000 + Math.random() * 9000));
        const newOtpHash = await hashOtp(newOtp);
        await prisma.order.update({
          where: { id: orderId },
          data: {
            deliveryOtp: newOtpHash,
            otpGeneratedAt: new Date(),
            otpAttempts: 0,
            otpLockedUntil: null,
          },
        });
        const customerUser = await prisma.user.findUnique({ where: { id: order.customerId } });
        if (customerUser) {
          await prisma.notification.create({
            data: {
              userId: customerUser.id,
              title: 'New Delivery OTP',
              body: `Your previous OTP expired. Your new delivery OTP is ${newOtp}. Share this with your rider.`,
              type: 'ORDER',
            },
          });
        }
        return NextResponse.json(
          { error: 'OTP expired. A new OTP has been sent to the customer. Please ask them for it.', otpRegenerated: true },
          { status: 200 }
        );
      }

      if (order.otpLockedUntil && new Date() < new Date(order.otpLockedUntil)) {
        const remaining = Math.ceil((new Date(order.otpLockedUntil).getTime() - Date.now()) / 60000);
        return NextResponse.json(
          { error: `OTP locked. Try again in ${remaining} min.`, otpLocked: true },
          { status: 429 }
        );
      }

      if (isOtpExpired) {
        return NextResponse.json(
          { error: 'OTP has expired and is locked. Please wait for the lockout to expire.', otpExpired: true, otpLocked: true },
          { status: 429 }
        );
      }

      const otpValid = await verifyOtp(deliveryOtp, order.deliveryOtp || '');
      if (!otpValid) {
        const newAttempts = (order.otpAttempts || 0) + 1;
        const lockUntil = newAttempts >= MAX_OTP_ATTEMPTS
          ? new Date(Date.now() + OTP_LOCKOUT_MINUTES * 60 * 1000)
          : null;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            otpAttempts: newAttempts,
            ...(lockUntil ? { otpLockedUntil: lockUntil } : {}),
          },
        });

        const attemptsLeft = MAX_OTP_ATTEMPTS - newAttempts;
        if (lockUntil) {
          return NextResponse.json(
            { error: `Wrong OTP ${MAX_OTP_ATTEMPTS} times. Locked for ${OTP_LOCKOUT_MINUTES} min.`, otpLocked: true },
            { status: 429 }
          );
        }
        return NextResponse.json(
          { error: `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.` },
          { status: 403 }
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const rider = await tx.riderDetail.findUnique({ where: { id: session.user.id } });
      const shouldResetEarnings = rider && !isSameDay(rider.earningsResetAt, now);

      if (status === 'IN_TRANSIT') {
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const otpHash = await hashOtp(otp);
        await tx.order.update({
          where: { id: orderId },
          data: {
            deliveryOtp: otpHash,
            otpGeneratedAt: now,
            otpAttempts: 0,
            otpLockedUntil: null,
          },
        });
        const customer = await tx.user.findUnique({ where: { id: order.customerId } });
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

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      await tx.orderStatus.create({
        data: {
          orderId,
          status,
          note: status === 'IN_TRANSIT'
            ? `Rider is on the way. Delivery OTP sent to customer.`
            : `Rider updated status to ${status}`,
        },
      });

      if (status === 'DELIVERED') {
        const riderUpdateData: Record<string, unknown> = {
          currentOrderId: null,
          totalTrips: { increment: 1 },
        };

        if (shouldResetEarnings) {
          riderUpdateData.earningsResetAt = now;
          riderUpdateData.todayEarnings = 0;
        }

        await tx.riderDetail.update({
          where: { id: session.user.id },
          data: riderUpdateData,
        });

        const zone = await tx.zone.findUnique({ where: { id: order.zoneId } });
        const earning = zone ? Math.round(zone.price * 0.7) : 100;

        const existingEarning = await tx.riderEarning.findUnique({ where: { orderId } });
        if (!existingEarning) {
          const payout = await tx.payout.create({
            data: {
              riderId: session.user.id,
              amount: earning,
              status: 'PENDING',
              method: 'MPESA',
            },
          });

          await tx.riderEarning.create({
            data: {
              riderId: session.user.id,
              orderId,
              amount: earning,
              payoutStatus: 'UNPAID',
              payoutId: payout.id,
            },
          });

          if (!shouldResetEarnings) {
            await tx.riderDetail.update({
              where: { id: session.user.id },
              data: { todayEarnings: { increment: earning } },
            });
          } else {
            await tx.riderDetail.update({
              where: { id: session.user.id },
              data: { todayEarnings: earning },
            });
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: { otpAttempts: 0, otpLockedUntil: null },
        });

        const customer = await tx.user.findUnique({
          where: { id: order.customerId },
        });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Order Delivered!',
              body: `Your order #${orderId.slice(-7).toUpperCase()} has been delivered`,
              type: 'ORDER',
            },
          });
        }
      }

      if (status === 'PICKED_UP') {
        const customer = await tx.user.findUnique({
          where: { id: order.customerId },
        });
        if (customer) {
          await tx.notification.create({
            data: {
              userId: customer.id,
              title: 'Order Picked Up',
              body: `Your rider has picked up order #${orderId.slice(-7).toUpperCase()}`,
              type: 'ORDER',
            },
          });
        }
      }

      return updated;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
