import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import prisma from '@/lib/db';

async function getFeaturedProducts() {
    const products = await prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
    });
    return products;
}

export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
                        <p className="text-gray-600 mt-1">Những sản phẩm được yêu thích nhất</p>
                    </div>
                    <Link href="/products">
                        <Button variant="outline" className="gap-2">
                            Xem tất cả
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={Number(product.price)}
                            image={product.image}
                            category={product.category}
                            stock={product.stock}
                        />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Chưa có sản phẩm nào. Hãy thêm sản phẩm qua Admin Dashboard.
                    </div>
                )}
            </div>
        </section>
    );
}
