import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const documents = await prisma.riderDocument.findMany({
      where: { riderId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { docType, url } = await request.json();

    if (!docType || !url) {
      return NextResponse.json({ error: 'docType and url required' }, { status: 400 });
    }

    const validTypes = ['ID_CARD', 'DRIVING_LICENSE', 'GOOD_CONDUCT', 'PASSPORT_PHOTO', 'OTHER'];
    if (!validTypes.includes(docType)) {
      return NextResponse.json({ error: 'Invalid docType' }, { status: 400 });
    }

    const existing = await prisma.riderDocument.findFirst({
      where: { riderId: session.user.id, docType },
    });

    let document;
    if (existing) {
      document = await prisma.riderDocument.update({
        where: { id: existing.id },
        data: { url, status: 'PENDING', reviewedBy: null, reviewedAt: null },
      });
    } else {
      document = await prisma.riderDocument.create({
        data: { riderId: session.user.id, docType, url },
      });
    }

    const allDocs = await prisma.riderDocument.findMany({
      where: { riderId: session.user.id },
    });

    const requiredTypes = ['ID_CARD', 'DRIVING_LICENSE', 'GOOD_CONDUCT', 'PASSPORT_PHOTO'];
    const allApproved = requiredTypes.every(t =>
      allDocs.some(d => d.docType === t && d.status === 'APPROVED')
    );
    const anyRejected = allDocs.some(d => d.status === 'REJECTED');
    const anyPending = allDocs.some(d => d.status === 'PENDING');

    let kycStatus = 'PENDING';
    if (allApproved) kycStatus = 'VERIFIED';
    else if (anyRejected) kycStatus = 'REJECTED';
    else if (anyPending) kycStatus = 'PENDING';

    await prisma.riderDetail.update({
      where: { id: session.user.id },
      data: { kycStatus },
    });

    return NextResponse.json({ document });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
