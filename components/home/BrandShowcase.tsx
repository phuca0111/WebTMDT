import Link from 'next/link';

interface Brand {
    id: number;
    name: string;
    color: string; // gradient color
    title: string;
    promo: string;
    promoColor: string;
}

const brands: Brand[] = [
    {
        id: 1,
        name: 'Huggies',
        color: 'from-pink-400 to-rose-500',
        title: 'Tuần lễ tã sữa',
        promo: 'Coupon 18%',
        promoColor: 'text-pink-600 bg-pink-50'
    },
    {
        id: 2,
        name: 'Tiki Trading',
        color: 'from-blue-400 to-indigo-500',
        title: 'Deal huyền thoại',
        promo: 'Giao Nhanh 2H',
        promoColor: 'text-blue-600 bg-blue-50'
    },
    {
        id: 3,
        name: 'Friso',
        color: 'from-yellow-400 to-orange-500',
        title: 'Friso chính hãng',
        promo: 'Coupon 200k',
        promoColor: 'text-orange-600 bg-orange-50'
    },
    {
        id: 4,
        name: 'Enfa',
        color: 'from-green-400 to-emerald-500',
        title: 'Enfa giảm 35%',
        promo: 'Mua là có quà',
        promoColor: 'text-green-600 bg-green-50'
    },
    {
        id: 5,
        name: 'Vinamilk',
        color: 'from-cyan-400 to-teal-500',
        title: 'Chợ rẻ cùng Tiki',
        promo: 'Freeship đến 100K',
        promoColor: 'text-teal-600 bg-teal-50'
    },
    {
        id: 6,
        name: 'Bobby',
        color: 'from-purple-400 to-violet-500',
        title: 'Bé khỏe mẹ nhàn',
        promo: 'Giá giảm đến 50%',
        promoColor: 'text-purple-600 bg-purple-50'
    },
    {
        id: 7,
        name: 'Nestle',
        color: 'from-red-400 to-rose-500',
        title: 'Dinh dưỡng toàn diện',
        promo: 'Coupon 15%',
        promoColor: 'text-red-600 bg-red-50'
    },
    {
        id: 8,
        name: 'Unilever',
        color: 'from-sky-400 to-blue-500',
        title: 'Gia đình khỏe mạnh',
        promo: 'Mua 2 giảm 30%',
        promoColor: 'text-sky-600 bg-sky-50'
    }
];

export default function BrandShowcase() {
    return (
        <section className="bg-white rounded-lg p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Thương hiệu nổi bật</h2>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${encodeURIComponent(brand.name)}`}
                        className="flex-shrink-0 w-[140px] group snap-start block"
                    >
                        {/* Image Container - Gradient Background */}
                        <div className={`relative rounded-xl overflow-hidden mb-2 aspect-[4/5] bg-gradient-to-br ${brand.color} flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300 shadow-sm`}>
                            {/* Brand Name as Visual */}
                            <div className="text-white text-center px-2">
                                <div className="text-2xl font-bold drop-shadow-lg">{brand.name.split(' ')[0]}</div>
                                {brand.name.split(' ')[1] && (
                                    <div className="text-sm font-medium opacity-90">{brand.name.split(' ').slice(1).join(' ')}</div>
                                )}
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <div className="text-[13px] text-gray-800 font-medium line-clamp-2 min-h-[36px] mb-1.5">
                                {brand.title}
                            </div>
                            <div className={`text-xs ${brand.promoColor} py-1 px-2.5 rounded-full inline-block font-medium`}>
                                {brand.promo}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
