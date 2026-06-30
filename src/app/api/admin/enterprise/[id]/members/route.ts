import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !['OWNER', 'OPERATOR'].includes(role)) {
      return NextResponse.json({ error: 'userId and valid role (OWNER/OPERATOR) required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'User must be a VENDOR' }, { status: 400 });
    }

    const membership = await prisma.enterpriseUser.upsert({
      where: {
        userId_enterpriseClientId: { userId, enterpriseClientId: id },
      },
      update: { role, active: true },
      create: { userId, enterpriseClientId: id, role },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: id,
        userId: session.user.id,
        action: 'ADD_MEMBER',
        entityType: 'EnterpriseUser',
        entityId: membership.id,
        details: `Added ${user.email} as ${role}`,
      },
    });

    return NextResponse.json({ membership });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const client = await prisma.enterpriseClient.findUnique({ where: { id } });
    if (client?.ownerId === userId) {
      return NextResponse.json({ error: 'Cannot remove owner. Transfer ownership first.' }, { status: 400 });
    }

    await prisma.enterpriseUser.updateMany({
      where: { enterpriseClientId: id, userId },
      data: { active: false },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: id,
        userId: session.user.id,
        action: 'REMOVE_MEMBER',
        entityType: 'EnterpriseUser',
        details: `Deactivated member ${userId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
