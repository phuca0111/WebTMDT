'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Truck } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
    soldCount: number;
    avgRating?: number;
    originalPrice?: number;
}

export default function YouMayLike() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    // Shuffle and take 12 random products
                    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 12);
                    setProducts(shuffled);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', updateScrollButtons);
            return () => ref.removeEventListener('scroll', updateScrollButtons);
        }
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    const getDiscount = (original: number, current: number) => {
        return Math.round(((original - current) / original) * 100);
    };

    if (loading) {
        return (
            <section className="bg-white rounded-lg p-4">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="flex gap-3 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[180px]">
                            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg p-4 relative">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Bạn có thể thích</h2>

            {/* Navigation Arrows */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            )}

            {/* Products Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
            >
                {products.map((product) => {
                    const originalPrice = Math.round(Number(product.price) * 1.2);
                    const discount = getDiscount(originalPrice, Number(product.price));

                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex-shrink-0 w-[180px] group"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Discount Badge */}
                                {discount > 0 && (
                                    <div className="absolute top-2 left-2 bg-[#ff424e] text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                        -{discount}%
                                    </div>
                                )}
                                {/* Brand Badge */}
                                {product.brand && (
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-medium px-1.5 py-0.5 rounded text-blue-600 border border-blue-200">
                                        ✓ {product.brand}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="px-1">
                                <h3 className="text-[13px] text-gray-800 line-clamp-2 min-h-[36px] mb-1 group-hover:text-[#1a94ff] transition-colors">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-3 w-3 ${star <= (product.avgRating || 5)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                        Đã bán {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[#ff424e] font-semibold text-base">
                                        {formatPrice(Number(product.price))}
                                    </span>
                                    <span className="text-gray-400 text-xs line-through">
                                        {formatPrice(originalPrice)}
                                    </span>
                                </div>

                                {/* Shipping Badge */}
                                <div className="flex items-center gap-1 mt-1.5">
                                    <span className="bg-[#00ab56] text-white text-[10px] font-bold px-1 py-0.5 rounded">
                                        NOW
                                    </span>
                                    <span className="text-[11px] text-gray-500">Giao siêu tốc 2h</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* View All Link */}
            <div className="text-center mt-4">
                <Link
                    href="/products?sort=newest"
                    className="text-[#1a94ff] text-sm font-medium hover:underline"
                >
                    Xem tất cả →
                </Link>
            </div>
        </section>
    );
}
