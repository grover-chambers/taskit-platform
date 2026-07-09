import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
      include: {
        enterpriseClient: {
          select: {
            id: true,
            name: true,
            rate: true,
            active: true,
            pricingModel: true,
            fuelPricePerLiter: true,
            fuelConsumptionKmpl: true,
            markupPercent: true,
            pricePerKm: true,
            baseFare: true,
            minimumFare: true,
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
      enterprise: {
        id: membership.enterpriseClient.id,
        name: membership.enterpriseClient.name,
        rate: membership.enterpriseClient.rate,
        active: membership.enterpriseClient.active,
      },
      pricing: {
        pricingModel: membership.enterpriseClient.pricingModel,
        fuelPricePerLiter: membership.enterpriseClient.fuelPricePerLiter,
        fuelConsumptionKmpl: membership.enterpriseClient.fuelConsumptionKmpl,
        markupPercent: membership.enterpriseClient.markupPercent,
        pricePerKm: membership.enterpriseClient.pricePerKm,
        baseFare: membership.enterpriseClient.baseFare,
        minimumFare: membership.enterpriseClient.minimumFare,
      },
    });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
