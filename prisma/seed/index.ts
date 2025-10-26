import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import * as argon from 'argon2';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1️⃣ Create Users
  const passwordHash = await argon.hash('password123');
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        password: passwordHash,
        fullName: 'Admin User',
        phoneNumber: '08123456789',
        role: UserRole.ADMIN,
        address: 'Jakarta, Indonesia',
      },
      {
        email: 'john@example.com',
        password: passwordHash,
        fullName: 'John Doe',
        phoneNumber: '08129876543',
        role: UserRole.USER,
        address: 'Bandung, Indonesia',
      },
      {
        email: 'seller@example.com',
        password: passwordHash,
        fullName: 'Seller One',
        role: UserRole.SELLER,
        address: 'Surabaya, Indonesia',
      },
    ],
  });

  console.log(`✅ Created ${users.count} users`);

  // 2️⃣ Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Laptop Lenovo ThinkPad',
        description: 'Powerful laptop for professionals',
        price: 15000000,
        stock: 10,
        category: 'Electronics',
      },
      {
        name: 'Mechanical Keyboard Keychron K6',
        description: 'Wireless mechanical keyboard with RGB',
        price: 1300000,
        stock: 20,
        category: 'Accessories',
      },
      {
        name: 'Wireless Mouse Logitech MX Master 3',
        description: 'Ergonomic mouse for productivity',
        price: 1500000,
        stock: 15,
        category: 'Accessories',
      },
    ],
  });

  console.log(`✅ Created ${products.count} products`);

  // 3️⃣ Create Order (for John Doe)
  const user = await prisma.user.findUnique({
    where: { email: 'john@example.com' },
  });

  if (user) {
    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        status: OrderStatus.PENDING,
        userId: user.id,
        totalAmount: 16500000,
        notes: 'Please deliver before weekend.',
        products: {
          create: [
            {
              product: { connect: { id: 1 } },
              quantity: 1,
              priceAtOrder: 15000000,
              subtotal: 15000000,
            },
            {
              product: { connect: { id: 2 } },
              quantity: 1,
              priceAtOrder: 1500000,
              subtotal: 1500000,
            },
          ],
        },
      },
    });

    console.log(`✅ Created order #${order.orderNumber}`);
  }

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
