// prisma/seed/index.ts
import { PrismaClient, OrderStatus } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning database (orders -> products -> categories -> users)...');

  // Hapus dalam urutan yang aman (orders terlebih dahulu)
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding database...');

  // Hash password sekali
  const passwordHash = await argon.hash('password123');

  // 1) Users
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash,
      fullName: 'Admin User',
      phoneNumber: '+6281234567890',
      address: 'Jakarta, Indonesia',
    },
  });

 

 

  console.log('✅ Created users:', [user.email].join(', '));

  // 2) Categories
  const computersCat = await prisma.category.create({
    data: { name: 'Computers' },
  });
  const accessoriesCat = await prisma.category.create({
    data: { name: 'Accessories' },
  });
  const peripheralsCat = await prisma.category.create({
    data: { name: 'Peripherals' },
  });

  console.log('✅ Created categories:', [computersCat.name, accessoriesCat.name, peripheralsCat.name].join(', '));

  // 3) Products (assign categoryId)
  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop Lenovo ThinkPad',
      description: 'Powerful laptop for professionals',
      price: 15000000,
      stock: 10,
      categoryId: computersCat.id,
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: 'Mechanical Keyboard Keychron K6',
      description: 'Wireless mechanical keyboard with RGB',
      price: 1300000,
      stock: 20,
      categoryId: accessoriesCat.id,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: 'Wireless Mouse Logitech MX Master 3',
      description: 'Ergonomic mouse for productivity',
      price: 1500000,
      stock: 15,
      categoryId: peripheralsCat.id,
    },
  });

  console.log('✅ Created products:', [laptop.name, keyboard.name, mouse.name].join(', '));

  // 4) Orders (userId & productId must exist)
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      productId: laptop.id,
      quantity: 1,
      totalAmount: laptop.price * 1,
      status: OrderStatus.PENDING,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      productId: keyboard.id,
      quantity: 2,
      totalAmount: keyboard.price * 2,
      status: OrderStatus.COMPLETED,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: user.id,
      productId: mouse.id,
      quantity: 1,
      totalAmount: mouse.price * 1,
      status: OrderStatus.PENDING,
    },
  });

  console.log('✅ Created orders:', [order1.id, order2.id, order3.id].join(', '));
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
