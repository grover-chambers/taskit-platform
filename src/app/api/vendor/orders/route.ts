import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await prisma.enterpriseClient.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!client) {
      return NextResponse.json({ error: 'Enterprise client not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = { enterpriseClientId: client.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          rider: { select: { name: true, phone: true } },
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await prisma.enterpriseClient.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!client) {
      return NextResponse.json({ error: 'Enterprise client not found' }, { status: 404 });
    }

    const body = await req.json();
    const { errandDescription, pickupLocation, dropoffLocation, contactPhone, specialInstructions, urgency, zoneId } = body;

    if (!errandDescription || !pickupLocation || !dropoffLocation || !contactPhone || !zoneId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
        paymentStatus: 'PAID',
        status: 'ACCEPTED',
        paymentMethod: 'INVOICE',
        totalAmount: client.rate,
      },
    });

    await prisma.orderStatus.create({
      data: {
        orderId: order.id,
        status: 'ACCEPTED',
        note: 'Enterprise order — auto-accepted',
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
