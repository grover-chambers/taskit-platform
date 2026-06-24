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
    const payouts = await prisma.payout.findMany({
      include: {
        rider: {
          include: { user: { select: { id: true, name: true, phone: true, email: true } } },
        },
        earnings: {
          include: { order: { select: { id: true, errandDescription: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingPayouts = payouts.filter(p => p.status === 'PENDING');
    const approvedPayouts = payouts.filter(p => p.status === 'APPROVED');
    const paidPayouts = payouts.filter(p => p.status === 'PAID');

    const pendingTotal = pendingPayouts.reduce((s, p) => s + p.amount, 0);
    const approvedTotal = approvedPayouts.reduce((s, p) => s + p.amount, 0);
    const paidTotal = paidPayouts.reduce((s, p) => s + p.amount, 0);

    return NextResponse.json({
      payouts,
      summary: {
        pending: { count: pendingPayouts.length, total: pendingTotal },
        approved: { count: approvedPayouts.length, total: approvedTotal },
        paid: { count: paidPayouts.length, total: paidTotal },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
