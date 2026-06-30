import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const allowedFields = ['name', 'contact', 'rate', 'active'];
    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const client = await prisma.enterpriseClient.update({
      where: { id },
      data,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: id,
        userId: session.user.id,
        action: 'UPDATE_ENTERPRISE',
        entityType: 'EnterpriseClient',
        entityId: id,
        details: `Updated fields: ${Object.keys(data).join(', ')}`,
      },
    });

    return NextResponse.json({ client });
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
    await prisma.enterpriseClient.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
