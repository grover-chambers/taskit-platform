import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Purging old data...');
  await prisma.supportMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.riderDocument.deleteMany();
  await prisma.riderLocation.deleteMany();
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

  const admin = await prisma.user.create({
    data: { id: 'admin-001', email: 'admin@taskit.co.ke', password: hash('MunyagaMartin.12'), name: 'TaskIt Owner', phone: '+254700000001', role: 'ADMIN' },
  });

  const vendorUser = await prisma.user.create({
    data: { id: 'vendor-001', email: 'mama.njeri@taskit.co.ke', password: hash('vendor123'), name: 'Mama Njeri', phone: '+254700000002', role: 'VENDOR' },
  });

  const riderUser = await prisma.user.create({
    data: { id: 'rider-001', email: 'peter.m@taskit.co.ke', password: hash('rider123'), name: 'Peter Mwangi', phone: '+254700000003', role: 'RIDER' },
  });

  const riderUser2 = await prisma.user.create({
    data: { id: 'rider-002', email: 'grace.k@taskit.co.ke', password: hash('rider123'), name: 'Grace Kamau', phone: '+254700000004', role: 'RIDER' },
  });

  const customerUser = await prisma.user.create({
    data: { id: 'customer-001', email: 'wanjiru@email.com', password: hash('customer123'), name: 'Wanjiru N.', phone: '+254700000005', role: 'CUSTOMER' },
  });

  const customerUser2 = await prisma.user.create({
    data: { id: 'customer-002', email: 'brian@email.com', password: hash('customer123'), name: 'Brian Otieno', phone: '+254700000006', role: 'CUSTOMER' },
  });

  const cbd = await prisma.zone.create({ data: { id: 'zone-cbd', name: 'Nairobi CBD', price: 150, active: true } });
  const westlands = await prisma.zone.create({ data: { id: 'zone-west', name: 'Westlands', price: 250, active: true } });
  const eastleigh = await prisma.zone.create({ data: { id: 'zone-east', name: 'Eastleigh', price: 300, active: true } });
  const ngara = await prisma.zone.create({ data: { id: 'zone-ngara', name: 'Ngara / Kamukunji', price: 300, active: true } });

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

  const shop = await prisma.shop.create({
    data: {
      id: 'shop-001', name: "Mama Njeri's Kitchen", description: 'Home-cooked meals delivered fresh',
      location: 'Westlands', phone: '+254700000006', category: 'Food & Grocery',
      isOpen: true, rating: 4.8, totalOrders: 23, vendorId: vendorUser.id,
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

  await prisma.riderDetail.create({
    data: {
      id: riderUser.id, licenseNumber: 'LIC-001', plateNumber: 'KBZ 441Y',
      kycStatus: 'VERIFIED', rating: 4.9, isOnline: true, totalTrips: 156, todayEarnings: 1840,
    },
  });

  await prisma.riderDetail.create({
    data: {
      id: riderUser2.id, licenseNumber: 'LIC-002', plateNumber: 'KCA 223B',
      kycStatus: 'VERIFIED', rating: 4.8, isOnline: true, totalTrips: 98, todayEarnings: 1200,
    },
  });

  const futureDate = (days: number) => new Date(Date.now() + days * 86400000);
  const pastDate = (days: number) => new Date(Date.now() - days * 86400000);

  await prisma.riderDocument.createMany({
    data: [
      { riderId: riderUser.id, docType: 'ID_FRONT', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=ID+Front', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(7), documentNumber: '29483716', createdAt: pastDate(8) },
      { riderId: riderUser.id, docType: 'ID_BACK', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=ID+Back', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(7), documentNumber: '29483716', createdAt: pastDate(8) },
      { riderId: riderUser.id, docType: 'DRIVING_LICENSE', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Driving+License', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(7), documentNumber: 'DL-8472-PW', expiryDate: futureDate(730), createdAt: pastDate(8) },
      { riderId: riderUser.id, docType: 'GOOD_CONDUCT', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Good+Conduct', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(7), documentNumber: 'GC-2024-91827', expiryDate: futureDate(365), createdAt: pastDate(8) },
      { riderId: riderUser.id, docType: 'PASSPORT_PHOTO', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Passport+Photo', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(7), createdAt: pastDate(8) },
      { riderId: riderUser2.id, docType: 'ID_FRONT', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=ID+Front', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(5), documentNumber: '31726584', createdAt: pastDate(6) },
      { riderId: riderUser2.id, docType: 'ID_BACK', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=ID+Back', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(5), documentNumber: '31726584', createdAt: pastDate(6) },
      { riderId: riderUser2.id, docType: 'DRIVING_LICENSE', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Driving+License', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(5), documentNumber: 'DL-5291-KM', expiryDate: futureDate(540), createdAt: pastDate(6) },
      { riderId: riderUser2.id, docType: 'GOOD_CONDUCT', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Good+Conduct', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(5), documentNumber: 'GC-2024-43281', expiryDate: futureDate(200), createdAt: pastDate(6) },
      { riderId: riderUser2.id, docType: 'PASSPORT_PHOTO', url: 'https://placehold.co/400x300/1a1a2e/d4a017?text=Passport+Photo', status: 'APPROVED', reviewedBy: admin.id, reviewedAt: pastDate(5), createdAt: pastDate(6) },
    ],
  });

  // Orders in various states for the full lifecycle demo
  // 1. Active: IN_TRANSIT (rider on the way)
  const order1 = await prisma.order.create({
    data: {
      id: 'order-001', errandDescription: 'Grocery run — Tuskys: Unga Pembe 2kg x3, Cooking oil',
      status: 'IN_TRANSIT', paymentStatus: 'PAID', totalAmount: 680,
      deliveryOtp: '4729',
      customerId: customerUser.id, riderId: riderUser.id, zoneId: westlands.id,
      shopId: shop.id, vendorId: vendorUser.id, assignedAt: new Date(Date.now() - 30 * 60000),
    },
  });

  // 2. Accepted + PAID: ready for admin to assign a rider
  const order2 = await prisma.order.create({
    data: {
      id: 'order-002', errandDescription: 'Pilau x2, Kachumbari, Soda — Mama Njeri\'s',
      status: 'ACCEPTED', paymentStatus: 'PAID', totalAmount: 680,
      customerId: customerUser.id, zoneId: westlands.id, shopId: shop.id, vendorId: vendorUser.id,
    },
  });

  // 3. RECEIVED + PAID: another order ready for dispatch
  const order3 = await prisma.order.create({
    data: {
      id: 'order-003', errandDescription: 'Pharmacy pickup — Night Nurse, Panadol, ORS',
      status: 'RECEIVED', paymentStatus: 'PAID', totalAmount: 350,
      customerId: customerUser2.id, zoneId: cbd.id,
    },
  });

  // 4. RECEIVED + UNPAID: awaiting payment
  const order4 = await prisma.order.create({
    data: {
      id: 'order-004', errandDescription: 'Document delivery — KRA PIN cert to I&M Tower 14F',
      status: 'RECEIVED', paymentStatus: 'UNPAID', totalAmount: 150,
      customerId: customerUser2.id, zoneId: cbd.id,
    },
  });

  // 5. ASSIGNED: rider heading to pickup
  const order5 = await prisma.order.create({
    data: {
      id: 'order-005', errandDescription: 'Parcel — Small box to Parklands Apt 4B',
      status: 'ASSIGNED', paymentStatus: 'PAID', totalAmount: 250,
      customerId: customerUser.id, riderId: riderUser2.id, zoneId: westlands.id, assignedAt: new Date(),
    },
  });

  // 6. DELIVERED: completed order
  const order6 = await prisma.order.create({
    data: {
      id: 'order-006', errandDescription: 'Grocery run — Naivas: Milk, Bread, Eggs',
      status: 'DELIVERED', paymentStatus: 'PAID', totalAmount: 450,
      deliveryOtp: '8316',
      customerId: customerUser.id, riderId: riderUser.id, zoneId: cbd.id, assignedAt: new Date(Date.now() - 3600000),
    },
  });

  // Status logs
  await prisma.orderStatus.createMany({
    data: [
      { orderId: order1.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order1.id, status: 'ACCEPTED', note: 'Vendor accepted the order' },
      { orderId: order1.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: order1.id, status: 'PICKED_UP', note: 'Items picked up from Mama Njeri\'s' },
      { orderId: order1.id, status: 'IN_TRANSIT', note: 'Rider en route. Delivery OTP: 4729' },
      { orderId: order2.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order2.id, status: 'ACCEPTED', note: 'Vendor accepted' },
      { orderId: order3.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order4.id, status: 'RECEIVED', note: 'Order placed — awaiting payment' },
      { orderId: order5.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order5.id, status: 'ACCEPTED', note: 'Accepted' },
      { orderId: order5.id, status: 'ASSIGNED', note: 'Rider Grace K. assigned' },
      { orderId: order6.id, status: 'RECEIVED', note: 'Order placed' },
      { orderId: order6.id, status: 'ACCEPTED', note: 'Accepted' },
      { orderId: order6.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: order6.id, status: 'PICKED_UP', note: 'Picked up' },
      { orderId: order6.id, status: 'IN_TRANSIT', note: 'On way' },
      { orderId: order6.id, status: 'DELIVERED', note: 'Delivered successfully' },
    ],
  });

  // Rider earnings
  await prisma.riderEarning.create({
    data: { riderId: riderUser.id, orderId: order1.id, amount: 180 },
  });
  await prisma.riderEarning.create({
    data: { riderId: riderUser.id, orderId: order6.id, amount: 105 },
  });

  // Rider locations (simulated Nairobi coordinates)
  await prisma.riderLocation.create({
    data: { riderId: riderUser.id, lat: -1.263, lng: 36.803, heading: 45, speedKmh: 25, accuracyM: 10, orderId: order1.id },
  });
  await prisma.riderLocation.create({
    data: { riderId: riderUser2.id, lat: -1.286389, lng: 36.817223, heading: 180, speedKmh: 0, accuracyM: 15, orderId: order5.id },
  });

  // Update rider details with current order
  await prisma.riderDetail.update({ where: { id: riderUser.id }, data: { currentOrderId: order1.id } });
  await prisma.riderDetail.update({ where: { id: riderUser2.id }, data: { currentOrderId: order5.id } });

  await prisma.setting.upsert({
    where: { key: 'mpesa_till_number' },
    update: { value: '123456' },
    create: { key: 'mpesa_till_number', value: '123456' },
  });

  await prisma.notification.createMany({
    data: [
      { userId: customerUser.id, title: 'Order In Transit', body: 'Peter M. has picked up your order and is on the way.', type: 'ORDER' },
      { userId: customerUser.id, title: 'Rider Assigned', body: 'Grace K. will deliver your parcel to Parklands.', type: 'ORDER' },
      { userId: riderUser.id, title: 'New Job Assigned', body: 'Errand — KSh 180 — Tuskys Supermarket, Westlands', type: 'ORDER' },
      { userId: vendorUser.id, title: 'New Order Received', body: '#ORDER-002 — Pilau x2, Kachumbari, Soda — KSh 680', type: 'ORDER' },
      { userId: admin.id, title: 'Dispatch Required', body: '2 paid orders waiting for rider assignment', type: 'SYSTEM' },
    ],
  });

  const kanini = await prisma.enterpriseClient.create({
    data: {
      id: 'enterprise-001', name: 'Kanini Haraka Enterprises', apiKey: 'kan_os_live_4a7b9c2d1e3f',
      contact: '+254700000010', rate: 120, active: true, ownerId: admin.id,
    },
  });

  await prisma.enterpriseDelivery.create({
    data: {
      id: 'laas-del-001', reference: 'KHE-ORD-8921',
      pickup: 'Kanini Haraka Warehouse, Industrial Area', dropoff: 'Mama Mboga, Kangemi Market',
      description: '50kg Unga, 20L Cooking Oil, 10kg Sugar',
      status: 'ASSIGNED', slaMinutes: 90, clientId: kanini.id, riderId: riderUser2.id,
    },
  });

  console.log('✅ Baseline data seeded successfully!');
  console.log('   Admin: admin@taskit.co.ke / MunyagaMartin.12');
  console.log('   Customer: wanjiru@email.com / customer123');
  console.log('   Customer 2: brian@email.com / customer123');
  console.log('   Rider: peter.m@taskit.co.ke / rider123');
  console.log('   Rider 2: grace.k@taskit.co.ke / rider123');
  console.log('   Vendor: mama.njeri@taskit.co.ke / vendor123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
