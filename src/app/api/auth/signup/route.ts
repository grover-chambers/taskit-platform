import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, role, licenseNumber, plateNumber } = body;

    if (!name || !phone || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email }] }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Phone or Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        password: hashedPassword,
        role,
      }
    });

    // If Rider, create RiderDetail
    if (role === 'RIDER' && licenseNumber && plateNumber) {
      await prisma.riderDetail.create({
        data: {
          id: user.id,
          licenseNumber,
          plateNumber,
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Account created successfully' });
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
