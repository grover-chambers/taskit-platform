import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';
import { derivePricePerKm } from '@/lib/distance';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
    });
    if (!membership) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }

    const client = await prisma.enterpriseClient.findUnique({
      where: { id: membership.enterpriseClientId },
      select: {
        pricingModel: true,
        fuelPricePerLiter: true,
        fuelConsumptionKmpl: true,
        markupPercent: true,
        pricePerKm: true,
        baseFare: true,
        minimumFare: true,
      },
    });

    return NextResponse.json({ pricing: client });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const membership = await prisma.enterpriseUser.findFirst({
      where: { userId: session.user.id, active: true },
    });
    if (!membership) {
      return NextResponse.json({ error: 'Not an enterprise member' }, { status: 403 });
    }
    if (membership.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only owners can update pricing' }, { status: 403 });
    }

    const body = await req.json();
    const {
      pricingModel,
      fuelPricePerLiter,
      fuelConsumptionKmpl,
      markupPercent,
      baseFare,
      minimumFare,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (pricingModel !== undefined) {
      if (!['ZONE', 'DISTANCE'].includes(pricingModel)) {
        return NextResponse.json({ error: 'pricingModel must be ZONE or DISTANCE' }, { status: 400 });
      }
      updateData.pricingModel = pricingModel;
    }

    if (fuelPricePerLiter !== undefined) updateData.fuelPricePerLiter = Number(fuelPricePerLiter);
    if (fuelConsumptionKmpl !== undefined) updateData.fuelConsumptionKmpl = Number(fuelConsumptionKmpl);
    if (markupPercent !== undefined) updateData.markupPercent = Number(markupPercent);
    if (baseFare !== undefined) updateData.baseFare = Number(baseFare);
    if (minimumFare !== undefined) updateData.minimumFare = Number(minimumFare);

    const current = await prisma.enterpriseClient.findUnique({
      where: { id: membership.enterpriseClientId },
    });

    const fuel = Number(updateData.fuelPricePerLiter ?? current?.fuelPricePerLiter ?? 0);
    const consumption = Number(updateData.fuelConsumptionKmpl ?? current?.fuelConsumptionKmpl ?? 0);
    const markup = Number(updateData.markupPercent ?? current?.markupPercent ?? 30);

    if (fuel > 0 && consumption > 0) {
      updateData.pricePerKm = derivePricePerKm({
        fuelPricePerLiter: fuel,
        fuelConsumptionKmpl: consumption,
        markupPercent: markup,
      });
    }

    const updated = await prisma.enterpriseClient.update({
      where: { id: membership.enterpriseClientId },
      data: updateData,
      select: {
        pricingModel: true,
        fuelPricePerLiter: true,
        fuelConsumptionKmpl: true,
        markupPercent: true,
        pricePerKm: true,
        baseFare: true,
        minimumFare: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        enterpriseClientId: membership.enterpriseClientId,
        userId: session.user.id,
        action: 'UPDATE_PRICING',
        entityType: 'PRICING_CONFIG',
        entityId: membership.enterpriseClientId,
        details: JSON.stringify({
          before: {
            pricingModel: current?.pricingModel,
            fuelPricePerLiter: current?.fuelPricePerLiter?.toString(),
            fuelConsumptionKmpl: current?.fuelConsumptionKmpl?.toString(),
            markupPercent: current?.markupPercent,
            pricePerKm: current?.pricePerKm,
            baseFare: current?.baseFare,
            minimumFare: current?.minimumFare,
          },
          after: {
            pricingModel: updated.pricingModel,
            fuelPricePerLiter: updated.fuelPricePerLiter?.toString(),
            fuelConsumptionKmpl: updated.fuelConsumptionKmpl?.toString(),
            markupPercent: updated.markupPercent,
            pricePerKm: updated.pricePerKm,
            baseFare: updated.baseFare,
            minimumFare: updated.minimumFare,
          },
        }),
      },
    });

    return NextResponse.json({ pricing: updated });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
