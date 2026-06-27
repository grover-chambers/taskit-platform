import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  const { errandDescription, pickupLocation, dropoffLocation, contactPhone, specialInstructions, urgency, zoneId, customerName } = body;

  if (!errandDescription || !pickupLocation || !dropoffLocation || !contactPhone || !zoneId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const client = await prisma.enterpriseClient.findUnique({
    where: { id: membership.enterpriseClientId },
  });
  if (!client) {
    return NextResponse.json({ error: 'Enterprise client not found' }, { status: 404 });
  }

  const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
  if (!zone) {
    return NextResponse.json({ error: 'Zone not found' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      errandDescription,
      pickupLocation,
      dropoffLocation,
      contactPhone,
      specialInstructions: specialInstructions || null,
      urgency: urgency || 'NORMAL',
      zoneId,
      vendorId: session.user.id,
      enterpriseClientId: client.id,
      customerId: session.user.id,
      paymentStatus: 'UNPAID',
      paymentMethod: 'PENDING',
      status: 'PRICED',
      totalAmount: zone.price,
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
      details: `Created order KSh ${zone.price} — ${errandDescription.slice(0, 80)}`,
    },
  });

  return NextResponse.json({ success: true, order }, { status: 201 });
}
