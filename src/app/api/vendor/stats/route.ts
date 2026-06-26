import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeStatuses = ['RECEIVED', 'ACCEPTED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'];

    const [totalOrders, activeOrders, completedOrders, totalSpentResult, pendingAmountResult, currentMonthSpendResult, lastOrder] = await Promise.all([
      prisma.order.count({ where: { enterpriseClientId: client.id } }),
      prisma.order.count({ where: { enterpriseClientId: client.id, status: { in: activeStatuses } } }),
      prisma.order.count({ where: { enterpriseClientId: client.id, status: 'DELIVERED' } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { enterpriseClientId: client.id, status: 'DELIVERED' } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { enterpriseClientId: client.id, status: { not: 'DELIVERED' }, paymentStatus: 'PAID' } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { enterpriseClientId: client.id, status: 'DELIVERED', createdAt: { gte: monthStart } } }),
      prisma.order.findFirst({
        where: { enterpriseClientId: client.id },
        select: { id: true, errandDescription: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      activeOrders,
      completedOrders,
      totalSpent: totalSpentResult._sum.totalAmount || 0,
      pendingAmount: pendingAmountResult._sum.totalAmount || 0,
      currentMonthSpend: currentMonthSpendResult._sum.totalAmount || 0,
      rate: client.rate,
      clientName: client.name,
      lastOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
