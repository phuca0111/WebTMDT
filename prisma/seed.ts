import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  // ===== ĐIỆN THOẠI (15 sản phẩm) =====
  {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Flagship Apple với chip A17 Pro, camera 48MP, titanium design',
    price: 34990000,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    category: 'Điện thoại',
    brand: 'Apple',
    stock: 50,
  },
  {
    name: 'iPhone 15 Pro 128GB',
    description: 'Chip A17 Pro, Dynamic Island, camera chuyên nghiệp',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
    category: 'Điện thoại',
    brand: 'Apple',
    stock: 45,
  },
  {
    name: 'iPhone 15 128GB',
    description: 'Dynamic Island, camera 48MP, USB-C',
    price: 22990000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    category: 'Điện thoại',
    brand: 'Apple',
    stock: 60,
  },
  {
    name: 'iPhone 14 128GB',
    description: 'Chip A15 Bionic, camera kép 12MP, màn Super Retina XDR',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400',
    category: 'Điện thoại',
    brand: 'Apple',
    stock: 40,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Snapdragon 8 Gen 3, camera 200MP, S-Pen tích hợp',
    price: 33990000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    category: 'Điện thoại',
    brand: 'Samsung',
    stock: 35,
  },
  {
    name: 'Samsung Galaxy S24+',
    description: 'Màn hình 6.7" QHD+, Galaxy AI, camera 50MP',
    price: 25990000,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
    category: 'Điện thoại',
    brand: 'Samsung',
    stock: 40,
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Compact flagship, Snapdragon 8 Gen 3, 128GB',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400',
    category: 'Điện thoại',
    brand: 'Samsung',
    stock: 55,
  },
  {
    name: 'Samsung Galaxy Z Fold 5',
    description: 'Điện thoại gập cao cấp, màn hình 7.6" mở rộng',
    price: 41990000,
    image: 'https://images.unsplash.com/photo-1628815113969-0487917f72b4?w=400',
    category: 'Điện thoại',
    brand: 'Samsung',
    stock: 20,
  },
  {
    name: 'Samsung Galaxy Z Flip 5',
    description: 'Điện thoại gập thời trang, Flex Window lớn hơn',
    price: 25990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    category: 'Điện thoại',
    brand: 'Samsung',
    stock: 30,
  },
  {
    name: 'OPPO Find X7 Ultra',
    description: 'Camera Hasselblad, Snapdragon 8 Gen 3',
    price: 24990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    category: 'Điện thoại',
    brand: 'Oppo',
    stock: 25,
  },
  {
    name: 'Xiaomi 14 Ultra',
    description: 'Camera Leica, chip Snapdragon 8 Gen 3',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400',
    category: 'Điện thoại',
    brand: 'Xiaomi',
    stock: 30,
  },
  {
    name: 'Xiaomi 14',
    description: 'Leica optics, 50MP camera, sạc nhanh 90W',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
    category: 'Điện thoại',
    brand: 'Xiaomi',
    stock: 45,
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'AI-powered camera, Tensor G3, 7 năm update',
    price: 26990000,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
    category: 'Điện thoại',
    brand: 'Google',
    stock: 20,
  },
  {
    name: 'OnePlus 12',
    description: 'Snapdragon 8 Gen 3, sạc 100W, camera Hasselblad',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
    category: 'Điện thoại',
    brand: 'OnePlus',
    stock: 35,
  },
  {
    name: 'Realme GT 5 Pro',
    description: 'Snapdragon 8 Gen 3, sạc 100W, gaming phone',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400',
    category: 'Điện thoại',
    brand: 'Realme',
    stock: 50,
  },

  // ===== LAPTOP (15 sản phẩm) =====
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Chip M3 Pro, 18GB RAM, 512GB SSD, màn Liquid Retina XDR',
    price: 52990000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Laptop',
    brand: 'Apple',
    stock: 25,
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Chip M3 Max, 36GB RAM, 1TB SSD, hiệu năng cực đại',
    price: 89990000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    category: 'Laptop',
    brand: 'Apple',
    stock: 15,
  },
  {
    name: 'MacBook Air 15" M3',
    description: 'Chip M3, 8GB RAM, 256GB SSD, màn hình lớn siêu mỏng',
    price: 37990000,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
    category: 'Laptop',
    brand: 'Apple',
    stock: 40,
  },
  {
    name: 'MacBook Air 13" M3',
    description: 'Chip M3, 8GB RAM, 256GB SSD, thiết kế siêu nhẹ',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    category: 'Laptop',
    brand: 'Apple',
    stock: 55,
  },
  {
    name: 'Dell XPS 15 9530',
    description: 'Intel Core i7-13700H, RTX 4060, 16GB RAM, OLED 3.5K',
    price: 45990000,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    category: 'Laptop',
    brand: 'Dell',
    stock: 20,
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Intel Core i7, 16GB RAM, 512GB SSD, thiết kế tối giản',
    price: 38990000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    category: 'Laptop',
    brand: 'Dell',
    stock: 25,
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9, RTX 4090, 32GB RAM, gaming mạnh mẽ',
    price: 55990000,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    category: 'Laptop',
    brand: 'Asus',
    stock: 15,
  },
  {
    name: 'ASUS ROG Strix G16',
    description: 'Intel i9-13980HX, RTX 4070, 16GB RAM, gaming laptop',
    price: 42990000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    category: 'Laptop',
    brand: 'Asus',
    stock: 20,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    description: 'Intel Core i7, 16GB RAM, doanh nhân cao cấp',
    price: 42990000,
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
    category: 'Laptop',
    brand: 'Lenovo',
    stock: 18,
  },
  {
    name: 'Lenovo Legion Pro 5',
    description: 'AMD Ryzen 7, RTX 4060, 16GB RAM, gaming hiệu năng cao',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400',
    category: 'Laptop',
    brand: 'Lenovo',
    stock: 22,
  },
  {
    name: 'HP Spectre x360 14',
    description: '2-in-1 laptop, Intel i7, OLED 3K, bút stylus',
    price: 38990000,
    image: 'https://images.unsplash.com/photo-1544099858-75feeb57f01b?w=400',
    category: 'Laptop',
    brand: 'HP',
    stock: 15,
  },
  {
    name: 'HP Envy 16',
    description: 'Intel i7-13700H, RTX 4050, 16GB RAM, sáng tạo nội dung',
    price: 32990000,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    category: 'Laptop',
    brand: 'HP',
    stock: 25,
  },
  {
    name: 'Acer Swift X 14',
    description: 'AMD Ryzen 7, RTX 4050, 16GB RAM, mỏng nhẹ hiệu năng',
    price: 26990000,
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400',
    category: 'Laptop',
    brand: 'Acer',
    stock: 30,
  },
  {
    name: 'MSI Stealth 17 Studio',
    description: 'Intel i9, RTX 4080, 32GB RAM, workstation gaming',
    price: 75990000,
    image: 'https://images.unsplash.com/photo-1561883088-039e53143d73?w=400',
    category: 'Laptop',
    brand: 'MSI',
    stock: 10,
  },
  {
    name: 'Microsoft Surface Laptop 5',
    description: 'Intel i7, 16GB RAM, màn cảm ứng 3:2, Windows 11',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400',
    category: 'Laptop',
    brand: 'Microsoft',
    stock: 20,
  },

  // ===== TABLET (10 sản phẩm) =====
  {
    name: 'iPad Pro 12.9" M4',
    description: 'Chip M4, màn Ultra Retina XDR, Face ID, 256GB',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 30,
  },
  {
    name: 'iPad Pro 11" M4',
    description: 'Chip M4, ProMotion 120Hz, Apple Pencil Pro support',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 35,
  },
  {
    name: 'iPad Air M2 11"',
    description: 'Chip M2, Touch ID, hỗ trợ Apple Pencil, 128GB',
    price: 16990000,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 45,
  },
  {
    name: 'iPad Air M2 13"',
    description: 'Màn hình lớn 13", Chip M2, USB-C, 128GB',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 30,
  },
  {
    name: 'iPad 10.9" Gen 10',
    description: 'Chip A14 Bionic, USB-C, Magic Keyboard Folio, 64GB',
    price: 11990000,
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 60,
  },
  {
    name: 'iPad mini 6',
    description: 'Chip A15, màn 8.3" Liquid Retina, nhỏ gọn mạnh mẽ',
    price: 14990000,
    image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=400',
    category: 'Tablet',
    brand: 'Apple',
    stock: 40,
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Snapdragon 8 Gen 2, màn 14.6" AMOLED, S-Pen',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1632634122911-f279562f0cd2?w=400',
    category: 'Tablet',
    brand: 'Samsung',
    stock: 20,
  },
  {
    name: 'Samsung Galaxy Tab S9+',
    description: 'Màn 12.4" AMOLED 120Hz, 256GB, S-Pen included',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    category: 'Tablet',
    brand: 'Samsung',
    stock: 25,
  },
  {
    name: 'Samsung Galaxy Tab S9',
    description: 'Màn 11" AMOLED, Snapdragon 8 Gen 2, IP68',
    price: 17990000,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
    category: 'Tablet',
    brand: 'Samsung',
    stock: 35,
  },
  {
    name: 'Xiaomi Pad 6 Pro',
    description: 'Snapdragon 8+ Gen 1, màn 11" 144Hz, giá tốt',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1632634122911-f279562f0cd2?w=400',
    category: 'Tablet',
    brand: 'Xiaomi',
    stock: 50,
  },

  // ===== PHỤ KIỆN (15 sản phẩm) =====
  {
    name: 'AirPods Pro 2 USB-C',
    description: 'Chống ồn chủ động, âm thanh spatial, chip H2',
    price: 6490000,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 80,
  },
  {
    name: 'AirPods 3',
    description: 'Spatial Audio, MagSafe case, 6 giờ nghe nhạc',
    price: 4690000,
    image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 100,
  },
  {
    name: 'AirPods Max Space Gray',
    description: 'Tai nghe over-ear cao cấp, chống ồn tuyệt đối',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 25,
  },
  {
    name: 'Apple Watch Series 9 45mm',
    description: 'Chip S9, Double Tap, màn Always-On Retina',
    price: 11990000,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 50,
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'Titanium, GPS + Cellular, 36 giờ pin, outdoor',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 20,
  },
  {
    name: 'Apple Watch SE 2 40mm',
    description: 'Chip S8, theo dõi sức khỏe, giá hợp lý',
    price: 6990000,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 60,
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'Bezel xoay, Wear OS, theo dõi sức khỏe toàn diện',
    price: 9990000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Phụ kiện',
    brand: 'Samsung',
    stock: 35,
  },
  {
    name: 'Samsung Galaxy Buds 2 Pro',
    description: 'ANC, 360 Audio, codec SSC, IPX7',
    price: 4290000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Phụ kiện',
    brand: 'Samsung',
    stock: 70,
  },
  {
    name: 'Magic Keyboard cho iPad Pro 12.9"',
    description: 'Trackpad, backlit keys, USB-C passthrough',
    price: 9990000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 25,
  },
  {
    name: 'Apple Pencil Pro',
    description: 'Squeeze gesture, haptic feedback, Find My',
    price: 3990000,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 45,
  },
  {
    name: 'Apple Pencil USB-C',
    description: 'Tương thích iPad 10, sạc qua USB-C',
    price: 2290000,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 55,
  },
  {
    name: 'MagSafe Charger 15W',
    description: 'Sạc không dây nhanh cho iPhone 12 trở lên',
    price: 1090000,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400',
    category: 'Phụ kiện',
    brand: 'Apple',
    stock: 100,
  },
  {
    name: 'Anker 737 Power Bank 24000mAh',
    description: 'Sạc nhanh 140W, sạc laptop được, USB-C PD',
    price: 3590000,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    category: 'Phụ kiện',
    brand: 'Anker',
    stock: 40,
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Chuột không dây cao cấp, êm ái, Bluetooth + USB',
    price: 2690000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    category: 'Phụ kiện',
    brand: 'Logitech',
    stock: 35,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Tai nghe chống ồn hàng đầu, 30 giờ pin',
    price: 8490000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    category: 'Phụ kiện',
    brand: 'Sony',
    stock: 30,
  },
];

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

  // Delete existing data to avoid foreign key constraints
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('🗑️ Cleared existing data');

  // Create 14 categories
  const categoriesData = [
    { name: 'Nhà Sách', slug: 'nha-sach', icon: '📚', order: 1 },
    { name: 'Nhà Cửa - Đời Sống', slug: 'nha-cua-doi-song', icon: '🏠', order: 2 },
    { name: 'Điện Thoại - Máy Tính Bảng', slug: 'dien-thoai-may-tinh-bang', icon: '📱', order: 3 },
    { name: 'Đồ Chơi - Mẹ & Bé', slug: 'do-choi-me-be', icon: '🧸', order: 4 },
    { name: 'Thiết Bị Số - Phụ Kiện', slug: 'thiet-bi-so-phu-kien', icon: '🎧', order: 5 },
    { name: 'Điện Gia Dụng', slug: 'dien-gia-dung', icon: '🔌', order: 6 },
    { name: 'Làm Đẹp - Sức Khỏe', slug: 'lam-dep-suc-khoe', icon: '💄', order: 7 },
    { name: 'Ô Tô - Xe Máy - Xe Đạp', slug: 'o-to-xe-may-xe-dap', icon: '🏍️', order: 8 },
    { name: 'Thời Trang Nữ', slug: 'thoi-trang-nu', icon: '👗', order: 9 },
    { name: 'Bách Hóa Online', slug: 'bach-hoa-online', icon: '🛒', order: 10 },
    { name: 'Thể Thao - Dã Ngoại', slug: 'the-thao-da-ngoai', icon: '⚽', order: 11 },
    { name: 'Thời Trang Nam', slug: 'thoi-trang-nam', icon: '👔', order: 12 },
    { name: 'Hàng Quốc Tế', slug: 'hang-quoc-te', icon: '🌍', order: 13 },
    { name: 'Máy Vi Tính', slug: 'may-vi-tinh', icon: '💻', order: 14 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log(`✅ Created ${categoriesData.length} categories`);

  // Create all products
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ Created ${products.length} products`);

  // Summary by category
  const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện'];
  for (const cat of categories) {
    const count = products.filter(p => p.category === cat).length;
    console.log(`   📦 ${cat}: ${count} sản phẩm`);
  }

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