import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  // 1. NHÀ SÁCH
  {
    name: 'Đắc Nhân Tâm',
    description: 'Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật ứng xử.',
    price: 76000,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    category: 'Nhà Sách',
    brand: 'First News',
    stock: 100,
  },
  {
    name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    description: 'Sách self-help dành cho giới trẻ Việt Nam.',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    category: 'Nhà Sách',
    brand: 'NXB Hội Nhà Văn',
    stock: 80,
  },
  {
    name: 'Bộ sách Harry Potter (7 tập)',
    description: 'Trọn bộ tiểu thuyết huyền bí kinh điển.',
    price: 1250000,
    image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400',
    category: 'Nhà Sách',
    brand: 'NXB Trẻ',
    stock: 30,
  },
  {
    name: 'Dụng cụ học tập Deli',
    description: 'Bộ bút chì, tẩy, thước kẻ cao cấp.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
    category: 'Nhà Sách',
    brand: 'Deli',
    stock: 200,
  },

  // 2. NHÀ CỬA - ĐỜI SỐNG
  {
    name: 'Bộ Chăn Ga Gối Cotton',
    description: 'Chất liệu 100% Cotton Hàn Quốc, mềm mịn.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400',
    category: 'Nhà Cửa - Đời Sống',
    brand: 'Everon',
    stock: 50,
  },
  {
    name: 'Đèn Ngủ Để Bàn Gốm Sứ',
    description: 'Thiết kế sang trọng, ánh sáng vàng ấm.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Nhà Cửa - Đời Sống',
    brand: 'Bát Tràng',
    stock: 40,
  },
  {
    name: 'Sofa Bed Thông Minh',
    description: 'Sofa giường gấp gọn tiện lợi.',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    category: 'Nhà Cửa - Đời Sống',
    brand: 'Baya',
    stock: 15,
  },

  // 3. ĐIỆN THOẠI - MÁY TÍNH BẢNG (Map from old Data)
  {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Flagship Apple với chip A17 Pro, camera 48MP, titanium design',
    price: 34990000,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    category: 'Điện Thoại - Máy Tính Bảng',
    brand: 'Apple',
    stock: 50,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Snapdragon 8 Gen 3, camera 200MP, S-Pen tích hợp',
    price: 33990000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    category: 'Điện Thoại - Máy Tính Bảng',
    brand: 'Samsung',
    stock: 35,
  },
  {
    name: 'iPad Pro 12.9" M4',
    description: 'Chip M4, màn Ultra Retina XDR, Face ID, 256GB',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Điện Thoại - Máy Tính Bảng',
    brand: 'Apple',
    stock: 30,
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Snapdragon 8 Gen 2, màn 14.6" AMOLED, S-Pen',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    category: 'Điện Thoại - Máy Tính Bảng',
    brand: 'Samsung',
    stock: 20,
  },

  // 4. ĐỒ CHƠI - MẸ & BÉ
  {
    name: 'Tã Quần Pampers L54',
    description: 'Thấm hút tốt, khô thoáng 12h, size L.',
    price: 289000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Pampers',
    stock: 100,
  },
  {
    name: 'Bộ Đồ Chơi Lego City',
    description: 'Xếp hình thành phố cảnh sát, 500 chi tiết.',
    price: 899000,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Lego',
    stock: 45,
  },
  {
    name: 'Sữa Bột Meiji Số 9',
    description: 'Sữa công thức Nhật Bản cho trẻ 1-3 tuổi.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1632059368581-2c9e76162391?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Meiji',
    stock: 60,
  },

  // 5. THIẾT BỊ SỐ - PHỤ KIỆN
  {
    name: 'AirPods Pro 2 USB-C',
    description: 'Chống ồn chủ động, âm thanh spatial, chip H2',
    price: 6490000,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    category: 'Thiết Bị Số - Phụ Kiện',
    brand: 'Apple',
    stock: 80,
  },
  {
    name: 'Anker 737 Power Bank',
    description: 'Sạc nhanh 140W, sạc laptop được, USB-C PD',
    price: 3590000,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    category: 'Thiết Bị Số - Phụ Kiện',
    brand: 'Anker',
    stock: 40,
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Chuột không dây cao cấp, êm ái, Bluetooth + USB',
    price: 2690000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    category: 'Thiết Bị Số - Phụ Kiện',
    brand: 'Logitech',
    stock: 35,
  },

  // 6. ĐIỆN GIA DỤNG
  {
    name: 'Nồi Cơm Điện Tử Toshiba',
    description: '1.8L, Lòng nồi chống dính, đa chức năng nấu.',
    price: 1890000,
    image: 'https://images.unsplash.com/photo-1588691880447-0b1685e10178?w=400',
    category: 'Điện Gia Dụng',
    brand: 'Toshiba',
    stock: 40,
  },
  {
    name: 'Robot Hút Bụi Xiaomi S10',
    description: 'Lực hút 4000Pa, lau nhà thông minh.',
    price: 5990000,
    image: 'https://images.unsplash.com/photo-1678881262601-38a6a6873528?w=400',
    category: 'Điện Gia Dụng',
    brand: 'Xiaomi',
    stock: 25,
  },
  {
    name: 'Máy Lọc Không Khí Sharp',
    description: 'Công nghệ Plasmacluster Ion, lọc bụi mịn PM2.5.',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    category: 'Điện Gia Dụng',
    brand: 'Sharp',
    stock: 30,
  },

  // 7. LÀM ĐẸP - SỨC KHỎE
  {
    name: 'Son 3CE Velvet Lip Tint',
    description: 'Chất son nhung mịn, màu sắc thời thượng.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400',
    category: 'Làm Đẹp - Sức Khỏe',
    brand: '3CE',
    stock: 120,
  },
  {
    name: 'Sữa Rửa Mặt CeraVe',
    description: 'Dành cho da dầu mụn, làm sạch sâu dịu nhẹ.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1600851897379-3733560b37bd?w=400',
    category: 'Làm Đẹp - Sức Khỏe',
    brand: 'CeraVe',
    stock: 90,
  },
  {
    name: 'Vitamin Tổng Hợp One A Day',
    description: 'Bổ sung vitamin và khoáng chất cho nam giới.',
    price: 550000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    category: 'Làm Đẹp - Sức Khỏe',
    brand: 'Bayer',
    stock: 50,
  },

  // 8. Ô TÔ - XE MÁY - XE ĐẠP
  {
    name: 'Nón Bảo Hiểm 3/4 Royal',
    description: 'Kính âm sành điệu, an toàn chuẩn QUATEST.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1557803175-29ae780b6a22?w=400',
    category: 'Ô Tô - Xe Máy - Xe Đạp',
    brand: 'Royal',
    stock: 60,
  },
  {
    name: 'Xe Đạp Địa Hình Giant',
    description: 'ATX 660, Khung nhôm ALUXX nhẹ bền.',
    price: 8500000,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57e308e?w=400',
    category: 'Ô Tô - Xe Máy - Xe Đạp',
    brand: 'Giant',
    stock: 10,
  },
  {
    name: 'Camera Hành Trình Vietmap',
    description: 'Ghi hình 4K, cảnh báo giao thông.',
    price: 3890000,
    image: 'https://images.unsplash.com/photo-1614032686163-bdc24c13d0b6?w=400',
    category: 'Ô Tô - Xe Máy - Xe Đạp',
    brand: 'Vietmap',
    stock: 25,
  },

  // 9. THỜI TRANG NỮ
  {
    name: 'Đầm Dạo Phố Voan Hoa',
    description: 'Thiết kế nhẹ nhàng, nữ tính, phù hợp mùa hè.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    category: 'Thời Trang Nữ',
    brand: 'No Brand',
    stock: 50,
  },
  {
    name: 'Túi Xách Nữ JUNO',
    description: 'Túi đeo chéo da tổng hợp cao cấp.',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    category: 'Thời Trang Nữ',
    brand: 'Juno',
    stock: 40,
  },
  {
    name: 'Giày Cao Gót Mũi Nhọn',
    description: 'Gót 7cm, da bóng sang trọng.',
    price: 490000,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
    category: 'Thời Trang Nữ',
    brand: 'Vascara',
    stock: 35,
  },

  // 10. BÁCH HÓA ONLINE
  {
    name: 'Thùng 24 Lon Bia Tiger',
    description: 'Bia Lager 330ml/lon, giải khát sảng khoái.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1721523910543-85f02c672b16?w=400',
    category: 'Bách Hóa Online',
    brand: 'Tiger',
    stock: 100,
  },
  {
    name: 'Gạo ST25 Ông Cua 5kg',
    description: 'Gạo ngon nhất thế giới, dẻo thơm.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    category: 'Bách Hóa Online',
    brand: 'Gạo Ông Cua',
    stock: 50,
  },
  {
    name: 'Nước Giặt OMO Matic 3.9kg',
    description: 'Sạch bẩn, thơm lâu, bảo vệ máy giặt.',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    category: 'Bách Hóa Online',
    brand: 'Omo',
    stock: 80,
  },

  // 11. THỂ THAO - DÃ NGOẠI
  {
    name: 'Giày Chạy Bộ Nike Air Zoom',
    description: 'Đệm êm ái, thoáng khí, hỗ trợ vận động.',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Thể Thao - Dã Ngoại',
    brand: 'Nike',
    stock: 30,
  },
  {
    name: 'Vợt Cầu Lông Yonex',
    description: 'Khung Nano, nhẹ, linh hoạt, căng sẵn lưới.',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1626224583764-847890e045b5?w=400',
    category: 'Thể Thao - Dã Ngoại',
    brand: 'Yonex',
    stock: 25,
  },
  {
    name: 'Lều Cắm Trại 4 Người',
    description: 'Chống nước, chống tia UV, dễ lắp đặt.',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1504280501179-fac972dc6e6d?w=400',
    category: 'Thể Thao - Dã Ngoại',
    brand: 'Camel',
    stock: 20,
  },

  // 12. THỜI TRANG NAM
  {
    name: 'Áo Polo Nam Aristino',
    description: 'Chất liệu Coolmax thoáng mát, dáng slimfit.',
    price: 550000,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?w=400',
    category: 'Thời Trang Nam',
    brand: 'Aristino',
    stock: 60,
  },
  {
    name: 'Quần Jeans Nam Levi\'s',
    description: '501 Original Fit, bền bỉ, phong cách cổ điển.',
    price: 1890000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Thời Trang Nam',
    brand: 'Levi\'s',
    stock: 40,
  },
  {
    name: 'Đồng Hồ Casio Edifice',
    description: 'Chống nước 100m, kính khoáng, dây kim loại.',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    category: 'Thời Trang Nam',
    brand: 'Casio',
    stock: 25,
  },

  // 13. HÀNG QUỐC TẾ
  {
    name: 'Kính Mát Ray-Ban Aviator',
    description: 'Hàng chính hãng Mỹ, chống tia UV 100%.',
    price: 3500000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    category: 'Hàng Quốc Tế',
    brand: 'Ray-Ban',
    stock: 20,
  },
  {
    name: 'Nước Hoa Chanel No.5',
    description: 'Hương thơm sang trọng, quyến rũ, 50ml.',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    category: 'Hàng Quốc Tế',
    brand: 'Chanel',
    stock: 15,
  },
  {
    name: 'Socola Ferrero Rocher 30 Viên',
    description: 'Socola Ý cao cấp, hạt phỉ thơm ngon.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400',
    category: 'Hàng Quốc Tế',
    brand: 'Ferrero',
    stock: 50,
  },

  // 14. MÁY VI TÍNH (Re-mapped from Laptop)
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Chip M3 Pro, 18GB RAM, 512GB SSD, màn Liquid Retina XDR',
    price: 52990000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'Máy Vi Tính',
    brand: 'Apple',
    stock: 25,
  },
  {
    name: 'Dell XPS 15 9530',
    description: 'Intel Core i7-13700H, RTX 4060, 16GB RAM, OLED 3.5K',
    price: 45990000,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    category: 'Máy Vi Tính',
    brand: 'Dell',
    stock: 20,
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9, RTX 4090, 32GB RAM, gaming mạnh mẽ',
    price: 55990000,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    category: 'Máy Vi Tính',
    brand: 'Asus',
    stock: 15,
  },
  {
    name: 'HP Spectre x360 14',
    description: '2-in-1 laptop, Intel i7, OLED 3K, bút stylus',
    price: 38990000,
    image: 'https://images.unsplash.com/photo-1544099858-75feeb57f01b?w=400',
    category: 'Máy Vi Tính',
    brand: 'HP',
    stock: 15,
  },

  // 15. THƯƠNG HIỆU NỔI BẬT - SẢN PHẨM MẸ & BÉ
  {
    name: 'Tã Dán Huggies Dry S56',
    description: 'Tã dán thấm hút siêu tốc, khô thoáng cho bé 4-8kg.',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Huggies',
    stock: 150,
  },
  {
    name: 'Tã Quần Huggies Dry M72',
    description: 'Tã quần siêu thấm hút, cho bé 6-11kg, size M.',
    price: 289000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Huggies',
    stock: 120,
  },
  {
    name: 'Tã Quần Huggies Platinum L54',
    description: 'Tã cao cấp, mềm mại như lụa, cho bé 9-14kg.',
    price: 379000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Huggies',
    stock: 80,
  },
  {
    name: 'Sữa Bột Friso Gold 3 1.5kg',
    description: 'Sữa công thức cao cấp từ Hà Lan cho trẻ 1-3 tuổi.',
    price: 685000,
    image: 'https://images.unsplash.com/photo-1632059368581-2c9e76162391?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Friso',
    stock: 60,
  },
  {
    name: 'Sữa Bột Friso Gold 4 1.5kg',
    description: 'Sữa công thức Hà Lan cho trẻ 2-4 tuổi.',
    price: 649000,
    image: 'https://images.unsplash.com/photo-1632059368581-2c9e76162391?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Friso',
    stock: 55,
  },
  {
    name: 'Sữa Bột Enfamil A+ Số 1 900g',
    description: 'Sữa công thức Mỹ với DHA giúp phát triển não bộ.',
    price: 520000,
    image: 'https://images.unsplash.com/photo-1632059368581-2c9e76162391?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Enfa',
    stock: 70,
  },
  {
    name: 'Sữa Enfagrow A+ Số 3 1.7kg',
    description: 'Sữa Enfa cho trẻ 1-3 tuổi, bổ sung 360 Brain Plus.',
    price: 599000,
    image: 'https://images.unsplash.com/photo-1632059368581-2c9e76162391?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Enfa',
    stock: 65,
  },
  {
    name: 'Tã Quần Bobby M76',
    description: 'Tã siêu thấm hút cho bé 6-10kg, siêu mềm mại.',
    price: 259000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Bobby',
    stock: 100,
  },
  {
    name: 'Tã Quần Bobby Extra Soft L68',
    description: 'Tã Bobby cao cấp, mềm mịn như bông, size L.',
    price: 299000,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    category: 'Đồ Chơi - Mẹ & Bé',
    brand: 'Bobby',
    stock: 90,
  },

  // 16. THƯƠNG HIỆU NỔI BẬT - SỮA VÀ THỰC PHẨM
  {
    name: 'Sữa Tươi Vinamilk 100% 1L',
    description: 'Sữa tươi tiệt trùng không đường, ít béo.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Bách Hóa Online',
    brand: 'Vinamilk',
    stock: 200,
  },
  {
    name: 'Sữa Chua Vinamilk Nếp Cẩm',
    description: 'Lốc 4 hũ sữa chua ít đường, vị nếp cẩm.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Bách Hóa Online',
    brand: 'Vinamilk',
    stock: 150,
  },
  {
    name: 'Sữa Đặc Ông Thọ 380g',
    description: 'Sữa đặc có đường Vinamilk, thơm ngon béo ngậy.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Bách Hóa Online',
    brand: 'Vinamilk',
    stock: 180,
  },
  {
    name: 'Bột Ngũ Cốc Nestle Nesvita',
    description: 'Ngũ cốc dinh dưỡng, giàu canxi, 16 gói.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Bách Hóa Online',
    brand: 'Nestle',
    stock: 100,
  },
  {
    name: 'Cà Phê Hòa Tan Nescafe 3in1',
    description: 'Hộp 20 gói cà phê sữa hòa tan tiện lợi.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    category: 'Bách Hóa Online',
    brand: 'Nestle',
    stock: 120,
  },
  {
    name: 'Socola KitKat 4 Fingers',
    description: 'Bánh xốp phủ socola sữa, hộp 12 thanh.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400',
    category: 'Bách Hóa Online',
    brand: 'Nestle',
    stock: 80,
  },

  // 17. THƯƠNG HIỆU NỔI BẬT - GIA DỤNG UNILEVER
  {
    name: 'Nước Rửa Chén Sunlight 3.6kg',
    description: 'Nước rửa chén hương chanh, sạch bóng.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    category: 'Bách Hóa Online',
    brand: 'Unilever',
    stock: 100,
  },
  {
    name: 'Dầu Gội Clear Men',
    description: 'Dầu gội trị gàu, hương bạc hà mát lạnh 650g.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1626093757951-cda24f64e018?w=400',
    category: 'Làm Đẹp - Sức Khỏe',
    brand: 'Unilever',
    stock: 80,
  },
  {
    name: 'Bột Giặt Omo Matic 6kg',
    description: 'Bột giặt máy cửa trên, sạch bẩn, thơm lâu.',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    category: 'Bách Hóa Online',
    brand: 'Unilever',
    stock: 70,
  },
  {
    name: 'Xà Phòng Dove Dưỡng Ẩm',
    description: 'Xà phòng tắm dưỡng ẩm da, lốc 4 bánh.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1600851897379-3733560b37bd?w=400',
    category: 'Làm Đẹp - Sức Khỏe',
    brand: 'Unilever',
    stock: 90,
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
  const categoriesToCheck = [
    'Nhà Sách',
    'Nhà Cửa - Đời Sống',
    'Điện Thoại - Máy Tính Bảng',
    'Đồ Chơi - Mẹ & Bé',
    'Thiết Bị Số - Phụ Kiện',
    'Điện Gia Dụng',
    'Làm Đẹp - Sức Khỏe',
    'Ô Tô - Xe Máy - Xe Đạp',
    'Bách Hóa Online',
    'Thời Trang Nam',
    'Thời Trang Nữ',
    'Thể Thao - Dã Ngoại',
    'Hàng Quốc Tế',
    'Máy Vi Tính'
  ];

  console.log('📊 Thống kê sản phẩm theo danh mục:');
  for (const cat of categoriesToCheck) {
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