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
    if (body.icon !== undefined) data.icon = body.icon;
    if (body.active !== undefined) data.active = Boolean(body.active);

    const errandType = await prisma.errandType.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ errandType });
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
    const errandType = await prisma.errandType.update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ success: true, errandType });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
