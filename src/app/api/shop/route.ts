import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const shop = await prisma.shop.findFirst({
      where: { vendorId: session.user.id },
      include: {
        products: { where: { available: true } },
        vendor: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
