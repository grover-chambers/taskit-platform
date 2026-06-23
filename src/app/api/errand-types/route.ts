import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    const types = await prisma.errandType.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ errandTypes: types });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, icon } = await req.json();
    if (!name || !icon) {
      return NextResponse.json({ error: 'Name and icon required' }, { status: 400 });
    }
    const errandType = await prisma.errandType.create({
      data: { name, icon },
    });
    return NextResponse.json({ errandType });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Errand type name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
