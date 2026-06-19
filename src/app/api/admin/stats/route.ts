import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: today, lt: todayEnd } },
    });

    const yesterdayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: yesterday, lt: today } },
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const revenueDelta = yesterdayRevenue > 0 ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : 0;

    const activeLiveOrders = todayOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;

    const onlineRiders = await prisma.riderDetail.count({ where: { isOnline: true } });

    const totalOrdersToday = todayOrders.length;
    const completedToday = todayOrders.filter(o => o.status === 'DELIVERED').length;
    const completionRate = totalOrdersToday > 0 ? Math.round((completedToday / totalOrdersToday) * 100) : 100;

    const ordersDelta = yesterdayOrders.length > 0
      ? Math.round(((totalOrdersToday - yesterdayOrders.length) / yesterdayOrders.length) * 100)
      : 0;

    const liveOrders = await prisma.order.findMany({
      where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } },
      include: {
        customer: { select: { name: true } },
        rider: { select: { name: true } },
        zone: true,
        shop: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      stats: {
        revenue: todayRevenue,
        revenueDelta,
        ordersToday: totalOrdersToday,
        ordersDelta,
        activeLive: activeLiveOrders,
        onlineRiders,
        completionRate,
      },
      liveOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
