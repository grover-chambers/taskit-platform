import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, targetId, rating, comment, targetRole } = await request.json();
    if (!orderId || !targetId || !rating || !targetRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { orderId_authorId_targetId: { orderId, authorId: session.user.id, targetId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Already rated' }, { status: 409 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.customerId !== session.user.id && order.riderId !== session.user.id) {
      return NextResponse.json({ error: 'You can only review orders you participated in' }, { status: 403 });
    }
    if (targetRole === 'RIDER' && order.riderId !== targetId) {
      return NextResponse.json({ error: 'Target is not the rider for this order' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        authorId: session.user.id,
        targetId,
        targetRole,
        rating: parseInt(String(rating)),
        comment: comment || null,
      },
    });

    if (targetRole === 'RIDER') {
      const allReviews = await prisma.review.findMany({
        where: { targetId, targetRole: 'RIDER' },
        select: { rating: true },
      });
      const avg = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;
      await prisma.riderDetail.update({
        where: { id: targetId },
        data: { rating: Math.round(avg * 10) / 10 },
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const targetId = searchParams.get('targetId');

    const where: Record<string, unknown> = {};
    if (orderId) where.orderId = orderId;
    if (targetId) where.targetId = targetId;
    if (!orderId && !targetId) where.authorId = session.user.id;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        author: { select: { name: true } },
        order: { select: { errandDescription: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
