import Link from 'next/link';
import { Smartphone, Laptop, Tablet, Headphones, Watch, Tv, Gamepad2, Gift, Shirt, Camera } from 'lucide-react';

const categories = [
    { name: 'Điện thoại', icon: Smartphone, href: '/products?category=Điện+thoại', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { name: 'Laptop', icon: Laptop, href: '/products?category=Laptop', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
    { name: 'Tablet', icon: Tablet, href: '/products?category=Tablet', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
    { name: 'Phụ kiện', icon: Headphones, href: '/products?category=Phụ+kiện', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    { name: 'Đồng hồ', icon: Watch, href: '/products?category=Phụ+kiện', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
    { name: 'Tivi', icon: Tv, href: '/products', bgColor: 'bg-slate-50', iconColor: 'text-slate-600' },
    { name: 'Gaming', icon: Gamepad2, href: '/products', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
    { name: 'Ưu đãi', icon: Gift, href: '/products', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
    { name: 'Thời trang', icon: Shirt, href: '/products', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { name: 'Camera', icon: Camera, href: '/products', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
];

export default function CategoryGrid() {
    return (
        <section className="py-4 bg-white rounded-lg mb-4">
            <div className="px-4">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Danh Mục Nổi Bật</h2>

                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <category.icon className={`h-6 w-6 md:h-7 md:w-7 ${category.iconColor}`} />
                            </div>
                            <span className="text-xs text-gray-600 text-center leading-tight group-hover:text-[#1a94ff] transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
