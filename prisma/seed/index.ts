// prisma/seed/index.ts
import { PrismaClient, OrderStatus } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log(
    '🔄 Cleaning database (orders -> products -> categories -> users)...',
  );

  // Hapus dalam urutan yang aman (orders terlebih dahulu)
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.merchant.deleteMany();

  console.log('🌱 Seeding database...');

  // Hash password sekali
  const passwordHash = await argon.hash('password123');

  // 1) Users
  const merchant = await prisma.merchant.create({
    data: {
      email: 'merchant@example.com',
      password: passwordHash,
      fullName: 'Barista',
      phoneNumber: '+6281234567890',
      address: 'Jakarta, Indonesia',
    },
  });

  console.log('✅ Created users:', [merchant.email].join(', '));

  // 2) Categories
  const coffeeCat = await prisma.category.create({
    data: { name: 'Americano' },
  });
  const coffeeCat2 = await prisma.category.create({
    data: { name: 'Expresso' },
  });
  const coffeeCat3 = await prisma.category.create({
    data: { name: 'Latte' },
  });

  console.log(
    '✅ Created categories:',
    [coffeeCat.name, coffeeCat2.name, coffeeCat3.name].join(', '),
  );

  // 3) Products (assign categoryId)
  const coffee1 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Americano Coffee',
      description: 'Americano coffee with milk',
      price: 15000000,
      stock: 10,
      categoryId: coffeeCat.id,
    },
  });

  const coffee2 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Expresso Coffee',
      description: 'Expresso coffee with milk',
      price: 1300000,
      stock: 20,
      categoryId: coffeeCat2.id,
    },
  });

  const coffee3 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Latte Coffee',
      description: 'Latte coffee with milk',
      price: 1500000,
      stock: 15,
      categoryId: coffeeCat3.id,
    },
  });

  console.log(
    '✅ Created products:',
    [coffee1.name, coffee2.name, coffee3.name].join(', '),
  );

  // 4) Orders (userId & productId must exist)
  const order1 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: coffee1.id,
      quantity: 1,
      totalAmount: coffee1.price * 1,
      status: OrderStatus.PENDING,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: coffee2.id,
      quantity: 2,
      totalAmount: coffee2.price * 2,
      status: OrderStatus.COMPLETED,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: coffee3.id,
      quantity: 1,
      totalAmount: coffee3.price * 1,
      status: OrderStatus.PENDING,
    },
  });

  console.log(
    '✅ Created orders:',
    [order1.id, order2.id, order3.id].join(', '),
  );
  console.log('🌿 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
