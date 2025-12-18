'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Smartphone, Laptop, Tablet, Headphones, Watch, Tv,
    Gamepad2, Gift, Shirt, Camera, Home, ShoppingBag,
    Dumbbell, Globe, Book, Baby, Sparkles, Car
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    _count?: { products: number };
}

// Default categories (fallback when API is loading)
const defaultCategories = [
    { name: 'Nhà Sách', icon: '📚', href: '/products?category=Nhà+Sách', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { name: 'Nhà Cửa', icon: '🏠', href: '/products?category=Nhà+Cửa+-+Đời+Sống', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
    { name: 'Điện Thoại', icon: '📱', href: '/products?category=Điện+Thoại+-+Máy+Tính+Bảng', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { name: 'Mẹ & Bé', icon: '🧸', href: '/products?category=Đồ+Chơi+-+Mẹ+%26+Bé', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
    { name: 'Thiết Bị Số', icon: '🎧', href: '/products?category=Thiết+Bị+Số+-+Phụ+Kiện', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
    { name: 'Điện Gia Dụng', icon: '🔌', href: '/products?category=Điện+Gia+Dụng', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { name: 'Làm Đẹp', icon: '💄', href: '/products?category=Làm+Đẹp+-+Sức+Khỏe', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
    { name: 'Xe Cộ', icon: '🏍️', href: '/products?category=Ô+Tô+-+Xe+Máy+-+Xe+Đạp', bgColor: 'bg-slate-50', iconColor: 'text-slate-600' },
    { name: 'Thời Trang Nữ', icon: '👗', href: '/products?category=Thời+Trang+Nữ', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { name: 'Bách Hóa', icon: '🛒', href: '/products?category=Bách+Hóa+Online', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    { name: 'Thể Thao', icon: '⚽', href: '/products?category=Thể+Thao+-+Dã+Ngoại', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { name: 'Thời Trang Nam', icon: '👔', href: '/products?category=Thời+Trang+Nam', bgColor: 'bg-sky-50', iconColor: 'text-sky-500' },
    { name: 'Hàng Quốc Tế', icon: '🌍', href: '/products?category=Hàng+Quốc+Tế', bgColor: 'bg-teal-50', iconColor: 'text-teal-500' },
    { name: 'Máy Vi Tính', icon: '💻', href: '/products?category=Máy+Vi+Tính', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
];

const colorPalette = [
    { bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
    { bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
    { bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    { bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
    { bgColor: 'bg-slate-50', iconColor: 'text-slate-600' },
    { bgColor: 'bg-red-50', iconColor: 'text-red-500' },
    { bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
    { bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
    { bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
    { bgColor: 'bg-teal-50', iconColor: 'text-teal-500' },
    { bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { bgColor: 'bg-sky-50', iconColor: 'text-sky-500' },
];

export default function CategoryGrid() {
    const [categories, setCategories] = useState(defaultCategories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data: Category[] = await res.json();
                    if (data.length > 0) {
                        const mapped = data.map((cat, index) => ({
                            name: cat.name.split(' - ')[0], // Short name
                            icon: cat.icon || '📦',
                            href: `/products?category=${encodeURIComponent(cat.name)}`,
                            ...colorPalette[index % colorPalette.length]
                        }));
                        setCategories(mapped);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="py-4 bg-white rounded-lg mb-4">
            <div className="px-4">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Danh Mục Nổi Bật</h2>

                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14 gap-2">
                    {categories.slice(0, 14).map((category, index) => (
                        <Link
                            key={category.name + index}
                            href={category.href}
                            className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <span className="text-2xl md:text-3xl">{category.icon}</span>
                            </div>
                            <span className="text-xs text-gray-600 text-center leading-tight group-hover:text-[#1a94ff] transition-colors line-clamp-2">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
