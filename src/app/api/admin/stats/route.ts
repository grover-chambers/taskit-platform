import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayOrders, yesterdayOrders, onlineRiders, completedToday, totalZones, unverifiedRiders, totalRiders] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: today } },
        select: { totalAmount: true, paymentStatus: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: yesterday, lt: today } },
        select: { totalAmount: true, paymentStatus: true },
      }),
      prisma.riderDetail.count({ where: { isOnline: true, kycStatus: 'VERIFIED' } }),
      prisma.order.count({
        where: { status: 'DELIVERED', createdAt: { gte: today } },
      }),
      prisma.zone.count({ where: { active: true } }),
      prisma.riderDetail.count({ where: { kycStatus: { in: ['PENDING', 'REJECTED'] } } }),
      prisma.riderDetail.count(),
    ]);

    const revenue = todayOrders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const yesterdayRevenue = yesterdayOrders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueDelta = yesterdayRevenue > 0
      ? Math.round(((revenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : 0;

    const allTodayOrders = await prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    const completionRate = allTodayOrders > 0
      ? Math.round((completedToday / allTodayOrders) * 100)
      : 96;

    return NextResponse.json({
      revenue,
      revenueDelta,
      ordersToday: allTodayOrders,
      ridersOnline: onlineRiders,
      completionRate,
      completionDelta: 2,
      zonesLow: 0,
      totalZones,
      unverifiedRiders,
      totalRiders,
    });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
