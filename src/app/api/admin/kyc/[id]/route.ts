import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendKycStatusEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Status must be APPROVED or REJECTED' }, { status: 400 });
    }

    const doc = await prisma.riderDocument.update({
      where: { id: params.id },
      data: { status, reviewedBy: session.user.id, reviewedAt: new Date() },
    });

    const allDocs = await prisma.riderDocument.findMany({
      where: { riderId: doc.riderId },
    });

    const hasId = allDocs.some(d => d.docType === 'ID_FRONT' && d.status === 'APPROVED') && allDocs.some(d => d.docType === 'ID_BACK' && d.status === 'APPROVED');
    const hasPhoto = allDocs.some(d => d.docType === 'PASSPORT_PHOTO' && d.status === 'APPROVED');
    const hasDlOrGuarantor = allDocs.some(d => d.docType === 'DRIVING_LICENSE' && d.status === 'APPROVED') || (allDocs.some(d => d.docType === 'GUARANTOR_ID_FRONT' && d.status === 'APPROVED') && allDocs.some(d => d.docType === 'GUARANTOR_ID_BACK' && d.status === 'APPROVED'));
    const hasGoodConductOrInsurance = allDocs.some(d => d.docType === 'GOOD_CONDUCT' && d.status === 'APPROVED') || allDocs.some(d => d.docType === 'INSURANCE_POLICY' && d.status === 'APPROVED');

    const allApproved = hasId && hasPhoto && hasDlOrGuarantor && hasGoodConductOrInsurance;
    const anyRejected = allDocs.some(d => d.status === 'REJECTED');

    let kycStatus = 'PENDING';
    if (allApproved) kycStatus = 'VERIFIED';
    else if (anyRejected) kycStatus = 'REJECTED';

    await prisma.riderDetail.update({
      where: { id: doc.riderId },
      data: { kycStatus },
    });

    await prisma.notification.create({
      data: {
        userId: doc.riderId,
        title: status === 'APPROVED' ? 'Document Approved' : 'Document Rejected',
        body: status === 'APPROVED'
          ? `Your ${doc.docType.replace(/_/g, ' ')} has been approved`
          : `Your ${doc.docType.replace(/_/g, ' ')} was rejected. Please re-upload.`,
        type: 'SYSTEM',
      },
    });

    const riderUser = await prisma.user.findUnique({ where: { id: doc.riderId } });
    if (riderUser?.email) {
      sendKycStatusEmail(riderUser.email, riderUser.name || 'Rider', status).catch(err => {
        console.error('KYC status email failed:', err);
      });
    }

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
