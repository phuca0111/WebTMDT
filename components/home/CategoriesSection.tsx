'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
}

const defaultCategories = [
    { name: 'Nhà Sách', description: 'Sách, truyện, văn phòng phẩm', icon: '📚', gradient: 'from-amber-500 to-orange-500' },
    { name: 'Điện Thoại', description: 'iPhone, Samsung, Xiaomi', icon: '📱', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Thiết Bị Số', description: 'Tai nghe, loa, phụ kiện', icon: '🎧', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Thời Trang', description: 'Quần áo nam nữ', icon: '👗', gradient: 'from-rose-500 to-pink-500' },
    { name: 'Làm Đẹp', description: 'Mỹ phẩm, skincare', icon: '💄', gradient: 'from-pink-500 to-red-500' },
    { name: 'Thể Thao', description: 'Dụng cụ, trang phục', icon: '⚽', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Máy Vi Tính', description: 'PC, laptop, linh kiện', icon: '💻', gradient: 'from-slate-500 to-gray-600' },
    { name: 'Bách Hóa', description: 'Thực phẩm, đồ dùng', icon: '🛒', gradient: 'from-teal-500 to-cyan-500' },
];

const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-green-500',
];

export default function CategoriesSection() {
    const [categories, setCategories] = useState(defaultCategories);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data: Category[] = await res.json();
                    if (data.length > 0) {
                        const mapped = data.slice(0, 8).map((cat, index) => ({
                            name: cat.name.split(' - ')[0],
                            description: cat.description || cat.name,
                            icon: cat.icon || '📦',
                            gradient: gradients[index % gradients.length],
                            href: `/products?category=${encodeURIComponent(cat.name)}`
                        }));
                        setCategories(mapped);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Danh mục sản phẩm</h2>
                    <p className="text-gray-600 mt-2">Tìm kiếm theo danh mục yêu thích của bạn</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.name + index}
                            href={`/products?category=${encodeURIComponent(category.name)}`}
                            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Icon */}
                            <div className={`inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-4 mb-4`}>
                                <span className="text-2xl">{category.icon}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {category.description}
                            </p>

                            {/* Decorative gradient */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center text-[#1a94ff] hover:underline font-medium"
                    >
                        Xem tất cả danh mục →
                    </Link>
                </div>
            </div>
        </section>
    );
}
