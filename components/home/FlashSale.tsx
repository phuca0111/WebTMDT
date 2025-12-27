'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { useFlashSale } from '@/hooks/useFlashSale';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    soldCount?: number;
}

interface FlashSaleProps {
    products: Product[];
}

export default function FlashSale({ products }: FlashSaleProps) {
    const { isActive, currentSlot, nextSlot, timeLeft, isExpired, settings } = useFlashSale();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Scroll handlers
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollPosition);
            return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
        }
    }, [products]);

    if (!isActive) return null; // Ẩn nếu admin tắt Flash Sale

    const formatTime = (n: number) => n.toString().padStart(2, '0');

    if (products.length === 0) return null;

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-red-500" fill="currentColor" />
                        <h2 className="text-base font-semibold text-gray-800">Flash Sale</h2>
                    </div>

                    {/* Time Slot Indicator */}
                    <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(currentSlot)}:00 - {formatTime(nextSlot)}:00</span>
                    </div>

                    {/* Countdown or Expired */}
                    {isExpired ? (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <span className="text-red-500 font-semibold text-sm animate-pulse">⏰ Đã kết thúc!</span>
                            <span className="text-gray-500 text-xs">Đang cập nhật...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-500 text-xs mr-1">Kết thúc trong:</span>
                            <div className="flex gap-0.5">
                                <span className="bg-[#ff424e] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                    {formatTime(timeLeft.hours)}
                                </span>
                                <span className="text-[#ff424e] font-bold">:</span>
                                <span className="bg-[#ff424e] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                    {formatTime(timeLeft.minutes)}
                                </span>
                                <span className="text-[#ff424e] font-bold">:</span>
                                <span className="bg-[#ff424e] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                    {formatTime(timeLeft.seconds)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/products?flash_sale=true" className="flex items-center gap-1 text-[#1a94ff] text-sm font-medium hover:underline">
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Products Scroll with Navigation */}
            <div className="relative group/nav">
                {/* Left Arrow Button */}
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 shadow-lg rounded-full items-center justify-center text-gray-600 hover:text-[#1a94ff] hover:bg-white transition-all border border-gray-200 -ml-2"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {/* Right Arrow Button */}
                {canScrollRight && (
                    <button
                        onClick={scrollRight}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 shadow-lg rounded-full items-center justify-center text-gray-600 hover:text-[#1a94ff] hover:bg-white transition-all border border-gray-200 -mr-2"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}

                {/* Products List */}
                <div
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                >
                    {products.slice(0, 10).map((product, index) => {
                        const salePercent = settings?.discountPercent || 20;
                        const originalPrice = product.price;
                        const discountedPrice = originalPrice * (1 - salePercent / 100);

                        // Tính % đã bán thực tế
                        const totalStock = product.stock + (product.soldCount || 0);
                        const soldCount = product.soldCount || 0;
                        const soldPercent = totalStock > 0
                            ? Math.min(100, Math.round((soldCount / totalStock) * 100))
                            : 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="min-w-[140px] md:min-w-[160px] snap-start flex-shrink-0"
                            >
                                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md hover:border-[#1a94ff]/30 transition-all group">
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-50">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="160px"
                                        />
                                        {/* Badge */}
                                        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br">
                                            -{salePercent}%
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-2">
                                        <h3 className="text-xs text-gray-800 line-clamp-2 mb-1 h-8 leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="text-red-500 font-bold text-sm mb-1">
                                            {formatPrice(discountedPrice)}
                                        </div>
                                        <div className="text-xs text-gray-400 line-through mb-2">
                                            {formatPrice(originalPrice)}
                                        </div>

                                        {/* Progress bar */}
                                        <div className="relative h-4 bg-red-100 rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all"
                                                style={{ width: `${Math.max(5, soldPercent)}%` }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium">
                                                {soldCount > 0 ? `Đã bán ${soldCount}` : `Còn ${product.stock} cái`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
