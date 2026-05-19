import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Purging old data...');
  await prisma.order.deleteMany();
  await prisma.riderDetail.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.errandType.deleteMany();
  await prisma.zone.deleteMany();
  // Keep users (admin), just delete customers/riders for clean slate
  await prisma.user.deleteMany({ where: { role: { in: ['CUSTOMER', 'RIDER'] } } });

  console.log('🌱 Seeding baseline data...');

  // 1. Create Default Zones
  await prisma.zone.createMany({
    data: [
      { name: 'Nairobi CBD', price: 150, active: true },
      { name: 'Westlands', price: 250, active: true },
      { name: 'Eastleigh', price: 300, active: true },
      { name: 'Ngara / Kamukunji', price: 300, active: true },
    ]
  });

  // 2. Create Default Errand Types
  await prisma.errandType.createMany({
    data: [
      { name: 'Shopping', icon: '🛍️', active: true },
      { name: 'Bills', icon: '📄', active: true },
      { name: 'Documents', icon: '📁', active: true },
      { name: 'Groceries', icon: '🥑', active: true },
      { name: 'Pharmacy', icon: '💊', active: true },
      { name: 'Custom', icon: '✨', active: true },
    ]
  });

  // 3. Create Platform Settings (Till Number)
  await prisma.setting.create({
    data: { key: 'mpesa_till_number', value: '123456' }
  });

  // 4. Ensure Admin Exists
  const adminEmail = 'admin@taskit.co.ke';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('MunyagaMartin.12', 12);
    await prisma.user.create({
      data: {
        id: 'admin-taskit-001',
        email: adminEmail,
        password: hashedPassword,
        name: 'TaskIt Owner',
        phone: '+254700000000',
        role: 'ADMIN',
      }
    });
    console.log('👑 Admin user created.');
  } else {
    console.log('👑 Admin user already exists.');
  }

  console.log('✅ Baseline data seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
