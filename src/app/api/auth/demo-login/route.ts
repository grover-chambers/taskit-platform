import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sanitizedErrorResponse } from '@/lib/api-error';

const DEMO_ACCOUNTS: Record<string, { email: string; password: string }> = {
  admin: { email: 'admin@taskit.co.ke', password: 'MunyagaMartin.12' },
  customer: { email: 'wanjiru@email.com', password: 'customer123' },
  rider: { email: 'peter.m@taskit.co.ke', password: 'rider123' },
  vendor: { email: 'mama.njeri@taskit.co.ke', password: 'vendor123' },
  boss: { email: 'kanini.boss@taskit.co.ke', password: 'boss123' },
  operator: { email: 'kanini.desk@taskit.co.ke', password: 'desk123' },
  customer2: { email: 'brian@email.com', password: 'customer123' },
  rider2: { email: 'grace.k@taskit.co.ke', password: 'rider123' },
};

export async function POST(request: Request) {
  if (process.env.DEMO_MODE !== 'true' && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Demo login disabled in production' }, { status: 403 });
  }

  try {
    const { role } = await request.json();
    if (!role || !DEMO_ACCOUNTS[role]) {
      return NextResponse.json({ error: 'Invalid demo role' }, { status: 400 });
    }

    const account = DEMO_ACCOUNTS[role];

    const { signIn } = await import('next-auth/react');
    void signIn;

    return NextResponse.json({ email: account.email, password: account.password });
  } catch (error: unknown) {
    return sanitizedErrorResponse(error);
  }
}
