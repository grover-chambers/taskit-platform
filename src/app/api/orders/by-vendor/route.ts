import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { vendorId: session.user.id },
          { shop: { vendorId: session.user.id } },
        ],
      },
      include: {
        zone: true,
        customer: { select: { name: true, phone: true } },
        rider: { select: { name: true, phone: true } },
        shop: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const stats = {
      todayRevenue: orders
        .filter(o => {
          const today = new Date(); today.setHours(0,0,0,0);
          return o.createdAt >= today && o.paymentStatus === 'PAID';
        })
        .reduce((sum, o) => sum + o.totalAmount, 0),
      totalOrders: orders.length,
      newCount: orders.filter(o => o.status === 'RECEIVED').length,
    };

    return NextResponse.json({ orders, stats });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
