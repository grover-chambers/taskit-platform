import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

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
      await prisma.notification.create({
        data: {
          userId: payout.riderId,
          title: 'Payout Approved',
          body: `Your payout of KSh ${payout.amount} has been approved`,
          type: 'PAYMENT',
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

        await tx.notification.create({
          data: {
            userId: payout.riderId,
            title: 'Payout Received',
            body: `Your payout of KSh ${payout.amount} has been sent${reference ? ` — Ref: ${reference}` : ''}`,
            type: 'PAYMENT',
          },
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

        await tx.notification.create({
          data: {
            userId: payout.riderId,
            title: 'Payout Rejected',
            body: `Your payout of KSh ${payout.amount} was rejected. Contact support.`,
            type: 'PAYMENT',
          },
        });

        return p;
      });
      return NextResponse.json({ payout: updated });
    }

    return NextResponse.json({ error: 'Invalid action. Use: approve, pay, or reject' }, { status: 400 });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
