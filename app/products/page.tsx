import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';
import { Search, X, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'bestseller';

const PAGE_SIZE = 20;

async function getProducts({
    category, search, sort, minPrice, maxPrice, brand, page = 1
}: {
    category?: string; search?: string; sort?: SortOption;
    minPrice?: number; maxPrice?: number; brand?: string[]; page?: number;
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category) where.category = category;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (brand && brand.length > 0) where.brand = { in: brand };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
        case 'price-asc': orderBy = { price: 'asc' }; break;
        case 'price-desc': orderBy = { price: 'desc' }; break;
        case 'name': orderBy = { name: 'asc' }; break;
        case 'bestseller': orderBy = { soldCount: 'desc' }; break;
        default: orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        }),
        prisma.product.count({ where }),
    ]);
    return { products, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

async function getFilterOptions() {
    const [categories, brands] = await Promise.all([
        prisma.product.findMany({ select: { category: true }, distinct: ['category'] }),
        prisma.product.findMany({ select: { brand: true }, distinct: ['brand'], where: { brand: { not: null } } })
    ]);
    return { categories: categories.map(p => p.category), brands: brands.map(p => p.brand).filter(Boolean) as string[] };
}

function ProductSkeleton() {
    return (
        <div className="bg-white rounded-lg p-3 space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
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
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;
    let selectedBrands: string[] = [];
    if (typeof params.brand === 'string') selectedBrands = [params.brand];
    else if (Array.isArray(params.brand)) selectedBrands = params.brand;

    const [{ products, total, totalPages }, { categories, brands }] = await Promise.all([
        getProducts({ category, search, sort, minPrice, maxPrice, brand: selectedBrands, page }),
        getFilterOptions(),
    ]);

    const sortOptions = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'bestseller', label: 'Bán chạy' },
        { value: 'price-asc', label: 'Giá thấp đến cao' },
        { value: 'price-desc', label: 'Giá cao đến thấp' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="text-gray-500 hover:text-[#1a94ff]">Trang chủ</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        {category ? (
                            <>
                                <Link href="/products" className="text-gray-500 hover:text-[#1a94ff]">Sản phẩm</Link>
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-800 font-medium">{category}</span>
                            </>
                        ) : (
                            <span className="text-gray-800 font-medium">
                                {search ? `Tìm kiếm "${search}"` : 'Tất cả sản phẩm'}
                            </span>
                        )}
                    </nav>

                    <div className="flex gap-4">
                        {/* Sidebar Filters */}
                        <aside className="hidden lg:block w-[200px] flex-shrink-0">
                            <div className="bg-white rounded-lg p-4 sticky top-28">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Filter className="h-4 w-4" /> Bộ lọc
                                </h3>

                                {/* Categories */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h4>
                                    <div className="space-y-1">
                                        <Link href="/products" className={`block text-sm py-1 px-2 rounded ${!category ? 'bg-[#f0f8ff] text-[#1a94ff] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            Tất cả
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                                                className={`block text-sm py-1 px-2 rounded ${category === cat ? 'bg-[#f0f8ff] text-[#1a94ff] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                                {cat}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Khoảng giá</h4>
                                    <form action="/products" className="space-y-2">
                                        {category && <input type="hidden" name="category" value={category} />}
                                        {search && <input type="hidden" name="search" value={search} />}
                                        <div className="flex items-center gap-1">
                                            <Input type="number" name="minPrice" placeholder="₫ TỪ" defaultValue={minPrice} className="h-8 text-xs" />
                                            <span className="text-gray-400">-</span>
                                            <Input type="number" name="maxPrice" placeholder="₫ ĐẾN" defaultValue={maxPrice} className="h-8 text-xs" />
                                        </div>
                                        <Button size="sm" className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6] text-xs h-8">Áp dụng</Button>
                                    </form>
                                </div>

                                {/* Brands */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Thương hiệu</h4>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {brands.map((b) => {
                                            const isSelected = selectedBrands.includes(b);
                                            const newBrands = isSelected ? selectedBrands.filter(x => x !== b) : [...selectedBrands, b];
                                            const query = new URLSearchParams();
                                            if (category) query.set('category', category);
                                            if (search) query.set('search', search);
                                            newBrands.forEach(x => query.append('brand', x));
                                            return (
                                                <Link key={b} href={`/products?${query}`}
                                                    className={`flex items-center gap-2 text-sm py-1 px-2 rounded ${isSelected ? 'bg-[#f0f8ff] text-[#1a94ff]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                                    <span className={`w-4 h-4 border rounded flex items-center justify-center ${isSelected ? 'bg-[#1a94ff] border-[#1a94ff]' : 'border-gray-300'}`}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </span>
                                                    {b}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Clear */}
                                {(category || minPrice || maxPrice || selectedBrands.length > 0) && (
                                    <Link href="/products">
                                        <Button variant="outline" size="sm" className="w-full text-[#ff424e] border-[#ff424e] hover:bg-red-50">
                                            <X className="h-3 w-3 mr-1" /> Xóa bộ lọc
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header & Sort */}
                            <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">Sắp xếp theo</span>
                                    {sortOptions.map(opt => {
                                        const query = new URLSearchParams(params as any);
                                        query.set('sort', opt.value);
                                        query.set('page', '1');
                                        return (
                                            <Link key={opt.value} href={`/products?${query}`}
                                                className={`px-3 py-1.5 rounded ${sort === opt.value ? 'bg-[#1a94ff] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                                {opt.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <span className="text-sm text-gray-500">{total} sản phẩm</span>
                            </div>

                            {/* Active Filters */}
                            {(selectedBrands.length > 0 || minPrice || maxPrice) && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedBrands.map(b => (
                                        <Badge key={b} className="bg-[#f0f8ff] text-[#1a94ff] border-[#1a94ff]/20 hover:bg-[#e0f0ff]">
                                            {b}
                                            <Link href={(() => {
                                                const q = new URLSearchParams(params as any);
                                                const brands = q.getAll('brand').filter(x => x !== b);
                                                q.delete('brand'); brands.forEach(x => q.append('brand', x));
                                                return `/products?${q}`;
                                            })()} className="ml-1"><X className="h-3 w-3" /></Link>
                                        </Badge>
                                    ))}
                                    {minPrice && (
                                        <Badge className="bg-gray-100 text-gray-700">
                                            Từ {minPrice.toLocaleString()}đ
                                            <Link href={(() => { const q = new URLSearchParams(params as any); q.delete('minPrice'); return `/products?${q}`; })()} className="ml-1"><X className="h-3 w-3" /></Link>
                                        </Badge>
                                    )}
                                    {maxPrice && (
                                        <Badge className="bg-gray-100 text-gray-700">
                                            Đến {maxPrice.toLocaleString()}đ
                                            <Link href={(() => { const q = new URLSearchParams(params as any); q.delete('maxPrice'); return `/products?${q}`; })()} className="ml-1"><X className="h-3 w-3" /></Link>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Products Grid - 5 columns */}
                            <Suspense fallback={
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                    {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
                                </div>
                            }>
                                {products.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
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

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center gap-1 py-4">
                                                {page > 1 && (
                                                    <Link href={`/products?${new URLSearchParams({ ...params as any, page: (page - 1).toString() })}`}>
                                                        <Button variant="outline" size="sm" className="h-8">← Trước</Button>
                                                    </Link>
                                                )}
                                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                                    let p = i + 1;
                                                    if (totalPages > 5) {
                                                        if (page <= 3) p = i + 1;
                                                        else if (page >= totalPages - 2) p = totalPages - 4 + i;
                                                        else p = page - 2 + i;
                                                    }
                                                    return (
                                                        <Link key={p} href={`/products?${new URLSearchParams({ ...params as any, page: p.toString() })}`}>
                                                            <Button variant={p === page ? "default" : "outline"} size="sm"
                                                                className={`h-8 min-w-8 ${p === page ? 'bg-[#1a94ff]' : ''}`}>
                                                                {p}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                                {page < totalPages && (
                                                    <Link href={`/products?${new URLSearchParams({ ...params as any, page: (page + 1).toString() })}`}>
                                                        <Button variant="outline" size="sm" className="h-8">Sau →</Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-lg">
                                        <div className="text-5xl mb-4">🔍</div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                                        <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                        <Link href="/products"><Button className="bg-[#1a94ff]">Xem tất cả sản phẩm</Button></Link>
                                    </div>
                                )}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
