import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderType = searchParams.get('orderType');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (orderType && orderType !== 'ALL') where.orderType = orderType;
    if (search) {
      where.OR = [
        { errandDescription: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { rider: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        rider: { select: { id: true, name: true, phone: true, riderDetail: { select: { plateNumber: true } } } },
        zone: { select: { id: true, name: true, price: true } },
        shop: { select: { id: true, name: true } },
        statusLogs: { orderBy: { createdAt: 'desc' } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const counts = await prisma.order.groupBy({ by: ['status'], _count: true });

    return NextResponse.json({ orders, counts });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
