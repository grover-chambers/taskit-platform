import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendSupportAlertEmail } from '@/lib/email';
import { sanitizedErrorResponse } from '@/lib/api-error';

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
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
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

    if (priority === 'HIGH' || priority === 'URGENT') {
      const customerName = ticket.customer?.name || ticket.rider?.name || 'Unknown';
      sendSupportAlertEmail(
        ticket.id,
        ticket.subject || 'New support ticket',
        ticket.priority,
        customerName,
        message,
      ).catch(err => {
        console.error('Support alert email failed:', err);
      });
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
