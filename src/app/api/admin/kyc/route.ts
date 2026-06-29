import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingDocs = await prisma.riderDocument.findMany({
      where: { status: 'PENDING' },
      include: {
        rider: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const allDocs = await prisma.riderDocument.findMany({
      include: {
        rider: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const documents = Object.values(
      allDocs.reduce((acc, doc) => {
        const key = doc.riderId;
        if (!acc[key]) acc[key] = { rider: doc.rider, documents: [] };
        acc[key].documents.push(doc);
        return acc;
      }, {} as Record<string, { rider: any; documents: any[] }>)
    );

    return NextResponse.json({ documents, pending: pendingDocs });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
