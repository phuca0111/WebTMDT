'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
    {
        id: 1,
        title: 'iPhone 15 Pro Max',
        subtitle: 'Giảm đến 3 triệu',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
        href: '/products?category=Điện+thoại',
    },
    {
        id: 2,
        title: 'MacBook Pro M3',
        subtitle: 'Trả góp 0%',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        bgColor: 'bg-gradient-to-r from-gray-800 to-gray-700',
        href: '/products?category=Laptop',
    },
    {
        id: 3,
        title: 'Galaxy S24 Ultra',
        subtitle: 'Tặng Galaxy Buds',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        bgColor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
        href: '/products?category=Điện+thoại',
    },
];

const sideBanners = [
    {
        id: 1,
        title: 'Flash Sale',
        subtitle: 'Giảm đến 50%',
        bgColor: 'bg-gradient-to-br from-orange-500 to-red-500',
        href: '/products',
    },
    {
        id: 2,
        title: 'Freeship',
        subtitle: 'Đơn từ 1 triệu',
        bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500',
        href: '/products',
    },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => setCurrentSlide(index);
    const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    const goToNext = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

    return (
        <section className="mb-4">
            <div className="flex gap-2">
                {/* Main Banner Slider */}
                <div className="flex-1 relative overflow-hidden rounded-lg h-[280px] md:h-[340px]">
                    <div
                        className="flex transition-transform duration-500 ease-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {banners.map((banner) => (
                            <Link
                                key={banner.id}
                                href={banner.href}
                                className={`min-w-full h-full ${banner.bgColor} relative flex items-center`}
                            >
                                <div className="p-8 z-10">
                                    <p className="text-white/80 text-sm mb-1">{banner.subtitle}</p>
                                    <h2 className="text-white text-3xl md:text-4xl font-bold">{banner.title}</h2>
                                </div>
                                <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Arrows */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition shadow"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition shadow"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-5' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Side Banners - Desktop Only */}
                <div className="hidden lg:flex flex-col gap-2 w-[240px]">
                    {sideBanners.map((banner) => (
                        <Link
                            key={banner.id}
                            href={banner.href}
                            className={`flex-1 ${banner.bgColor} rounded-lg p-4 flex flex-col justify-center hover:opacity-90 transition`}
                        >
                            <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                            <p className="text-white/80 text-sm">{banner.subtitle}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
