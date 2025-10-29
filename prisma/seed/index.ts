// prisma/seed/index.ts
import { PrismaClient, OrderStatus } from '@prisma/client';
import  argon from 'argon2';

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
    data: { name: 'Makanan' },
  });
  const coffeeCat2 = await prisma.category.create({
    data: { name: 'Minuman' },
  });
  const coffeeCat3 = await prisma.category.create({
    data: { name: 'Kopi' },
  });

  console.log(
    '✅ Created categories:',
    [coffeeCat.name, coffeeCat2.name, coffeeCat3.name].join(', '),
  );

  // 3) Products (assign categoryId)
  const product1 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Americano Coffee',
      description: 'Americano coffee with milk',
      price: 15000000,
      stock: 10,
      categoryId: coffeeCat3.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Chitato',
      description: 'Chitato snack with cheese',
      price: 1300000,
      stock: 20,
      categoryId: coffeeCat.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Ice Matcha',
      description: 'Ice Matcha with milk',
      price: 1500000,
      stock: 15,
      categoryId: coffeeCat2.id,
    },
  });

  console.log(
    '✅ Created products:',
    [product1.name, product2.name, product3.name].join(', '),
  );

  // 4) Orders (userId & productId must exist)
  const order1 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: product1.id,
      quantity: 1,
      totalAmount: product1.price * 1,
      status: OrderStatus.PENDING,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: product2.id,
      quantity: 2,
      totalAmount: product2.price * 2,
      status: OrderStatus.COMPLETED,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      merchantId: merchant.id,
      productId: product3.id,
      quantity: 1,
      totalAmount: product3.price * 1,
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
