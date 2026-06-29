import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.price !== undefined) data.price = parseInt(String(body.price));
    if (body.active !== undefined) data.active = Boolean(body.active);

    const zone = await prisma.zone.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ zone });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const zone = await prisma.zone.update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ success: true, zone });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
