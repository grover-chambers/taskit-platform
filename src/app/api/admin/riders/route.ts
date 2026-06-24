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
    const riders = await prisma.riderDetail.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        location: true,
        documents: { select: { id: true, docType: true, documentNumber: true, expiryDate: true, url: true, status: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ riders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
