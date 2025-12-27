import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Flame, Tag, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/format';
import CountdownTimer from '@/components/CountdownTimer';

// Force dynamic rendering for Vercel deployment
export const dynamic = 'force-dynamic';

// Cấu hình cho từng loại deal - dùng tên category chính xác từ database
const dealConfigs: Record<string, {
    title: string;
    subtitle: string;
    icon: string;
    bgGradient: string;
    bannerText: string;
    categoryNames: string[]; // Tên category chính xác trong DB
}> = {
    'hot-coupon': {
        title: 'Hot Coupon Mỗi Ngày',
        subtitle: 'Mã giảm giá siêu hot - Cập nhật liên tục',
        icon: '🎫',
        bgGradient: 'from-blue-500 via-blue-600 to-purple-600',
        bannerText: 'Nhập mã SALE50 giảm thêm 50K cho đơn từ 500K',
        categoryNames: ['Điện Thoại - Máy Tính Bảng', 'Thiết Bị Số - Phụ Kiện'],
    },
    'deal-soc': {
        title: 'Deal Sốc Giảm 50%',
        subtitle: 'Flash Sale - Số lượng có hạn',
        icon: '⚡',
        bgGradient: 'from-red-500 via-orange-500 to-yellow-500',
        bannerText: 'Giảm đến 50% - Chỉ trong hôm nay!',
        categoryNames: ['Máy Vi Tính', 'Thiết Bị Số - Phụ Kiện'],
    },
    'combo-nha': {
        title: 'Combo Nhà Dùng',
        subtitle: 'Bách hóa online - Siêu tiết kiệm',
        icon: '📦',
        bgGradient: 'from-amber-500 via-orange-500 to-red-500',
        bannerText: 'Mua combo tiết kiệm đến 40%',
        categoryNames: ['Nhà Cửa - Đời Sống', 'Bách Hóa Online'],
    },
    're-moi-ngay': {
        title: 'Rẻ Mỗi Ngày',
        subtitle: 'Deal giá sốc cập nhật mỗi ngày',
        icon: '🏷️',
        bgGradient: 'from-pink-500 via-rose-500 to-red-500',
        bannerText: 'Giá rẻ nhất - Không cần săn sale',
        categoryNames: ['Đồ Chơi - Mẹ & Bé', 'Thể Thao - Dã Ngoại'],
    },
    'cham-soc-da': {
        title: 'Chăm Sóc Da Cuối Năm',
        subtitle: 'Mỹ phẩm chính hãng - Giá ưu đãi',
        icon: '✨',
        bgGradient: 'from-rose-400 via-pink-500 to-purple-500',
        bannerText: 'Làm đẹp đón Tết - Giảm đến 50%',
        categoryNames: ['Làm Đẹp - Sức Khỏe'],
    },
    'xa-kho': {
        title: 'Xả Kho Giảm 50%',
        subtitle: 'Thanh lý kho - Giá siêu rẻ',
        icon: '🎁',
        bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
        bannerText: 'Xả kho cuối năm - Mua ngay kẻo hết!',
        categoryNames: ['Thời Trang Nữ', 'Thời Trang Nam'],
    },
    'tiec-sach': {
        title: 'Tiệc Sách Cuối Năm',
        subtitle: 'Sách hay giá tốt - Freeship',
        icon: '📚',
        bgGradient: 'from-orange-500 via-red-500 to-pink-500',
        bannerText: 'Mua 3 tặng 1 - Freeship đơn từ 150K',
        categoryNames: ['Nhà Sách'],
    },
    'dien-may': {
        title: 'Điện Máy Giảm 50%',
        subtitle: 'Điện tử - Điện gia dụng chính hãng',
        icon: '🖥️',
        bgGradient: 'from-slate-600 via-gray-700 to-zinc-800',
        bannerText: 'Trả góp 0% - Bảo hành chính hãng',
        categoryNames: ['Điện Thoại - Máy Tính Bảng', 'Máy Vi Tính', 'Điện Gia Dụng', 'Thiết Bị Số - Phụ Kiện'],
    },
};

async function getProductsForDeal(slug: string) {
    const config = dealConfigs[slug];
    if (!config) return [];

    // Tìm các category theo tên
    const categories = await prisma.category.findMany({
        where: {
            name: { in: config.categoryNames }
        },
        select: { id: true, name: true }
    });

    if (categories.length > 0) {
        const categoryIds = categories.map(c => c.id);

        // Lấy sản phẩm thuộc các category này
        const products = await prisma.product.findMany({
            where: {
                stock: { gt: 0 },
                categoryId: { in: categoryIds }
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });

        if (products.length > 0) {
            return products;
        }
    }

    // Fallback: lấy sản phẩm theo tên category trong field category
    const products = await prisma.product.findMany({
        where: {
            stock: { gt: 0 },
            OR: config.categoryNames.map(name => ({
                category: { contains: name.split(' - ')[0] }
            }))
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
    });

    if (products.length > 0) {
        return products;
    }

    // Cuối cùng: lấy random nếu không có gì
    return prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const config = dealConfigs[slug];

    if (!config) {
        notFound();
    }

    const products = await getProductsForDeal(slug);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-white">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-3xl">{config.icon}</span>
                                {config.title}
                            </h1>
                            <p className="text-sm text-gray-500">{config.subtitle}</p>
                        </div>
                    </div>

                    {/* Deal Tabs */}
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm overflow-x-auto">
                        <div className="flex gap-3 min-w-max">
                            {Object.entries(dealConfigs).map(([key, deal]) => (
                                <Link
                                    key={key}
                                    href={`/deals/${key}`}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${key === slug
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{deal.icon}</span>
                                    <span className="text-sm font-medium">{deal.title.split(' ').slice(0, 2).join(' ')}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Banner với Countdown chạy thực */}
                    <div className={`bg-gradient-to-r ${config.bgGradient} rounded-xl p-6 mb-6 text-white`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Zap className="h-6 w-6" />
                                    {config.title}
                                </h2>
                                <p className="text-white/80 mt-1">{config.bannerText}</p>
                            </div>
                            <CountdownTimer />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Tag className="h-5 w-5 text-blue-500" />
                            Sản phẩm ({products.length})
                        </h3>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {products.map((product, index) => {
                                    const discount = [15, 20, 25, 30, 35, 40, 45, 50, 55][index % 9];
                                    const originalPrice = Math.round(Number(product.price) / (1 - discount / 100));

                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                                    -{discount}%
                                                </Badge>
                                                {product.stock < 10 && (
                                                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-[10px]">
                                                        Sắp hết
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#1a94ff]">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-red-500">
                                                        {formatPrice(Number(product.price))}
                                                    </span>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {formatPrice(originalPrice)}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    Đã bán {product.soldCount || Math.floor(Math.random() * 500) + 50}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Flame className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Đang cập nhật sản phẩm khuyến mãi...</p>
                                <p className="text-sm text-gray-400 mt-2">Vui lòng quay lại sau</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
