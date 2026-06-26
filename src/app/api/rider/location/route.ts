import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lat, lng, heading, speedKmh, accuracyM, orderId } = await request.json();
    if (lat == null || lng == null) {
      return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
    }

    const rider = await prisma.riderDetail.findUnique({
      where: { id: session.user.id },
    });
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    await prisma.riderLocation.upsert({
      where: { riderId: session.user.id },
      update: {
        lat,
        lng,
        heading: heading ?? null,
        speedKmh: speedKmh ?? null,
        accuracyM: accuracyM ?? null,
        orderId: orderId ?? null,
      },
      create: {
        riderId: session.user.id,
        lat,
        lng,
        heading: heading ?? null,
        speedKmh: speedKmh ?? null,
        accuracyM: accuracyM ?? null,
        orderId: orderId ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const location = await prisma.riderLocation.findFirst({
        where: { orderId },
        include: {
          rider: {
            include: {
              user: { select: { name: true, phone: true } },
            },
          },
        },
      });

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { customerId: true },
      });

      if (session.user.role === 'CUSTOMER' && order?.customerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (session.user.role === 'VENDOR') {
        const orderCheck = await prisma.order.findUnique({
          where: { id: orderId },
          include: { enterpriseClient: { select: { ownerId: true } } },
        });
        if (!orderCheck || orderCheck.enterpriseClient?.ownerId !== session.user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      return NextResponse.json({ location });
    }

    if (session.user.role === 'ADMIN') {
      const locations = await prisma.riderLocation.findMany({
        include: {
          rider: {
            include: {
              user: { select: { id: true, name: true, phone: true } },
            },
          },
        },
      });
      return NextResponse.json({ locations });
    }

    if (session.user.role === 'RIDER') {
      const location = await prisma.riderLocation.findUnique({
        where: { riderId: session.user.id },
      });
      return NextResponse.json({ location });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
