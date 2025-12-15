import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import prisma from '@/lib/db';
import AddToCartButton from './AddToCartButton';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    });
    return product;
}

async function getRelatedProducts(category: string, excludeId: string) {
    const products = await prisma.product.findMany({
        where: {
            category,
            id: { not: excludeId },
        },
        take: 4,
    });
    return products;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách
                    </Link>

                    {/* Product Detail */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Image */}
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {product.stock <= 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Badge variant="destructive" className="text-lg px-4 py-2">
                                            Hết hàng
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col">
                                {/* Category */}
                                <Badge variant="secondary" className="w-fit mb-3">
                                    {product.category}
                                </Badge>

                                {/* Name */}
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {formatPrice(Number(product.price))}
                                    </span>
                                    {product.stock > 0 && product.stock <= 10 && (
                                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            Còn {product.stock} sản phẩm
                                        </Badge>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                    </div>
                                )}

                                <Separator className="my-6" />

                                {/* Add to Cart */}
                                <AddToCartButton
                                    id={product.id}
                                    name={product.name}
                                    price={Number(product.price)}
                                    image={product.image}
                                    stock={product.stock}
                                />

                                <Separator className="my-6" />

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Truck className="h-5 w-5 text-blue-600" />
                                        <div className="text-sm">
                                            <p className="font-medium">Giao hàng miễn phí</p>
                                            <p className="text-gray-500">Đơn từ 1 triệu</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <div className="text-sm">
                                            <p className="font-medium">Bảo hành</p>
                                            <p className="text-gray-500">12 tháng chính hãng</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <RefreshCw className="h-5 w-5 text-orange-600" />
                                        <div className="text-sm">
                                            <p className="font-medium">Đổi trả</p>
                                            <p className="text-gray-500">7 ngày miễn phí</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link key={p.id} href={`/products/${p.id}`}>
                                        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                                <Image
                                                    src={p.image}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="25vw"
                                                />
                                            </div>
                                            <h3 className="font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                                            <p className="text-blue-600 font-semibold mt-1">{formatPrice(Number(p.price))}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
