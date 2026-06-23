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
    const tickets = await prisma.supportTicket.findMany({
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        rider: { select: { id: true, name: true, phone: true, email: true } },
        assignee: { select: { id: true, name: true } },
        order: { select: { id: true, errandDescription: true, status: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const openCount = tickets.filter(t => t.status === 'OPEN').length;
    const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;

    return NextResponse.json({ tickets, openCount, inProgressCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, category, priority, customerId, riderId, orderId, message, channel } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        subject: subject || 'New support ticket',
        category: category || 'GENERAL',
        priority: priority || 'NORMAL',
        status: 'OPEN',
        customerId: customerId || null,
        riderId: riderId || null,
        orderId: orderId || null,
        assigneeId: session.user.id,
        messages: {
          create: {
            body: message,
            direction: 'OUTBOUND',
            channel: channel || 'WHATSAPP',
            senderId: session.user.id,
          },
        },
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        rider: { select: { id: true, name: true, phone: true } },
        order: { select: { id: true, errandDescription: true } },
        messages: true,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
