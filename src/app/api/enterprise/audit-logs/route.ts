import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.enterpriseUser.findFirst({
    where: { userId: session.user.id, active: true },
  });
  if (!membership) {
    return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const logs = await prisma.auditLog.findMany({
    where: { enterpriseClientId: membership.enterpriseClientId },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ logs });
}
