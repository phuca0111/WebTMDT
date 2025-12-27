'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddToCart = (item: typeof items[0]) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            stock: 999, // Default stock for wishlist items
        });
        toast.success(`Đã thêm "${item.name}" vào giỏ hàng`);
    };

    const handleRemove = (id: string, name: string) => {
        removeItem(id);
        toast.info(`Đã xóa "${name}" khỏi yêu thích`);
    };

    const handleMoveAllToCart = () => {
        items.forEach((item) => {
            addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                stock: 999, // Default stock for wishlist items
            });
        });
        clearWishlist();
        toast.success('Đã thêm tất cả vào giỏ hàng!');
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-slate-500">Đang tải...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Tiếp tục mua sắm
                    </Link>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <Heart className="h-6 w-6 text-white fill-current" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Sản phẩm yêu thích</h1>
                                <p className="text-slate-500">{items.length} sản phẩm</p>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        clearWishlist();
                                        toast.info('Đã xóa tất cả');
                                    }}
                                    className="text-slate-500"
                                >
                                    Xóa tất cả
                                </Button>
                                <Button
                                    onClick={handleMoveAllToCart}
                                    className="bg-gradient-to-r from-indigo-600 to-blue-600"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Thêm tất cả vào giỏ
                                </Button>
                            </div>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <Heart className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                Chưa có sản phẩm yêu thích
                            </h2>
                            <p className="text-slate-500 mb-6">
                                Hãy thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi!
                            </p>
                            <Link href="/products">
                                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600">
                                    Khám phá sản phẩm
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <Link href={`/products/${item.id}`}>
                                        <div className="relative aspect-square bg-slate-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <span className="text-xs text-slate-500">{item.category}</span>
                                        <Link href={`/products/${item.id}`}>
                                            <h3 className="font-semibold text-slate-800 line-clamp-2 mt-1 mb-2 group-hover:text-indigo-600">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="font-bold text-indigo-600 mb-4">
                                            {formatPrice(item.price)}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleAddToCart(item)}
                                                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600"
                                                size="sm"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Mua
                                            </Button>
                                            <Button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                variant="outline"
                                                size="sm"
                                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
