import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await prisma.enterpriseClient.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { orders: true, deliveries: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ clients });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, ownerId, contact, rate, active } = body;

    if (!name || !ownerId) {
      return NextResponse.json({ error: 'Name and owner ID required' }, { status: 400 });
    }

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Owner must be a VENDOR user' }, { status: 400 });
    }

    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const apiKey = `kan_${active ? 'os_live' : 'os_test'}_${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;

    const client = await prisma.enterpriseClient.create({
      data: {
        name,
        apiKey,
        contact: contact || null,
        rate: rate || 120,
        active: active !== false,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: client.id,
        userId: session.user.id,
        action: 'CREATE_ENTERPRISE',
        entityType: 'EnterpriseClient',
        entityId: client.id,
        details: `Created enterprise: ${name}`,
      },
    });

    return NextResponse.json({ client });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
