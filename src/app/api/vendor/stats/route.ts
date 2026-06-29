import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
      include: { enterpriseClient: true },
    });

    if (!membership || !membership.enterpriseClient) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const client = membership.enterpriseClient;

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
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
