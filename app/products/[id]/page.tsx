import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, Shield, RefreshCw, ChevronRight, Star, BadgeCheck, Minus, Plus, Heart, Share2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import prisma from '@/lib/db';
import AddToCartButton from './AddToCartButton';
import ProductReviews from '@/components/products/ProductReviews';
import ProductCard from '@/components/products/ProductCard';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            reviews: {
                select: { rating: true }
            }
        }
    });
    return product;
}

async function getRelatedProducts(category: string, excludeId: string) {
    const products = await prisma.product.findMany({
        where: { category, id: { not: excludeId } },
        take: 6,
        include: {
            reviews: {
                select: { rating: true }
            }
        }
    });
    return products;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    // Tính rating thực từ reviews
    const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
    const reviewCount = product.reviews.length;
    const soldCount = product.soldCount;

    // Tính giá sale
    const hashCode = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const salePercent = 10 + (Math.abs(hashCode) % 25);
    const originalPrice = Math.round(Number(product.price) * (1 + salePercent / 100));

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="text-gray-500 hover:text-[#1a94ff]">Trang chủ</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Link href="/products" className="text-gray-500 hover:text-[#1a94ff]">Sản phẩm</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-[#1a94ff]">{product.category}</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-800 line-clamp-1">{product.name}</span>
                    </nav>

                    {/* Main Content */}
                    <div className="flex gap-4">
                        {/* Left: Images */}
                        <div className="w-full lg:w-[400px] flex-shrink-0">
                            <div className="bg-white rounded-lg p-4 sticky top-28">
                                {/* Main Image */}
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="400px"
                                    />
                                    {/* Sale Badge */}
                                    <div className="absolute top-2 left-2 bg-[#ff424e] text-white text-xs font-bold px-2 py-1 rounded">
                                        -{salePercent}%
                                    </div>
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-gray-800 text-white px-4 py-2 rounded">Hết hàng</span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails (fake gallery) */}
                                <div className="flex gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`w-16 h-16 rounded border-2 overflow-hidden cursor-pointer ${i === 0 ? 'border-[#1a94ff]' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <Image src={product.image} alt="" width={64} height={64} className="object-cover w-full h-full" />
                                        </div>
                                    ))}
                                </div>

                                {/* Share & Wishlist */}
                                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a94ff]">
                                        <Share2 className="h-4 w-4" /> Chia sẻ
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500">
                                        <Heart className="h-4 w-4" /> Yêu thích
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="flex-1 min-w-0 space-y-4">
                            {/* Product Info Card */}
                            <div className="bg-white rounded-lg p-4">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1 text-xs text-[#1a94ff] bg-[#f0f8ff] px-2 py-1 rounded font-medium">
                                        <BadgeCheck className="h-3.5 w-3.5" /> CHÍNH HÃNG
                                    </span>
                                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                </div>

                                {/* Name */}
                                <h1 className="text-xl font-medium text-gray-800 mb-3">{product.name}</h1>

                                {/* Rating & Sold */}
                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    {avgRating > 0 ? (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{avgRating.toFixed(1)}</span>
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-gray-400">({reviewCount})</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Chưa có đánh giá</span>
                                    )}
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">Đã bán {soldCount > 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}</span>
                                </div>

                                {/* Price Box */}
                                <div className="bg-[#fafafa] rounded-lg p-4 mb-4">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-[#ff424e]">{formatPrice(Number(product.price))}</span>
                                        <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                                        <span className="text-sm text-[#ff424e] font-medium">-{salePercent}%</span>
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-5 w-5 text-[#1a94ff] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Giao hàng miễn phí</p>
                                            <p className="text-xs text-gray-500">Đơn hàng từ 1 triệu đồng</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Bảo hành chính hãng</p>
                                            <p className="text-xs text-gray-500">12 tháng tại trung tâm bảo hành</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RefreshCw className="h-5 w-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Đổi trả miễn phí</p>
                                            <p className="text-xs text-gray-500">Trong 7 ngày đầu nhận hàng</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock */}
                                {product.stock > 0 && product.stock <= 10 && (
                                    <p className="text-sm text-orange-600 mb-4">⚡ Chỉ còn {product.stock} sản phẩm</p>
                                )}

                                {/* Add to Cart */}
                                <AddToCartButton
                                    id={product.id}
                                    name={product.name}
                                    price={Number(product.price)}
                                    image={product.image}
                                    stock={product.stock}
                                />
                            </div>

                            {/* Description Card */}
                            {product.description && (
                                <div className="bg-white rounded-lg p-4">
                                    <h2 className="text-base font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Reviews */}
                            <div className="bg-white rounded-lg p-4">
                                <ProductReviews productId={product.id} />
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-6">
                            <div className="bg-white rounded-lg p-4">
                                <h2 className="text-base font-semibold text-gray-800 mb-4">Sản phẩm tương tự</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                    {relatedProducts.map((p) => {
                                        const pAvgRating = p.reviews.length > 0
                                            ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
                                            : 0;
                                        return (
                                            <ProductCard
                                                key={p.id}
                                                id={p.id}
                                                name={p.name}
                                                description={p.description}
                                                price={Number(p.price)}
                                                image={p.image}
                                                category={p.category}
                                                stock={p.stock}
                                                soldCount={p.soldCount}
                                                avgRating={pAvgRating}
                                                reviewCount={p.reviews.length}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
