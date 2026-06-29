import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizedErrorResponse } from '@/lib/api-error';

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await prisma.riderDetail.updateMany({
      where: {
        earningsResetAt: { lt: yesterday },
      },
      data: {
        todayEarnings: 0,
        earningsResetAt: now,
      },
    });

    return NextResponse.json({ success: true, reset: result.count });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
