import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

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
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'RIDER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { docType, url, documentNumber, expiryDate } = await request.json();

    if (!docType || !url) {
      return NextResponse.json({ error: 'docType and url required' }, { status: 400 });
    }

    const validTypes = ['ID_FRONT', 'ID_BACK', 'DRIVING_LICENSE', 'GUARANTOR_ID_FRONT', 'GUARANTOR_ID_BACK', 'GOOD_CONDUCT', 'INSURANCE_POLICY', 'PASSPORT_PHOTO'];
    if (!validTypes.includes(docType)) {
      return NextResponse.json({ error: 'Invalid docType' }, { status: 400 });
    }

    const existing = await prisma.riderDocument.findFirst({
      where: { riderId: session.user.id, docType },
    });

    const docData: any = {
      url,
      status: 'PENDING',
      reviewedBy: null,
      reviewedAt: null,
      documentNumber: documentNumber ?? null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    };

    let document;
    if (existing) {
      document = await prisma.riderDocument.update({
        where: { id: existing.id },
        data: docData,
      });
    } else {
      document = await prisma.riderDocument.create({
        data: { riderId: session.user.id, docType, ...docData },
      });
    }

    const allDocs = await prisma.riderDocument.findMany({
      where: { riderId: session.user.id },
    });

    const isApproved = (t: string) => allDocs.some(d => d.docType === t && d.status === 'APPROVED');

    const idFrontApproved = isApproved('ID_FRONT');
    const idBackApproved = isApproved('ID_BACK');
    const passportPhotoApproved = isApproved('PASSPORT_PHOTO');
    const hasDrivingLicense = isApproved('DRIVING_LICENSE');
    const hasGuarantorIds = isApproved('GUARANTOR_ID_FRONT') && isApproved('GUARANTOR_ID_BACK');
    const hasGoodConduct = isApproved('GOOD_CONDUCT');
    const hasInsurancePolicy = isApproved('INSURANCE_POLICY');

    const allApproved =
      idFrontApproved &&
      idBackApproved &&
      passportPhotoApproved &&
      (hasDrivingLicense || hasGuarantorIds) &&
      (hasGoodConduct || hasInsurancePolicy);

    const requiredCategoryTypes = [
      'ID_FRONT', 'ID_BACK', 'PASSPORT_PHOTO',
      'DRIVING_LICENSE', 'GUARANTOR_ID_FRONT', 'GUARANTOR_ID_BACK',
      'GOOD_CONDUCT', 'INSURANCE_POLICY',
    ];
    const anyRejected = allDocs
      .filter(d => requiredCategoryTypes.includes(d.docType))
      .some(d => d.status === 'REJECTED');
    const anyPending = allDocs
      .filter(d => requiredCategoryTypes.includes(d.docType))
      .some(d => d.status === 'PENDING');

    let kycStatus = 'PENDING';
    if (anyRejected) {
      kycStatus = 'REJECTED';
    } else if (allApproved) {
      kycStatus = 'VERIFIED';
    } else {
      kycStatus = 'PENDING';
    }

    await prisma.riderDetail.update({
      where: { id: session.user.id },
      data: { kycStatus },
    });

    return NextResponse.json({ document });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
