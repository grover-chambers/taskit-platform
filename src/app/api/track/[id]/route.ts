import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      errandDescription: true,
      status: true,
      pickupLocation: true,
      dropoffLocation: true,
      contactPhone: true,
      specialInstructions: true,
      urgency: true,
      deliveryOtp: true,
      totalAmount: true,
      createdAt: true,
      weightKg: true,
      customer: { select: { name: true } },
      rider: {
        select: {
          name: true,
          phone: true,
          riderDetail: { select: { plateNumber: true, rating: true } },
        },
      },
      zone: { select: { name: true, price: true } },
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
    order,
    customer: order.customer,
    rider: order.rider,
    zone: order.zone,
    riderLocation,
    statusLogs: order.statusLogs,
  });
}
