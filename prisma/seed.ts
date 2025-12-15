import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin created (username: admin, password: admin123)');

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      description: 'Flagship smartphone với chip A17 Pro',
      price: 29990000,
      image: 'https://images.unsplash.com/photo-1696446700544-06ed58d4fcbb?w=400',
      category: 'Điện thoại',
      stock: 50,
    },
    {
      name: 'MacBook Pro M3',
      description: 'Laptop cao cấp cho developer',
      price: 52990000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      category: 'Laptop',
      stock: 30,
    },
    {
      name: 'AirPods Pro 2',
      description: 'Tai nghe chống ồn, USB-C',
      price: 6490000,
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
      category: 'Phụ kiện',
      stock: 100,
    },
    {
      name: 'iPad Air M2',
      description: 'Tablet mạnh mẽ với Apple Pencil',
      price: 16990000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      category: 'Tablet',
      stock: 40,
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Smartwatch với health tracking',
      price: 10990000,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400',
      category: 'Phụ kiện',
      stock: 60,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ Created ${products.length} products`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });