'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createPortal } from 'react-dom';

interface Banner {
    id: string;
    title: string;
    image: string;
    link: string | null;
    position: string;
    isActive: boolean;
}

export default function MarketingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [banner, setBanner] = useState<Banner | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchPopupBanner();
    }, []);

    const fetchPopupBanner = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            if (res.ok) {
                const banners: Banner[] = await res.json();
                // Tìm banner popup đang active
                const popupBanner = banners.find(b => b.position === 'popup' && b.isActive);
                if (popupBanner) {
                    setBanner(popupBanner);
                    // Show popup after 1.5 seconds
                    setTimeout(() => setIsVisible(true), 1500);
                }
            }
        } catch (error) {
            console.error('Error fetching popup banner:', error);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!mounted || !isVisible || !banner) return null;

    // Support both http URLs and local uploads (/uploads/...)
    const imageUrl = banner.image || '/promo-banner.jpg';
    const linkUrl = banner.link || '/products';

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative bg-transparent max-w-[500px] w-full animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-200 transition-colors bg-white/20 hover:bg-white/30 rounded-full p-2"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Banner Image */}
                <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                    <img
                        src={imageUrl}
                        alt={banner.title}
                        className="w-full h-auto object-cover"
                    />

                    {/* Overlay Button */}
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={linkUrl} onClick={handleClose} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg transform transition hover:scale-105 border-0">
                                {banner.title || 'Mua Ngay - Sale Sập Sàn'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

