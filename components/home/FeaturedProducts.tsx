import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import prisma from '@/lib/db';

async function getFeaturedProducts() {
    return prisma.product.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            reviews: {
                select: { rating: true }
            }
        }
    });
}

export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Sản phẩm nổi bật</h2>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => {
                    const avgRating = product.reviews.length > 0
                        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                        : 0;
                    return (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={Number(product.price)}
                            image={product.image}
                            category={product.category}
                            stock={product.stock}
                            soldCount={product.soldCount}
                            avgRating={avgRating}
                            reviewCount={product.reviews.length}
                        />
                    );
                })}
            </div>
        </section>
    );
}

