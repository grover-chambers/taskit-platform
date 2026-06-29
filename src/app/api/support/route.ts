import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendSupportAlertEmail } from '@/lib/email';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const where: any = {};
    if (session.user.role === 'CUSTOMER') {
      where.customerId = session.user.id;
    } else if (session.user.role === 'RIDER') {
      where.riderId = session.user.id;
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        order: { select: { id: true, errandDescription: true, status: true } },
        assignee: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'CUSTOMER' && session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Only customers and riders can create tickets' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { subject, category, priority, orderId, message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const data: any = {
      subject: subject?.trim() || 'Support Request',
      category: category || 'GENERAL',
      priority: priority || 'NORMAL',
      status: 'OPEN',
      orderId: orderId || null,
      messages: {
        create: {
          body: message.trim(),
          direction: 'INBOUND',
          channel: 'EMAIL',
          senderId: session.user.id,
        },
      },
    };

    if (session.user.role === 'CUSTOMER') {
      data.customerId = session.user.id;
    } else {
      data.riderId = session.user.id;
    }

    const ticket = await prisma.supportTicket.create({
      data,
      include: {
        order: { select: { id: true, errandDescription: true, status: true } },
        assignee: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true } } },
        },
      },
    });

    if (priority === 'HIGH' || priority === 'URGENT') {
      const userName = session.user.name || 'User';
      sendSupportAlertEmail(
        ticket.id,
        ticket.subject || 'Support Request',
        ticket.priority,
        userName,
        message.trim(),
      ).catch(() => {});
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
