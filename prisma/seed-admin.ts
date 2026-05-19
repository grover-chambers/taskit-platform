import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@taskit.co.ke';
  const plainPassword = 'MunyagaMartin.12';
  
  // Hash the password securely
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  console.log('👑 Creating Admin User...');
  
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: {
      id: 'admin-taskit-001',
      email,
      password: hashedPassword,
      name: 'TaskIt Owner',
      phone: '+254700000000',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/updated successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
