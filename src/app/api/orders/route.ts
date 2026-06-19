import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { zoneId, errandDescription, totalAmount, shopId } = await request.json();

    const order = await prisma.order.create({
      data: {
        customerId: session.user.id,
        zoneId,
        errandDescription,
        totalAmount: totalAmount || 0,
        status: 'RECEIVED',
        paymentStatus: 'UNPAID',
        shopId: shopId || null,
      },
    });

    await prisma.orderStatus.create({
      data: {
        orderId: order.id,
        status: 'RECEIVED',
        note: 'Order placed by customer',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'customer';

  try {
    let orders;
    const baseInclude = {
      zone: true,
      customer: { select: { id: true, name: true, phone: true } },
      rider: { select: { id: true, name: true, phone: true } },
      shop: true,
      statusLogs: { orderBy: { createdAt: 'asc' as const } },
    };

    if (role === 'customer') {
      orders = await prisma.order.findMany({
        where: { customerId: session.user.id },
        include: baseInclude,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        include: baseInclude,
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
