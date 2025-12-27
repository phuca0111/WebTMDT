'use client';

import Link from 'next/link';
import { Flame } from 'lucide-react';

// Deals/Khuyến mãi - mỗi cái link đến trang riêng
const deals = [
    {
        name: 'Hot Coupon',
        subtext: 'Mỗi Ngày',
        icon: '🎫',
        href: '/deals/hot-coupon',
        bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    },
    {
        name: 'Deal Sốc',
        subtext: 'Giảm 50%',
        icon: '⚡',
        href: '/deals/deal-soc',
        bgColor: 'bg-gradient-to-br from-red-100 to-red-200',
    },
    {
        name: 'Combo Nhà',
        subtext: 'Dùng',
        icon: '📦',
        href: '/deals/combo-nha',
        bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
    },
    {
        name: 'Rẻ Mỗi',
        subtext: 'Ngày',
        icon: '🏷️',
        href: '/deals/re-moi-ngay',
        bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    },
    {
        name: 'Chăm Sóc',
        subtext: 'Da',
        icon: '✨',
        href: '/deals/cham-soc-da',
        bgColor: 'bg-gradient-to-br from-rose-100 to-rose-200',
    },
    {
        name: 'Xả Kho',
        subtext: 'Giảm 50%',
        icon: '🎁',
        href: '/deals/xa-kho',
        bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
    },
    {
        name: 'Tiệc Sách',
        subtext: 'Cuối Năm',
        icon: '📚',
        href: '/deals/tiec-sach',
        bgColor: 'bg-gradient-to-br from-red-100 to-orange-200',
    },
    {
        name: 'Điện Máy',
        subtext: 'Giảm 50%',
        icon: '🖥️',
        href: '/deals/dien-may',
        bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    },
];

export default function DealsGrid() {
    return (
        <section className="py-3 bg-white rounded-lg mb-2">
            <div className="px-4">
                <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h2 className="text-base font-semibold text-gray-800">Khuyến Mãi Hot</h2>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {deals.map((deal, index) => (
                        <Link
                            key={deal.name + index}
                            href={deal.href}
                            className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-md transition-all"
                        >
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${deal.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
                                <span className="text-2xl md:text-3xl">{deal.icon}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-medium text-gray-700 block leading-tight group-hover:text-[#1a94ff] transition-colors">
                                    {deal.name}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {deal.subtext}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
