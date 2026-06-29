import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const where: any = { id: params.id };
    if (session.user.role === 'CUSTOMER') {
      where.customerId = session.user.id;
    } else if (session.user.role === 'RIDER') {
      where.riderId = session.user.id;
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const ticket = await prisma.supportTicket.findFirst({
      where,
      include: {
        order: { select: { id: true, errandDescription: true, status: true } },
        assignee: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true } } },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'CUSTOMER' && session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
  }

  try {
    const where: any = { id: params.id };
    if (session.user.role === 'CUSTOMER') {
      where.customerId = session.user.id;
    } else {
      where.riderId = session.user.id;
    }

    const existing = await prisma.supportTicket.findFirst({ where });
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: {
        status: existing.status === 'RESOLVED' || existing.status === 'CLOSED' ? 'OPEN' : existing.status,
        messages: {
          create: {
            body: message.trim(),
            direction: 'INBOUND',
            channel: 'EMAIL',
            senderId: session.user.id,
          },
        },
      },
      include: {
        order: { select: { id: true, errandDescription: true, status: true } },
        assignee: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true } } },
        },
      },
    });

    return NextResponse.json({ ticket });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
