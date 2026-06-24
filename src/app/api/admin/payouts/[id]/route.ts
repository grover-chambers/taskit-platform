import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendKycStatusEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, reference, method } = body;

    const payout = await prisma.payout.findUnique({
      where: { id: params.id },
      include: {
        rider: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    if (action === 'approve') {
      if (payout.status !== 'PENDING') {
        return NextResponse.json({ error: 'Only PENDING payouts can be approved' }, { status: 400 });
      }
      const updated = await prisma.payout.update({
        where: { id: params.id },
        data: {
          status: 'APPROVED',
          approvedBy: session.user.id,
          approvedAt: new Date(),
        },
      });
      return NextResponse.json({ payout: updated });
    }

    if (action === 'pay') {
      if (payout.status !== 'APPROVED') {
        return NextResponse.json({ error: 'Only APPROVED payouts can be marked as paid' }, { status: 400 });
      }
      const updated = await prisma.$transaction(async (tx) => {
        const p = await tx.payout.update({
          where: { id: params.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            reference: reference || null,
            method: method || payout.method,
          },
        });

        await tx.riderEarning.updateMany({
          where: { payoutId: params.id },
          data: { payoutStatus: 'PAID' },
        });

        return p;
      });
      return NextResponse.json({ payout: updated });
    }

    if (action === 'reject') {
      if (payout.status !== 'PENDING') {
        return NextResponse.json({ error: 'Only PENDING payouts can be rejected' }, { status: 400 });
      }
      const updated = await prisma.$transaction(async (tx) => {
        const p = await tx.payout.update({
          where: { id: params.id },
          data: { status: 'REJECTED' },
        });

        await tx.riderEarning.updateMany({
          where: { payoutId: params.id },
          data: { payoutStatus: 'REJECTED' },
        });

        return p;
      });
      return NextResponse.json({ payout: updated });
    }

    return NextResponse.json({ error: 'Invalid action. Use: approve, pay, or reject' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
