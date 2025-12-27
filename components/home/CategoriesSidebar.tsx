'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

// Icon mapping cho từng category
const categoryIcons: Record<string, string> = {
    'Nhà Sách': '📚',
    'Nhà Cửa - Đời Sống': '🏠',
    'Điện Thoại - Máy Tính Bảng': '📱',
    'Đồ Chơi - Mẹ & Bé': '🧸',
    'Thiết Bị Số - Phụ Kiện': '🎧',
    'Điện Gia Dụng': '🔌',
    'Làm Đẹp - Sức Khỏe': '💄',
    'Ô Tô - Xe Máy - Xe Đạp': '🏍️',
    'Thời Trang Nữ': '👗',
    'Bách Hóa Online': '🛒',
    'Thể Thao - Dã Ngoại': '⚽',
    'Thời Trang Nam': '👔',
    'Hàng Quốc Tế': '🌍',
    'Máy Vi Tính': '💻',
};

export default function CategoriesSidebar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-4 w-full h-full flex flex-col">
                <div className="space-y-3 flex-1 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm w-full h-full flex flex-col">
            {/* Header */}
            <div className="px-6 pt-3 pb-2 flex-shrink-0">
                <span className="font-bold text-gray-800 text-[15px]">Danh mục</span>
            </div>

            {/* Categories List */}
            <div className="py-0 pb-2 scrollbar-hide flex-1 overflow-y-auto min-h-0">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${encodeURIComponent(category.name)}`}
                        className={`flex items-center gap-3 px-6 py-2 hover:bg-blue-50 transition-colors group ${hoveredCategory === category.id ? 'bg-blue-50' : ''
                            }`}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <span className="text-xl w-8 text-center">
                            {categoryIcons[category.name] || category.icon || '📦'}
                        </span>
                        <span className="text-sm text-gray-700 flex-1 group-hover:text-[#1a94ff] transition-colors">
                            {category.name}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-all ${hoveredCategory === category.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                            }`} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
