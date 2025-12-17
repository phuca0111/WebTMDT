import Image from 'next/image';
import Link from 'next/link';

const brands = [
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'Asus', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' },
    { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
    { name: 'Lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Lenovo_Global_Corporate_Logo.png' },
];

export default function BrandShowcase() {
    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Thương hiệu nổi bật</h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {brands.map((brand) => (
                    <Link
                        key={brand.name}
                        href={`/products?search=${encodeURIComponent(brand.name)}`}
                        className="group"
                    >
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-24 hover:border-indigo-200 hover:shadow-lg transition-all">
                            <div className="text-2xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                {brand.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
