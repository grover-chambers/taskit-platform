import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [todayPaid, monthPaid, lastMonthPaid, totalRevenue, riderPayouts, orderByType] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: { paymentStatus: 'PAID', createdAt: { gte: today } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: { paymentStatus: 'PAID', createdAt: { gte: thisMonth } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: { paymentStatus: 'PAID', createdAt: { gte: lastMonth, lt: thisMonth } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: { paymentStatus: 'PAID' },
      }),
      prisma.riderEarning.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
      prisma.order.groupBy({
        by: ['orderType'],
        _sum: { totalAmount: true },
        _count: true,
        where: { paymentStatus: 'PAID' },
      }),
    ]);

    const monthlyGrowth = lastMonthPaid._sum.totalAmount && lastMonthPaid._sum.totalAmount > 0
      ? Math.round((((monthPaid._sum.totalAmount || 0) - lastMonthPaid._sum.totalAmount) / lastMonthPaid._sum.totalAmount) * 100)
      : 0;

    const recentTransactions = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: {
        id: true,
        totalAmount: true,
        paymentMethod: true,
        mpesaReceipt: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentPayouts = await prisma.riderEarning.findMany({
      include: {
        rider: { include: { user: { select: { name: true } } } },
        order: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      today: { revenue: todayPaid._sum.totalAmount || 0, orders: todayPaid._count },
      thisMonth: { revenue: monthPaid._sum.totalAmount || 0, orders: monthPaid._count },
      monthlyGrowth,
      total: { revenue: totalRevenue._sum.totalAmount || 0, orders: totalRevenue._count },
      totalPayouts: riderPayouts._sum.amount || 0,
      totalPayoutCount: riderPayouts._count,
      orderByType: orderByType.map(t => ({ type: t.orderType, revenue: t._sum.totalAmount || 0, count: t._count })),
      recentTransactions,
      recentPayouts: recentPayouts.map(p => ({
        id: p.id,
        amount: p.amount,
        riderName: p.rider?.user?.name || 'Unknown',
        orderId: p.orderId,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
