import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const forwarded = _req.headers.get('x-forwarded-for') || _req.headers.get('x-real-ip') || 'unknown';
  const rl = rateLimit(`track:${forwarded}`, { windowMs: 60_000, max: 30 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      errandDescription: true,
      status: true,
      pickupLocation: true,
      dropoffLocation: true,
      totalAmount: true,
      createdAt: true,
      weightKg: true,
      weightSurcharge: true,
      customer: { select: { name: true } },
      rider: {
        select: {
          name: true,
          riderDetail: { select: { plateNumber: true, rating: true } },
        },
      },
      zone: { select: { name: true } },
      statusLogs: {
        orderBy: { createdAt: 'asc' },
        select: { status: true, note: true, createdAt: true },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  let riderLocation = null;
  if (order.rider) {
    const location = await prisma.riderLocation.findFirst({
      where: { orderId: order.id },
      select: {
        lat: true,
        lng: true,
        heading: true,
        speedKmh: true,
        updatedAt: true,
      },
    });
    riderLocation = location
      ? {
          lat: Number(location.lat),
          lng: Number(location.lng),
          heading: location.heading ? Number(location.heading) : null,
          speedKmh: location.speedKmh ? Number(location.speedKmh) : null,
          updatedAt: location.updatedAt,
        }
      : null;
  }

  return NextResponse.json({
    order: {
      id: order.id,
      errandDescription: order.errandDescription,
      status: order.status,
      pickupLocation: order.pickupLocation,
      dropoffLocation: order.dropoffLocation,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      weightKg: order.weightKg,
      weightSurcharge: order.weightSurcharge,
    },
    customer: order.customer ? { name: order.customer.name } : null,
    rider: order.rider
      ? { name: order.rider.name, plateNumber: order.rider.riderDetail?.plateNumber, rating: order.rider.riderDetail?.rating }
      : null,
    zone: order.zone,
    riderLocation,
    statusLogs: order.statusLogs,
  });
}
