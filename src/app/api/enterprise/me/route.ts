import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.enterpriseUser.findFirst({
    where: { userId: session.user.id, active: true },
    include: {
      enterpriseClient: {
        select: {
          id: true,
          name: true,
          rate: true,
          active: true,
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ error: 'Not an enterprise member', subRole: null }, { status: 403 });
  }

  return NextResponse.json({
    subRole: membership.role,
    enterpriseClientId: membership.enterpriseClientId,
    enterprise: membership.enterpriseClient,
  });
}
