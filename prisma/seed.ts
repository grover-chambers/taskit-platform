import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Purging old data...');
  await prisma.enterpriseDelivery.deleteMany();
  await prisma.enterpriseClient.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatus.deleteMany();
  await prisma.riderEarning.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.riderDetail.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.errandType.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hashSync(pw, 6);

  console.log('🌱 Seeding baseline data...');

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      id: 'admin-001',
      email: 'admin@taskit.co.ke',
      password: hash('MunyagaMartin.12'),
      name: 'TaskIt Owner',
      phone: '+254700000001',
      role: 'ADMIN',
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      id: 'vendor-001',
      email: 'mama.njeri@taskit.co.ke',
      password: hash('vendor123'),
      name: 'Mama Njeri',
      phone: '+254700000002',
      role: 'VENDOR',
    },
  });

  const riderUser = await prisma.user.create({
    data: {
      id: 'rider-001',
      email: 'peter.m@taskit.co.ke',
      password: hash('rider123'),
      name: 'Peter Mwangi',
      phone: '+254700000003',
      role: 'RIDER',
    },
  });

  const riderUser2 = await prisma.user.create({
    data: {
      id: 'rider-002',
      email: 'grace.k@taskit.co.ke',
      password: hash('rider123'),
      name: 'Grace Kamau',
      phone: '+254700000004',
      role: 'RIDER',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      id: 'customer-001',
      email: 'wanjiru@email.com',
      password: hash('customer123'),
      name: 'Wanjiru N.',
      phone: '+254700000005',
      role: 'CUSTOMER',
    },
  });

  // 2. Zones
  const cbd = await prisma.zone.create({ data: { id: 'zone-cbd', name: 'Nairobi CBD', price: 150, active: true } });
  const westlands = await prisma.zone.create({ data: { id: 'zone-west', name: 'Westlands', price: 250, active: true } });
  const eastleigh = await prisma.zone.create({ data: { id: 'zone-east', name: 'Eastleigh', price: 300, active: true } });
  const ngara = await prisma.zone.create({ data: { id: 'zone-ngara', name: 'Ngara / Kamukunji', price: 300, active: true } });

  // 3. Errand Types
  await prisma.errandType.createMany({
    data: [
      { name: 'Shopping', icon: '🛍️' },
      { name: 'Bills', icon: '📄' },
      { name: 'Documents', icon: '📁' },
      { name: 'Groceries', icon: '🥑' },
      { name: 'Pharmacy', icon: '💊' },
      { name: 'Custom', icon: '✨' },
    ],
  });

  // 4. Shop (Vendor)
  const shop = await prisma.shop.create({
    data: {
      id: 'shop-001',
      name: "Mama Njeri's Kitchen",
      description: 'Home-cooked meals delivered fresh',
      location: 'Westlands',
      phone: '+254700000006',
      category: 'Food & Grocery',
      isOpen: true,
      rating: 4.8,
      totalOrders: 23,
      vendorId: vendorUser.id,
    },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Pilau', price: 250, category: 'Food', shopId: shop.id },
      { name: 'Kachumbari', price: 100, category: 'Food', shopId: shop.id },
      { name: 'Ugali', price: 100, category: 'Food', shopId: shop.id },
      { name: 'Sukuma wiki', price: 120, category: 'Food', shopId: shop.id },
      { name: 'Beef stew', price: 300, category: 'Food', shopId: shop.id },
      { name: 'Soda', price: 80, category: 'Drinks', shopId: shop.id },
      { name: 'Unga Pembe 2kg', price: 200, category: 'Groceries', shopId: shop.id },
    ],
  });

  // 5. Rider Details
  await prisma.riderDetail.create({
    data: {
      id: riderUser.id,
      licenseNumber: 'LIC-001',
      plateNumber: 'KBZ 441Y',
      kycStatus: 'VERIFIED',
      rating: 4.9,
      isOnline: true,
      totalTrips: 156,
      todayEarnings: 1840,
    },
  });

  await prisma.riderDetail.create({
    data: {
      id: riderUser2.id,
      licenseNumber: 'LIC-002',
      plateNumber: 'KCA 223B',
      kycStatus: 'VERIFIED',
      rating: 4.8,
      isOnline: true,
      totalTrips: 98,
      todayEarnings: 1200,
    },
  });

  // 6. Orders
  const order1 = await prisma.order.create({
    data: {
      id: 'order-001',
      errandDescription: 'Grocery run — Tuskys: Unga Pembe 2kg x3, Cooking oil',
      status: 'IN_TRANSIT',
      paymentStatus: 'PAID',
      totalAmount: 680,
      customerId: customerUser.id,
      riderId: riderUser.id,
      zoneId: westlands.id,
      shopId: shop.id,
      vendorId: vendorUser.id,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: 'order-002',
      errandDescription: 'Pilau x2, Kachumbari, Soda — Mama Njeri\'s',
      status: 'ACCEPTED',
      paymentStatus: 'UNPAID',
      totalAmount: 680,
      customerId: customerUser.id,
      zoneId: westlands.id,
      shopId: shop.id,
      vendorId: vendorUser.id,
    },
  });

  // 7. Order Status Logs
  await prisma.orderStatus.createMany({
    data: [
      { orderId: order1.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order1.id, status: 'ACCEPTED', note: 'Vendor accepted the order' },
      { orderId: order1.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: order1.id, status: 'PICKED_UP', note: 'Items picked up from Mama Njeri\'s' },
      { orderId: order1.id, status: 'IN_TRANSIT', note: 'Rider en route to delivery' },
    ],
  });

  // 8. Rider Earning
  await prisma.riderEarning.create({
    data: {
      riderId: riderUser.id,
      orderId: order1.id,
      amount: 180,
    },
  });

  // 9. Settings
  await prisma.setting.upsert({
    where: { key: 'mpesa_till_number' },
    update: { value: '123456' },
    create: { key: 'mpesa_till_number', value: '123456' },
  });

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        title: 'Order In Transit',
        body: 'Peter M. has picked up your order and is on the way.',
        type: 'ORDER',
      },
      {
        userId: riderUser.id,
        title: 'New Job Available',
        body: 'Errand — KSh 180 — Tuskys Supermarket, Westlands',
        type: 'ORDER',
      },
      {
        userId: vendorUser.id,
        title: 'New Order Received',
        body: '#TK-2851 — Pilau x2, Kachumbari, Soda — KSh 680',
        type: 'ORDER',
      },
    ],
  });

  // 11. Enterprise Client (KaniniOS)
  const kanini = await prisma.enterpriseClient.create({
    data: {
      id: 'enterprise-001',
      name: 'Kanini Haraka Enterprises',
      apiKey: 'kan_os_live_4a7b9c2d1e3f',
      contact: '+254700000010',
      rate: 120,
      active: true,
      ownerId: admin.id,
    },
  });

  // 12. Enterprise Delivery (LaaS example)
  await prisma.enterpriseDelivery.create({
    data: {
      id: 'laas-del-001',
      reference: 'KHE-ORD-8921',
      pickup: 'Kanini Haraka Warehouse, Industrial Area',
      dropoff: 'Mama Mboga, Kangemi Market',
      description: '50kg Unga, 20L Cooking Oil, 10kg Sugar',
      status: 'ASSIGNED',
      slaMinutes: 90,
      clientId: kanini.id,
      riderId: riderUser2.id,
    },
  });

  console.log('✅ Baseline data seeded successfully!');
  console.log('   Admin: admin@taskit.co.ke / MunyagaMartin.12');
  console.log('   Customer: wanjiru@email.com / customer123');
  console.log('   Rider: peter.m@taskit.co.ke / rider123');
  console.log('   Vendor: mama.njeri@taskit.co.ke / vendor123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
