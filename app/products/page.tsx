import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

async function getProducts(category?: string, search?: string, sort?: SortOption) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (category) {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Determine sort order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };

    switch (sort) {
        case 'price-asc':
            orderBy = { price: 'asc' };
            break;
        case 'price-desc':
            orderBy = { price: 'desc' };
            break;
        case 'name':
            orderBy = { name: 'asc' };
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
        where,
        orderBy,
    });

    return products;
}

async function getCategories() {
    const products = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
    });
    return products.map(p => p.category);
}

function ProductSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;
    const sort = typeof params.sort === 'string' ? params.sort as SortOption : 'newest';

    const [products, categories] = await Promise.all([
        getProducts(category, search, sort),
        getCategories(),
    ]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {category ? category : search ? `Kết quả: "${search}"` : 'Tất cả sản phẩm'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {products.length} sản phẩm được tìm thấy
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sắp xếp:</span>
                            <form>
                                <Select name="sort" defaultValue={sort}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sắp xếp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            <Link href={`/products?${category ? `category=${category}&` : ''}${search ? `search=${search}&` : ''}sort=newest`} className="block w-full">
                                                Mới nhất
                                            </Link>
                                        </SelectItem>
                                        <SelectItem value="price-asc">
                                            <Link href={`/products?${category ? `category=${category}&` : ''}${search ? `search=${search}&` : ''}sort=price-asc`} className="block w-full">
                                                Giá thấp → cao
                                            </Link>
                                        </SelectItem>
                                        <SelectItem value="price-desc">
                                            <Link href={`/products?${category ? `category=${category}&` : ''}${search ? `search=${search}&` : ''}sort=price-desc`} className="block w-full">
                                                Giá cao → thấp
                                            </Link>
                                        </SelectItem>
                                        <SelectItem value="name">
                                            <Link href={`/products?${category ? `category=${category}&` : ''}${search ? `search=${search}&` : ''}sort=name`} className="block w-full">
                                                Tên A-Z
                                            </Link>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </form>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Link href="/products">
                            <Badge
                                variant={!category ? 'default' : 'outline'}
                                className="cursor-pointer hover:bg-primary/80"
                            >
                                Tất cả
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
                                <Badge
                                    variant={category === cat ? 'default' : 'outline'}
                                    className="cursor-pointer hover:bg-primary/80"
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
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
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-gray-500 text-lg mb-4">
                                    Không tìm thấy sản phẩm nào.
                                </p>
                                <Link href="/products">
                                    <Button variant="outline">Xem tất cả sản phẩm</Button>
                                </Link>
                            </div>
                        )}
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
