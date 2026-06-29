import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const unpaidEarnings = await prisma.riderEarning.findMany({
      where: {
        riderId: session.user.id,
        payoutStatus: 'UNPAID',
        payoutId: null,
      },
    });

    if (unpaidEarnings.length === 0) {
      return NextResponse.json({ error: 'No unpaid earnings available for payout' }, { status: 400 });
    }

    const totalAmount = unpaidEarnings.reduce((sum, e) => sum + e.amount, 0);

    const payout = await prisma.$transaction(async (tx) => {
      const newPayout = await tx.payout.create({
        data: {
          riderId: session.user.id,
          amount: totalAmount,
          status: 'PENDING',
          method: 'MPESA',
        },
      });

      await tx.riderEarning.updateMany({
        where: {
          id: { in: unpaidEarnings.map(e => e.id) },
        },
        data: { payoutId: newPayout.id },
      });

      return newPayout;
    });

    return NextResponse.json({ success: true, payout });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
