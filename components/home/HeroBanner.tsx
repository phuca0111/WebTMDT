'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    image: string;
    link: string | null;
    position: string;
    isActive: boolean;
    order: number;
}

// Default banners nếu database chưa có
const defaultBanners = [
    {
        id: '1',
        title: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        link: '/products?category=Điện+thoại',
        position: 'hero',
        isActive: true,
        order: 0,
    },
    {
        id: '2',
        title: 'MacBook Pro M3',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        link: '/products?category=Laptop',
        position: 'hero',
        isActive: true,
        order: 1,
    },
    {
        id: '3',
        title: 'Galaxy S24 Ultra',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        link: '/products?category=Điện+thoại',
        position: 'hero',
        isActive: true,
        order: 2,
    },
];

const defaultSideBanners = [
    {
        id: 's1',
        title: 'Flash Sale - Giảm đến 50%',
        image: '',
        link: '/products',
        position: 'sidebar',
        isActive: true,
        order: 0,
    },
    {
        id: 's2',
        title: 'Freeship đơn từ 1 triệu',
        image: '',
        link: '/products',
        position: 'sidebar',
        isActive: true,
        order: 1,
    },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroBanners, setHeroBanners] = useState<Banner[]>(defaultBanners);
    const [sideBanners, setSideBanners] = useState<Banner[]>(defaultSideBanners);

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (heroBanners.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [heroBanners.length]);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            if (res.ok) {
                const allBanners: Banner[] = await res.json();

                // Filter active banners by position
                const hero = allBanners.filter(b => b.position === 'hero' && b.isActive);
                const sidebar = allBanners.filter(b => b.position === 'sidebar' && b.isActive);

                if (hero.length > 0) setHeroBanners(hero);
                if (sidebar.length > 0) setSideBanners(sidebar);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const goToSlide = (index: number) => setCurrentSlide(index);
    const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
    const goToNext = () => setCurrentSlide((prev) => (prev + 1) % heroBanners.length);

    // Random gradient colors for sidebar banners without images
    const gradients = [
        'bg-gradient-to-br from-orange-500 to-red-500',
        'bg-gradient-to-br from-green-500 to-emerald-500',
        'bg-gradient-to-br from-blue-500 to-indigo-500',
        'bg-gradient-to-br from-purple-500 to-pink-500',
    ];

    return (
        <section className="mb-4">
            <div className="flex gap-2">
                {/* Main Banner Slider */}
                <div className="flex-1 relative overflow-hidden rounded-lg h-[280px] md:h-[340px]">
                    <div
                        className="flex transition-transform duration-500 ease-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {heroBanners.map((banner) => (
                            <Link
                                key={banner.id}
                                href={banner.link || '/products'}
                                className="min-w-full h-full relative flex items-center bg-gradient-to-r from-blue-600 to-blue-500"
                            >
                                {/* Background Image */}
                                {banner.image && (
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/30" />
                                {/* Text */}
                                <div className="p-8 z-10 relative">
                                    <h2 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">{banner.title}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Arrows */}
                    {heroBanners.length > 1 && (
                        <>
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
                        </>
                    )}

                    {/* Dots */}
                    {heroBanners.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {heroBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-5' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Banners - Desktop Only */}
                <div className="hidden lg:flex flex-col gap-2 w-[240px]">
                    {sideBanners.slice(0, 2).map((banner, index) => (
                        <Link
                            key={banner.id}
                            href={banner.link || '/products'}
                            className={`flex-1 rounded-lg overflow-hidden relative hover:opacity-90 transition ${!banner.image ? gradients[index % gradients.length] : ''
                                }`}
                        >
                            {banner.image ? (
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="p-4 flex flex-col justify-center h-full">
                                    <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

