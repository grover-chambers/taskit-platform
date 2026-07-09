import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';
import { haversineKm, calculateDeliveryPrice } from '@/lib/distance';

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = { enterpriseClientId: membership.enterpriseClientId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
              riderDetail: { select: { plateNumber: true, rating: true } },
            },
          },
          zone: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(req: Request) {
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

    if (membership.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Only operators can create orders' }, { status: 403 });
    }

    const body = await req.json();
    const {
      errandDescription, pickupLocation, dropoffLocation, contactPhone,
      specialInstructions, urgency, zoneId, customerName, weightKg,
      pickupLat, pickupLng, dropoffLat, dropoffLng,
    } = body;

    if (!errandDescription || !pickupLocation || !dropoffLocation || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await prisma.enterpriseClient.findUnique({
      where: { id: membership.enterpriseClientId },
    });
    if (!client) {
      return NextResponse.json({ error: 'Enterprise client not found' }, { status: 404 });
    }

    let weightSurcharge = 0;
    const w = weightKg ? Number(weightKg) : 0;
    if (w > 100) weightSurcharge = 0;
    else if (w > 50) weightSurcharge = 500;
    else if (w > 20) weightSurcharge = 250;
    else if (w > 5) weightSurcharge = 100;

    let totalAmount = 0;
    let distanceKm: number | null = null;
    let pricePerKmSnapshot: number | null = null;
    let resolvedZoneId: string | null = zoneId || null;

    if (client.pricingModel === 'DISTANCE') {
      if (pickupLat == null || pickupLng == null || dropoffLat == null || dropoffLng == null) {
        return NextResponse.json({ error: 'Distance mode requires pickupLat, pickupLng, dropoffLat, dropoffLng' }, { status: 400 });
      }
      if (!client.pricePerKm) {
        return NextResponse.json({ error: 'Pricing not configured — owner must set fuel price and consumption' }, { status: 400 });
      }

      distanceKm = haversineKm(Number(pickupLat), Number(pickupLng), Number(dropoffLat), Number(dropoffLng));
      pricePerKmSnapshot = client.pricePerKm;
      totalAmount = calculateDeliveryPrice({
        distanceKm,
        pricePerKm: client.pricePerKm,
        baseFare: client.baseFare,
        minimumFare: client.minimumFare,
        weightSurcharge,
      });
      resolvedZoneId = null;
    } else {
      if (!zoneId) {
        return NextResponse.json({ error: 'Zone mode requires zoneId' }, { status: 400 });
      }
      const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
      if (!zone) {
        return NextResponse.json({ error: 'Zone not found' }, { status: 400 });
      }
      totalAmount = zone.price + weightSurcharge;
    }

    const order = await prisma.order.create({
      data: {
        errandDescription,
        pickupLocation,
        dropoffLocation,
        contactPhone,
        specialInstructions: specialInstructions || null,
        urgency: urgency || 'NORMAL',
        zoneId: resolvedZoneId,
        vendorId: session.user.id,
        enterpriseClientId: client.id,
        customerId: session.user.id,
        paymentStatus: 'UNPAID',
        paymentMethod: 'PENDING',
        status: 'PRICED',
        totalAmount,
        weightKg: weightKg ? Number(weightKg) : null,
        weightSurcharge,
        pickupLat: pickupLat ? Number(pickupLat) : null,
        pickupLng: pickupLng ? Number(pickupLng) : null,
        dropoffLat: dropoffLat ? Number(dropoffLat) : null,
        dropoffLng: dropoffLng ? Number(dropoffLng) : null,
        distanceKm: distanceKm ? Math.round(distanceKm * 100) / 100 : null,
        pricePerKmSnapshot,
      },
    });

    await prisma.orderStatus.create({
      data: {
        orderId: order.id,
        status: 'PRICED',
        note: `Order created by operator ${session.user.name || session.user.id} — awaiting payment`,
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: client.id,
        userId: session.user.id,
        action: 'CREATE_ORDER',
        entityType: 'ORDER',
        entityId: order.id,
        details: client.pricingModel === 'DISTANCE'
          ? `Created order KSh ${totalAmount} — ${distanceKm?.toFixed(1)}km × KSh ${pricePerKmSnapshot}/km — ${errandDescription.slice(0, 60)}`
          : `Created order KSh ${totalAmount} — ${errandDescription.slice(0, 80)}`,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
