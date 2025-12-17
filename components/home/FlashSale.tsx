'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
}

interface FlashSaleProps {
    products: Product[];
}

export default function FlashSale({ products }: FlashSaleProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (n: number) => n.toString().padStart(2, '0');

    if (products.length === 0) return null;

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-red-500" fill="currentColor" />
                        <h2 className="text-base font-semibold text-gray-800">Flash Sale</h2>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div className="flex gap-1">
                            <span className="bg-[#1a94ff] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                {formatTime(timeLeft.hours)}
                            </span>
                            <span className="text-gray-400">:</span>
                            <span className="bg-[#1a94ff] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                {formatTime(timeLeft.minutes)}
                            </span>
                            <span className="text-gray-400">:</span>
                            <span className="bg-[#1a94ff] text-white px-1.5 py-0.5 rounded text-xs font-bold min-w-[24px] text-center">
                                {formatTime(timeLeft.seconds)}
                            </span>
                        </div>
                    </div>
                </div>

                <Link href="/products" className="flex items-center gap-1 text-[#1a94ff] text-sm font-medium hover:underline">
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Products Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {products.slice(0, 10).map((product, index) => {
                    const salePercent = 20 + ((index * 7) % 30);
                    const originalPrice = Math.round(product.price * (1 + salePercent / 100));
                    const soldPercent = Math.min(90, 30 + ((index * 13) % 60));

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
                                        {formatPrice(product.price)}
                                    </div>
                                    <div className="text-xs text-gray-400 line-through mb-2">
                                        {formatPrice(originalPrice)}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-4 bg-red-100 rounded-full overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all"
                                            style={{ width: `${soldPercent}%` }}
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium">
                                            Đã bán {soldPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
