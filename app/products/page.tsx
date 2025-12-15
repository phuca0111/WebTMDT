import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/db';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(category?: string, search?: string) {
    const where: { category?: string; OR?: { name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }[] } = {};

    if (category) {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    return products;
}

function ProductSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;

    const products = await getProducts(category, search);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {category ? category : search ? `Kết quả tìm kiếm: "${search}"` : 'Tất cả sản phẩm'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {products.length} sản phẩm được tìm thấy
                        </p>
                    </div>

                    {/* Products Grid */}
                    <Suspense fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    }>
                        {products.length > 0 ? (
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
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg">
                                    Không tìm thấy sản phẩm nào.
                                </p>
                            </div>
                        )}
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
