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
    const earnings = await prisma.riderEarning.findMany({
      where: { riderId: session.user.id },
      include: {
        order: { select: { id: true, errandDescription: true, createdAt: true } },
        payout: { select: { id: true, status: true, paidAt: true, reference: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
    const availableBalance = earnings
      .filter(e => e.payoutStatus === 'PAID')
      .reduce((sum, e) => sum + e.amount, 0);
    const pendingBalance = earnings
      .filter(e => e.payoutStatus === 'UNPAID')
      .reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({ earnings, totalEarnings, availableBalance, pendingBalance });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
