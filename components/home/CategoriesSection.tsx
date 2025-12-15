import Link from 'next/link';
import { Smartphone, Laptop, Tablet, Headphones } from 'lucide-react';

const categories = [
    {
        name: 'Điện thoại',
        description: 'iPhone, Samsung, Android',
        icon: Smartphone,
        href: '/products?category=Điện+thoại',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Laptop',
        description: 'MacBook, Windows, Gaming',
        icon: Laptop,
        href: '/products?category=Laptop',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        name: 'Tablet',
        description: 'iPad, Android Tablet',
        icon: Tablet,
        href: '/products?category=Tablet',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        name: 'Phụ kiện',
        description: 'Tai nghe, AirPods, Đồng hồ',
        icon: Headphones,
        href: '/products?category=Phụ+kiện',
        gradient: 'from-green-500 to-teal-500',
    },
];

export default function CategoriesSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Danh mục sản phẩm</h2>
                    <p className="text-gray-600 mt-2">Tìm kiếm theo danh mục yêu thích của bạn</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                {/* Icon */}
                                <div className={`inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-4 mb-4`}>
                                    <Icon className="h-6 w-6 text-white" />
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
