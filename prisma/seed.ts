import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 6);
  const futureDate = (days: number) => new Date(Date.now() + days * 86400000);
  const pastDate = (days: number) => new Date(Date.now() - days * 86400000);

  console.log('🌱 Seeding baseline data (idempotent)...');

  // ── Users (upsert by id) ──
  const admin = await prisma.user.upsert({
    where: { id: 'admin-001' },
    update: { email: 'admin@taskit.co.ke', password: hash('MunyagaMartin.12'), name: 'TaskIt Owner', phone: '+254700000001', role: 'ADMIN' },
    create: { id: 'admin-001', email: 'admin@taskit.co.ke', password: hash('MunyagaMartin.12'), name: 'TaskIt Owner', phone: '+254700000001', role: 'ADMIN' },
  });

  const vendorUser = await prisma.user.upsert({
    where: { id: 'vendor-001' },
    update: { email: 'mama.njeri@taskit.co.ke', password: hash('vendor123'), name: 'Mama Njeri', phone: '+254700000002', role: 'VENDOR' },
    create: { id: 'vendor-001', email: 'mama.njeri@taskit.co.ke', password: hash('vendor123'), name: 'Mama Njeri', phone: '+254700000002', role: 'VENDOR' },
  });

  const kaniniBoss = await prisma.user.upsert({
    where: { id: 'vendor-002' },
    update: { email: 'kanini.boss@taskit.co.ke', password: hash('boss123'), name: 'Kanini Boss', phone: '+254700000010', role: 'VENDOR' },
    create: { id: 'vendor-002', email: 'kanini.boss@taskit.co.ke', password: hash('boss123'), name: 'Kanini Boss', phone: '+254700000010', role: 'VENDOR' },
  });

  const kaniniDesk = await prisma.user.upsert({
    where: { id: 'vendor-003' },
    update: { email: 'kanini.desk@taskit.co.ke', password: hash('desk123'), name: 'Kanini Operator', phone: '+254700000011', role: 'VENDOR' },
    create: { id: 'vendor-003', email: 'kanini.desk@taskit.co.ke', password: hash('desk123'), name: 'Kanini Operator', phone: '+254700000011', role: 'VENDOR' },
  });

  const riderUser = await prisma.user.upsert({
    where: { id: 'rider-001' },
    update: { email: 'peter.m@taskit.co.ke', password: hash('rider123'), name: 'Peter Mwangi', phone: '+254700000003', role: 'RIDER' },
    create: { id: 'rider-001', email: 'peter.m@taskit.co.ke', password: hash('rider123'), name: 'Peter Mwangi', phone: '+254700000003', role: 'RIDER' },
  });

  const riderUser2 = await prisma.user.upsert({
    where: { id: 'rider-002' },
    update: { email: 'grace.k@taskit.co.ke', password: hash('rider123'), name: 'Grace Kamau', phone: '+254700000004', role: 'RIDER' },
    create: { id: 'rider-002', email: 'grace.k@taskit.co.ke', password: hash('rider123'), name: 'Grace Kamau', phone: '+254700000004', role: 'RIDER' },
  });

  const customerUser = await prisma.user.upsert({
    where: { id: 'customer-001' },
    update: { email: 'wanjiru@email.com', password: hash('customer123'), name: 'Wanjiru N.', phone: '+254700000005', role: 'CUSTOMER' },
    create: { id: 'customer-001', email: 'wanjiru@email.com', password: hash('customer123'), name: 'Wanjiru N.', phone: '+254700000005', role: 'CUSTOMER' },
  });

  const customerUser2 = await prisma.user.upsert({
    where: { id: 'customer-002' },
    update: { email: 'brian@email.com', password: hash('customer123'), name: 'Brian Otieno', phone: '+254700000006', role: 'CUSTOMER' },
    create: { id: 'customer-002', email: 'brian@email.com', password: hash('customer123'), name: 'Brian Otieno', phone: '+254700000006', role: 'CUSTOMER' },
  });

  // ── Zones (upsert by id) ──
  const cbd = await prisma.zone.upsert({ where: { id: 'zone-cbd' }, update: { name: 'Nairobi CBD', price: 150, active: true }, create: { id: 'zone-cbd', name: 'Nairobi CBD', price: 150, active: true } });
  const westlands = await prisma.zone.upsert({ where: { id: 'zone-west' }, update: { name: 'Westlands', price: 250, active: true }, create: { id: 'zone-west', name: 'Westlands', price: 250, active: true } });
  const eastleigh = await prisma.zone.upsert({ where: { id: 'zone-east' }, update: { name: 'Eastleigh', price: 300, active: true }, create: { id: 'zone-east', name: 'Eastleigh', price: 300, active: true } });
  const ngara = await prisma.zone.upsert({ where: { id: 'zone-ngara' }, update: { name: 'Ngara / Kamukunji', price: 300, active: true }, create: { id: 'zone-ngara', name: 'Ngara / Kamukunji', price: 300, active: true } });

  const thikaTown = await prisma.zone.upsert({ where: { id: 'zone-thika-0' }, update: { name: 'Thika Town Core (0-2km)', price: 100, active: true }, create: { id: 'zone-thika-0', name: 'Thika Town Core (0-2km)', price: 100, active: true } });
  const thikaInner = await prisma.zone.upsert({ where: { id: 'zone-thika-1' }, update: { name: 'Inner Thika (2-5km)', price: 200, active: true }, create: { id: 'zone-thika-1', name: 'Inner Thika (2-5km)', price: 200, active: true } });
  const thikaOuter = await prisma.zone.upsert({ where: { id: 'zone-thika-2' }, update: { name: 'Outer Thika (5-10km)', price: 350, active: true }, create: { id: 'zone-thika-2', name: 'Outer Thika (5-10km)', price: 350, active: true } });
  const thikaRural = await prisma.zone.upsert({ where: { id: 'zone-thika-3' }, update: { name: 'Thika Rural/Bypass (10-18km)', price: 600, active: true }, create: { id: 'zone-thika-3', name: 'Thika Rural/Bypass (10-18km)', price: 600, active: true } });
  const thikaOut = await prisma.zone.upsert({ where: { id: 'zone-thika-4' }, update: { name: 'Out-of-Town (18-30km)', price: 1000, active: true }, create: { id: 'zone-thika-4', name: 'Out-of-Town (18-30km)', price: 1000, active: true } });

  // ── ErrandTypes (upsert by name) ──
  const errandNames = ['Shopping', 'Bills', 'Documents', 'Groceries', 'Pharmacy', 'Custom'] as const;
  const errandIcons = ['🛍️', '📄', '📁', '🥑', '💊', '✨'] as const;
  for (let i = 0; i < errandNames.length; i++) {
    await prisma.errandType.upsert({
      where: { name: errandNames[i] },
      update: { icon: errandIcons[i] },
      create: { name: errandNames[i], icon: errandIcons[i] },
    });
  }

  // ── Shop (upsert by id) ──
  const shop = await prisma.shop.upsert({
    where: { id: 'shop-001' },
    update: { name: "Mama Njeri's Kitchen", description: 'Home-cooked meals delivered fresh', location: 'Westlands', phone: '+254700000006', category: 'Food & Grocery', isOpen: true, rating: 4.8, totalOrders: 23, vendorId: vendorUser.id },
    create: { id: 'shop-001', name: "Mama Njeri's Kitchen", description: 'Home-cooked meals delivered fresh', location: 'Westlands', phone: '+254700000006', category: 'Food & Grocery', isOpen: true, rating: 4.8, totalOrders: 23, vendorId: vendorUser.id },
  });

  // ── Products (deleteMany by shopId + createMany) ──
  await prisma.product.deleteMany({ where: { shopId: shop.id } });
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

  // ── RiderDetail (upsert by id) ──
  await prisma.riderDetail.upsert({
    where: { id: riderUser.id },
    update: { licenseNumber: 'LIC-001', plateNumber: 'KBZ 441Y', kycStatus: 'VERIFIED', rating: 4.9, isOnline: true, totalTrips: 156, todayEarnings: 1840, earningsResetAt: new Date() },
    create: { id: riderUser.id, licenseNumber: 'LIC-001', plateNumber: 'KBZ 441Y', kycStatus: 'VERIFIED', rating: 4.9, isOnline: true, totalTrips: 156, todayEarnings: 1840, earningsResetAt: new Date() },
  });

  await prisma.riderDetail.upsert({
    where: { id: riderUser2.id },
    update: { licenseNumber: 'LIC-002', plateNumber: 'KCA 223B', kycStatus: 'VERIFIED', rating: 4.8, isOnline: true, totalTrips: 98, todayEarnings: 1200, earningsResetAt: new Date() },
    create: { id: riderUser2.id, licenseNumber: 'LIC-002', plateNumber: 'KCA 223B', kycStatus: 'VERIFIED', rating: 4.8, isOnline: true, totalTrips: 98, todayEarnings: 1200, earningsResetAt: new Date() },
  });

  // ── RiderDocuments (deleteMany + createMany) ──
  await prisma.riderDocument.deleteMany({ where: { riderId: { in: [riderUser.id, riderUser2.id] } } });
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

  // ── Orders (upsert by id) ──
  const order1 = await prisma.order.upsert({
    where: { id: 'order-001' },
    update: { errandDescription: 'Grocery run — Tuskys: Unga Pembe 2kg x3, Cooking oil', status: 'IN_TRANSIT', paymentStatus: 'PAID', totalAmount: 680, deliveryOtp: '4729', customerId: customerUser.id, riderId: riderUser.id, zoneId: westlands.id, shopId: shop.id, vendorId: vendorUser.id, assignedAt: new Date(Date.now() - 30 * 60000) },
    create: { id: 'order-001', errandDescription: 'Grocery run — Tuskys: Unga Pembe 2kg x3, Cooking oil', status: 'IN_TRANSIT', paymentStatus: 'PAID', totalAmount: 680, deliveryOtp: '4729', customerId: customerUser.id, riderId: riderUser.id, zoneId: westlands.id, shopId: shop.id, vendorId: vendorUser.id, assignedAt: new Date(Date.now() - 30 * 60000) },
  });

  const order2 = await prisma.order.upsert({
    where: { id: 'order-002' },
    update: { errandDescription: "Pilau x2, Kachumbari, Soda — Mama Njeri's", status: 'ACCEPTED', paymentStatus: 'PAID', totalAmount: 680, customerId: customerUser.id, zoneId: westlands.id, shopId: shop.id, vendorId: vendorUser.id },
    create: { id: 'order-002', errandDescription: "Pilau x2, Kachumbari, Soda — Mama Njeri's", status: 'ACCEPTED', paymentStatus: 'PAID', totalAmount: 680, customerId: customerUser.id, zoneId: westlands.id, shopId: shop.id, vendorId: vendorUser.id },
  });

  const order3 = await prisma.order.upsert({
    where: { id: 'order-003' },
    update: { errandDescription: 'Pharmacy pickup — Night Nurse, Panadol, ORS', status: 'RECEIVED', paymentStatus: 'PAID', totalAmount: 350, customerId: customerUser2.id, zoneId: cbd.id },
    create: { id: 'order-003', errandDescription: 'Pharmacy pickup — Night Nurse, Panadol, ORS', status: 'RECEIVED', paymentStatus: 'PAID', totalAmount: 350, customerId: customerUser2.id, zoneId: cbd.id },
  });

  const order4 = await prisma.order.upsert({
    where: { id: 'order-004' },
    update: { errandDescription: 'Document delivery — KRA PIN cert to I&M Tower 14F', status: 'RECEIVED', paymentStatus: 'UNPAID', totalAmount: 150, customerId: customerUser2.id, zoneId: cbd.id },
    create: { id: 'order-004', errandDescription: 'Document delivery — KRA PIN cert to I&M Tower 14F', status: 'RECEIVED', paymentStatus: 'UNPAID', totalAmount: 150, customerId: customerUser2.id, zoneId: cbd.id },
  });

  const order5 = await prisma.order.upsert({
    where: { id: 'order-005' },
    update: { errandDescription: 'Parcel — Small box to Parklands Apt 4B', status: 'ASSIGNED', paymentStatus: 'PAID', totalAmount: 250, customerId: customerUser.id, riderId: riderUser2.id, zoneId: westlands.id, assignedAt: new Date() },
    create: { id: 'order-005', errandDescription: 'Parcel — Small box to Parklands Apt 4B', status: 'ASSIGNED', paymentStatus: 'PAID', totalAmount: 250, customerId: customerUser.id, riderId: riderUser2.id, zoneId: westlands.id, assignedAt: new Date() },
  });

  const order6 = await prisma.order.upsert({
    where: { id: 'order-006' },
    update: { errandDescription: 'Grocery run — Naivas: Milk, Bread, Eggs', status: 'DELIVERED', paymentStatus: 'PAID', totalAmount: 450, deliveryOtp: '8316', customerId: customerUser.id, riderId: riderUser.id, zoneId: cbd.id, assignedAt: new Date(Date.now() - 3600000) },
    create: { id: 'order-006', errandDescription: 'Grocery run — Naivas: Milk, Bread, Eggs', status: 'DELIVERED', paymentStatus: 'PAID', totalAmount: 450, deliveryOtp: '8316', customerId: customerUser.id, riderId: riderUser.id, zoneId: cbd.id, assignedAt: new Date(Date.now() - 3600000) },
  });

  // ── OrderStatus (deleteMany for seed orders + createMany) ──
  const seedOrderIds = [order1.id, order2.id, order3.id, order4.id, order5.id, order6.id];
  await prisma.orderStatus.deleteMany({ where: { orderId: { in: seedOrderIds } } });
  await prisma.orderStatus.createMany({
    data: [
      { orderId: order1.id, status: 'RECEIVED', note: 'Order placed by customer' },
      { orderId: order1.id, status: 'ACCEPTED', note: 'Vendor accepted the order' },
      { orderId: order1.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: order1.id, status: 'PICKED_UP', note: "Items picked up from Mama Njeri's" },
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

  // ── Payouts (upsert by id) ──
  const payout1 = await prisma.payout.upsert({
    where: { id: 'payout-001' },
    update: { riderId: riderUser.id, amount: 105, status: 'PAID', method: 'MPESA', reference: 'RKT4A8B2C3', approvedBy: admin.id, approvedAt: pastDate(3), paidAt: pastDate(2) },
    create: { id: 'payout-001', riderId: riderUser.id, amount: 105, status: 'PAID', method: 'MPESA', reference: 'RKT4A8B2C3', approvedBy: admin.id, approvedAt: pastDate(3), paidAt: pastDate(2) },
  });
  const payout2 = await prisma.payout.upsert({
    where: { id: 'payout-002' },
    update: { riderId: riderUser.id, amount: 180, status: 'APPROVED', method: 'MPESA', approvedBy: admin.id, approvedAt: pastDate(1) },
    create: { id: 'payout-002', riderId: riderUser.id, amount: 180, status: 'APPROVED', method: 'MPESA', approvedBy: admin.id, approvedAt: pastDate(1) },
  });
  const payout3 = await prisma.payout.upsert({
    where: { id: 'payout-003' },
    update: { riderId: riderUser2.id, amount: 210, status: 'PENDING', method: 'MPESA' },
    create: { id: 'payout-003', riderId: riderUser2.id, amount: 210, status: 'PENDING', method: 'MPESA' },
  });

  // ── RiderEarnings (delete then recreate — unique on orderId) ──
  await prisma.riderEarning.deleteMany({ where: { orderId: { in: [order1.id, order6.id, order5.id] } } });
  await prisma.riderEarning.create({
    data: { riderId: riderUser.id, orderId: order1.id, amount: 180, payoutStatus: 'UNPAID', payoutId: payout2.id },
  });
  await prisma.riderEarning.create({
    data: { riderId: riderUser.id, orderId: order6.id, amount: 105, payoutStatus: 'PAID', payoutId: payout1.id },
  });
  await prisma.riderEarning.create({
    data: { riderId: riderUser2.id, orderId: order5.id, amount: 210, payoutStatus: 'UNPAID', payoutId: payout3.id },
  });

  // ── RiderLocation (upsert by riderId) ──
  await prisma.riderLocation.upsert({
    where: { riderId: riderUser.id },
    update: { lat: -1.263, lng: 36.803, heading: 45, speedKmh: 25, accuracyM: 10, orderId: order1.id },
    create: { riderId: riderUser.id, lat: -1.263, lng: 36.803, heading: 45, speedKmh: 25, accuracyM: 10, orderId: order1.id },
  });
  await prisma.riderLocation.upsert({
    where: { riderId: riderUser2.id },
    update: { lat: -1.286389, lng: 36.817223, heading: 180, speedKmh: 0, accuracyM: 15, orderId: order5.id },
    create: { riderId: riderUser2.id, lat: -1.286389, lng: 36.817223, heading: 180, speedKmh: 0, accuracyM: 15, orderId: order5.id },
  });

  // ── Update rider details with current order ──
  await prisma.riderDetail.update({ where: { id: riderUser.id }, data: { currentOrderId: order1.id } });
  await prisma.riderDetail.update({ where: { id: riderUser2.id }, data: { currentOrderId: order5.id } });

  // ── Settings (already upsert) ──
  await prisma.setting.upsert({
    where: { key: 'mpesa_till_number' },
    update: { value: '123456' },
    create: { key: 'mpesa_till_number', value: '123456' },
  });

  // ── Notifications (deleteMany + createMany) ──
  await prisma.notification.deleteMany({ where: { userId: { in: [customerUser.id, riderUser.id, vendorUser.id, kaniniBoss.id] } } });
  await prisma.notification.createMany({
    data: [
      { userId: customerUser.id, title: 'Order In Transit', body: 'Peter M. has picked up your order and is on the way.', type: 'ORDER' },
      { userId: customerUser.id, title: 'Rider Assigned', body: 'Grace K. will deliver your parcel to Parklands.', type: 'ORDER' },
      { userId: riderUser.id, title: 'New Job Assigned', body: 'Errand — KSh 180 — Tuskys Supermarket, Westlands', type: 'ORDER' },
      { userId: vendorUser.id, title: 'New Order Received', body: '#ORDER-002 — Pilau x2, Kachumbari, Soda — KSh 680', type: 'ORDER' },
      { userId: kaniniBoss.id, title: 'New Enterprise Order', body: 'Office supplies order auto-accepted — KSh 120', type: 'ORDER' },
      { userId: kaniniBoss.id, title: 'Delivery In Transit', body: '50kg Unga delivery to Kangemi — OTP: 5531', type: 'ORDER' },
      { userId: kaniniBoss.id, title: 'Invoice Generated', body: 'KSh 240 invoice for 2 deliveries this month', type: 'PAYMENT' },
      { userId: admin.id, title: 'Dispatch Required', body: '2 paid orders waiting for rider assignment', type: 'SYSTEM' },
    ],
  });

  // ── EnterpriseClient (upsert by id) ──
  const kanini = await prisma.enterpriseClient.upsert({
    where: { id: 'enterprise-001' },
    update: { name: 'Kanini Haraka Enterprises', apiKey: 'kan_os_live_4a7b9c2d1e3f', contact: '+254700000010', rate: 120, active: true, ownerId: kaniniBoss.id },
    create: { id: 'enterprise-001', name: 'Kanini Haraka Enterprises', apiKey: 'kan_os_live_4a7b9c2d1e3f', contact: '+254700000010', rate: 120, active: true, ownerId: kaniniBoss.id },
  });

  // ── EnterpriseUser (upsert by userId+enterpriseClientId) ──
  await prisma.enterpriseUser.upsert({
    where: { userId_enterpriseClientId: { userId: kaniniBoss.id, enterpriseClientId: kanini.id } },
    update: { role: 'OWNER', active: true },
    create: { userId: kaniniBoss.id, enterpriseClientId: kanini.id, role: 'OWNER', active: true },
  });
  await prisma.enterpriseUser.upsert({
    where: { userId_enterpriseClientId: { userId: kaniniDesk.id, enterpriseClientId: kanini.id } },
    update: { role: 'OPERATOR', active: true },
    create: { userId: kaniniDesk.id, enterpriseClientId: kanini.id, role: 'OPERATOR', active: true },
  });

  // ── Enterprise orders (upsert by id) ──
  const entOrder1 = await prisma.order.upsert({
    where: { id: 'ent-order-001' },
    update: { errandDescription: '50kg Unga, 20L Cooking Oil — Kangemi Market', status: 'IN_TRANSIT', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 300, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'Mama Mboga, Kangemi Market', contactPhone: '+254700000010', zoneId: thikaOuter.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser.id, assignedAt: new Date(), deliveryOtp: '5531', weightKg: 70, weightSurcharge: 500 },
    create: { id: 'ent-order-001', errandDescription: '50kg Unga, 20L Cooking Oil — Kangemi Market', status: 'IN_TRANSIT', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 300, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'Mama Mboga, Kangemi Market', contactPhone: '+254700000010', zoneId: thikaOuter.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser.id, assignedAt: new Date(), deliveryOtp: '5531', weightKg: 70, weightSurcharge: 500 },
  });

  const entOrder2 = await prisma.order.upsert({
    where: { id: 'ent-order-002' },
    update: { errandDescription: 'Office supplies — A4 Paper x5, Toner Cartridge', status: 'ACCEPTED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 200, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'I&M Tower 14F', contactPhone: '+254700000010', zoneId: thikaInner.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, weightKg: 15, weightSurcharge: 100 },
    create: { id: 'ent-order-002', errandDescription: 'Office supplies — A4 Paper x5, Toner Cartridge', status: 'ACCEPTED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 200, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'I&M Tower 14F', contactPhone: '+254700000010', zoneId: thikaInner.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, weightKg: 15, weightSurcharge: 100 },
  });

  const entOrder3 = await prisma.order.upsert({
    where: { id: 'ent-order-003' },
    update: { errandDescription: 'Restaurant supplies — Chef knives set, Cutting boards', status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 350, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'The Carnivore, Langata', contactPhone: '+254700000010', zoneId: thikaTown.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser.id, assignedAt: pastDate(2), createdAt: pastDate(2), weightKg: 3, weightSurcharge: 0 },
    create: { id: 'ent-order-003', errandDescription: 'Restaurant supplies — Chef knives set, Cutting boards', status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 350, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'The Carnivore, Langata', contactPhone: '+254700000010', zoneId: thikaTown.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser.id, assignedAt: pastDate(2), createdAt: pastDate(2), weightKg: 3, weightSurcharge: 0 },
  });

  const entOrder4 = await prisma.order.upsert({
    where: { id: 'ent-order-004' },
    update: { errandDescription: 'Medical supplies — Gloves x10 boxes, Sanitizer', status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 400, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Kenyatta Hospital Pharmacy', contactPhone: '+254700000010', zoneId: thikaRural.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser2.id, assignedAt: pastDate(8), createdAt: pastDate(8), weightKg: 35, weightSurcharge: 250 },
    create: { id: 'ent-order-004', errandDescription: 'Medical supplies — Gloves x10 boxes, Sanitizer', status: 'DELIVERED', paymentStatus: 'PAID', paymentMethod: 'INVOICE', totalAmount: 400, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Kenyatta Hospital Pharmacy', contactPhone: '+254700000010', zoneId: thikaRural.id, vendorId: kaniniBoss.id, enterpriseClientId: kanini.id, customerId: kaniniBoss.id, riderId: riderUser2.id, assignedAt: pastDate(8), createdAt: pastDate(8), weightKg: 35, weightSurcharge: 250 },
  });

  // Enterprise order status logs
  const entOrderIds = [entOrder1.id, entOrder2.id, entOrder3.id, entOrder4.id];
  await prisma.orderStatus.deleteMany({ where: { orderId: { in: entOrderIds } } });
  await prisma.orderStatus.createMany({
    data: [
      { orderId: entOrder1.id, status: 'RECEIVED', note: 'Enterprise order placed' },
      { orderId: entOrder1.id, status: 'ACCEPTED', note: 'Enterprise order — auto-accepted' },
      { orderId: entOrder1.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: entOrder1.id, status: 'PICKED_UP', note: 'Picked up from warehouse' },
      { orderId: entOrder1.id, status: 'IN_TRANSIT', note: 'En route to Kangemi' },
      { orderId: entOrder2.id, status: 'RECEIVED', note: 'Enterprise order placed' },
      { orderId: entOrder2.id, status: 'ACCEPTED', note: 'Enterprise order — auto-accepted' },
      { orderId: entOrder3.id, status: 'RECEIVED', note: 'Enterprise order placed' },
      { orderId: entOrder3.id, status: 'ACCEPTED', note: 'Enterprise order — auto-accepted' },
      { orderId: entOrder3.id, status: 'ASSIGNED', note: 'Rider Peter M. assigned' },
      { orderId: entOrder3.id, status: 'DELIVERED', note: 'Delivered to The Carnivore' },
      { orderId: entOrder4.id, status: 'RECEIVED', note: 'Enterprise order placed' },
      { orderId: entOrder4.id, status: 'ACCEPTED', note: 'Enterprise order — auto-accepted' },
      { orderId: entOrder4.id, status: 'DELIVERED', note: 'Delivered to Kenyatta Hospital' },
    ],
  });

  // ── EnterpriseDelivery (upsert by id) ──
  await prisma.enterpriseDelivery.upsert({
    where: { id: 'laas-del-001' },
    update: { reference: 'KHE-ORD-8921', pickup: 'Kanini Haraka Warehouse, Industrial Area', dropoff: 'Mama Mboga, Kangemi Market', description: '50kg Unga, 20L Cooking Oil, 10kg Sugar', status: 'ASSIGNED', slaMinutes: 90, clientId: kanini.id, riderId: riderUser2.id, orderId: entOrder1.id },
    create: { id: 'laas-del-001', reference: 'KHE-ORD-8921', pickup: 'Kanini Haraka Warehouse, Industrial Area', dropoff: 'Mama Mboga, Kangemi Market', description: '50kg Unga, 20L Cooking Oil, 10kg Sugar', status: 'ASSIGNED', slaMinutes: 90, clientId: kanini.id, riderId: riderUser2.id, orderId: entOrder1.id },
  });

  // ── More enterprise orders (upsert by id) ──
  const entOrder5 = await prisma.order.upsert({
    where: { id: 'ent-order-005' },
    update: { errandDescription: 'Fresh produce — Tomatoes 20kg, Onions 10kg, Potatoes 50kg', status: 'PRICED', paymentStatus: 'UNPAID', paymentMethod: 'PENDING', totalAmount: 600, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'Greenhouse Restaurant, Kilimani', contactPhone: '+254700000011', zoneId: thikaRural.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 80, weightSurcharge: 500 },
    create: { id: 'ent-order-005', errandDescription: 'Fresh produce — Tomatoes 20kg, Onions 10kg, Potatoes 50kg', status: 'PRICED', paymentStatus: 'UNPAID', paymentMethod: 'PENDING', totalAmount: 600, pickupLocation: 'Kanini Haraka Warehouse, Industrial Area', dropoffLocation: 'Greenhouse Restaurant, Kilimani', contactPhone: '+254700000011', zoneId: thikaRural.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 80, weightSurcharge: 500 },
  });

  const entOrder6 = await prisma.order.upsert({
    where: { id: 'ent-order-006' },
    update: { errandDescription: 'Electronics — 2x Power Banks, Phone Chargers x10', status: 'PAID', paymentStatus: 'PAID', paymentMethod: 'MANUAL', totalAmount: 100, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Tech Hub, Ngong Road', contactPhone: '+254700000011', zoneId: thikaTown.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 4, weightSurcharge: 0 },
    create: { id: 'ent-order-006', errandDescription: 'Electronics — 2x Power Banks, Phone Chargers x10', status: 'PAID', paymentStatus: 'PAID', paymentMethod: 'MANUAL', totalAmount: 100, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Tech Hub, Ngong Road', contactPhone: '+254700000011', zoneId: thikaTown.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 4, weightSurcharge: 0 },
  });

  const entOrder7 = await prisma.order.upsert({
    where: { id: 'ent-order-007' },
    update: { errandDescription: 'Catering supplies — Chafing dishes x4, Serving spoons', status: 'PACKED', paymentStatus: 'PAID', paymentMethod: 'MPESA', mpesaReceipt: 'QKR3L7M9X2', totalAmount: 350, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Safari Park Hotel, Thika Road', contactPhone: '+254700000011', zoneId: thikaOuter.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 25, weightSurcharge: 250 },
    create: { id: 'ent-order-007', errandDescription: 'Catering supplies — Chafing dishes x4, Serving spoons', status: 'PACKED', paymentStatus: 'PAID', paymentMethod: 'MPESA', mpesaReceipt: 'QKR3L7M9X2', totalAmount: 350, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'Safari Park Hotel, Thika Road', contactPhone: '+254700000011', zoneId: thikaOuter.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 25, weightSurcharge: 250 },
  });

  const entOrder8 = await prisma.order.upsert({
    where: { id: 'ent-order-008' },
    update: { errandDescription: 'Stationery — Printing paper x20 reams, Staplers x5', status: 'AWAITING_RIDER', paymentStatus: 'PAID', paymentMethod: 'MANUAL', totalAmount: 300, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'UAP Tower, Upper Hill', contactPhone: '+254700000011', zoneId: thikaInner.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 12, weightSurcharge: 100 },
    create: { id: 'ent-order-008', errandDescription: 'Stationery — Printing paper x20 reams, Staplers x5', status: 'AWAITING_RIDER', paymentStatus: 'PAID', paymentMethod: 'MANUAL', totalAmount: 300, pickupLocation: 'Kanini Haraka Warehouse', dropoffLocation: 'UAP Tower, Upper Hill', contactPhone: '+254700000011', zoneId: thikaInner.id, vendorId: kaniniDesk.id, enterpriseClientId: kanini.id, customerId: kaniniDesk.id, weightKg: 12, weightSurcharge: 100 },
  });

  // More enterprise order status logs
  const laterEntOrderIds = [entOrder5.id, entOrder6.id, entOrder7.id, entOrder8.id];
  await prisma.orderStatus.deleteMany({ where: { orderId: { in: laterEntOrderIds } } });
  await prisma.orderStatus.createMany({
    data: [
      { orderId: entOrder5.id, status: 'PRICED', note: 'Order created by operator — awaiting payment' },
      { orderId: entOrder6.id, status: 'PRICED', note: 'Order created by operator' },
      { orderId: entOrder6.id, status: 'PAID', note: 'Payment confirmed manually at counter' },
      { orderId: entOrder7.id, status: 'PRICED', note: 'Order created by operator' },
      { orderId: entOrder7.id, status: 'PAID', note: 'M-Pesa payment confirmed — Receipt: QKR3L7M9X2' },
      { orderId: entOrder7.id, status: 'PACKED', note: 'Items packed and ready for dispatch' },
      { orderId: entOrder8.id, status: 'PRICED', note: 'Order created by operator' },
      { orderId: entOrder8.id, status: 'PAID', note: 'Payment confirmed manually at counter' },
      { orderId: entOrder8.id, status: 'PACKED', note: 'Items packed and ready' },
      { orderId: entOrder8.id, status: 'AWAITING_RIDER', note: 'Sent to rider queue — awaiting dispatch' },
    ],
  });

  // ── AuditLogs (deleteMany + createMany) ──
  await prisma.auditLog.deleteMany({ where: { enterpriseClientId: kanini.id } });
  await prisma.auditLog.createMany({
    data: [
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CREATE_ORDER', entityType: 'ORDER', entityId: entOrder5.id, details: 'Created order KSh 250 — Fresh produce — Tomatoes 20kg...' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CREATE_ORDER', entityType: 'ORDER', entityId: entOrder6.id, details: 'Created order KSh 120 — Electronics — 2x Power Banks...' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CONFIRM_PAYMENT', entityType: 'ORDER', entityId: entOrder6.id, details: 'Payment confirmed via MANUAL' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CREATE_ORDER', entityType: 'ORDER', entityId: entOrder7.id, details: 'Created order KSh 300 — Catering supplies...' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CONFIRM_PAYMENT', entityType: 'ORDER', entityId: entOrder7.id, details: 'Payment confirmed via MPESA — QKR3L7M9X2' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'MARK_PACKED', entityType: 'ORDER', entityId: entOrder7.id, details: 'Marked as packed' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CREATE_ORDER', entityType: 'ORDER', entityId: entOrder8.id, details: 'Created order KSh 250 — Stationery...' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'CONFIRM_PAYMENT', entityType: 'ORDER', entityId: entOrder8.id, details: 'Payment confirmed via MANUAL' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'MARK_PACKED', entityType: 'ORDER', entityId: entOrder8.id, details: 'Marked as packed' },
      { enterpriseClientId: kanini.id, userId: kaniniDesk.id, action: 'AWAIT_RIDER', entityType: 'ORDER', entityId: entOrder8.id, details: 'Sent to rider queue' },
    ],
  });

  console.log('✅ Baseline data seeded successfully!');
  console.log('   Admin: admin@taskit.co.ke / MunyagaMartin.12');
  console.log('   Customer: wanjiru@email.com / customer123');
  console.log('   Customer 2: brian@email.com / customer123');
  console.log('   Rider: peter.m@taskit.co.ke / rider123');
  console.log('   Rider 2: grace.k@taskit.co.ke / rider123');
  console.log('   Vendor: mama.njeri@taskit.co.ke / vendor123');
  console.log('   Mtaago Boss: kanini.boss@taskit.co.ke / boss123');
  console.log('   Mtaago Operator: kanini.desk@taskit.co.ke / desk123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
