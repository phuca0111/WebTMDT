'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCompareStore, useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowLeft, Star, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function ComparePage() {
    const { items, removeItem, clearCompare } = useCompareStore();
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
            stock: 100, // Mock stock or fetch if needed, assuming available
        });
        toast.success(`Đã thêm "${item.name}" vào giỏ hàng`);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="animate-pulse flex items-center justify-center h-64 text-gray-400">
                        Đang tải...
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb / Back */}
                <div className="mb-6">
                    <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-[#1a94ff]">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Tiếp tục mua sắm
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Scale className="w-6 h-6 text-[#1a94ff]" />
                                So Sánh Sản Phẩm
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {items.length > 0 ? `Đang so sánh ${items.length} sản phẩm` : 'Chưa có sản phẩm nào để so sánh'}
                            </p>
                        </div>
                        {items.length > 0 && (
                            <Button variant="outline" size="sm" onClick={() => clearCompare()} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4 mr-1" /> Xóa tất cả
                            </Button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="p-16 text-center">
                            <Scale className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Danh sách so sánh trống</h3>
                            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào danh sách để so sánh các thông số kỹ thuật.</p>
                            <Link href="/products">
                                <Button className="bg-[#1a94ff] hover:bg-[#0d5cb6]">
                                    Khám phá sản phẩm
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 min-w-[150px] bg-gray-50 border-r border-gray-100 text-gray-500 font-medium text-sm">
                                            Thông tin chung
                                        </th>
                                        {items.map((item) => (
                                            <th key={item.id} className="p-4 min-w-[250px] border-r border-gray-100 last:border-r-0 align-top">
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <div className="aspect-square relative mb-3 rounded-lg overflow-hidden border border-gray-100 bg-white">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <Link href={`/products/${item.id}`}>
                                                        <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-[#1a94ff] mb-2 min-h-[40px]">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-lg font-bold text-[#ff424e]">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6] text-xs h-9"
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Thêm vào giỏ
                                                    </Button>
                                                </div>
                                            </th>
                                        ))}
                                        {/* Fill empty columns if less than 3 */}
                                        {[...Array(3 - items.length)].map((_, i) => (
                                            <th key={`empty-${i}`} className="p-4 min-w-[250px] border-r border-gray-100 last:border-r-0 bg-gray-50/30 align-middle text-center">
                                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                                                    <Scale className="w-8 h-8 mb-2 opacity-50" />
                                                    <span className="text-sm">Thêm sản phẩm</span>
                                                    <Link href="/products" className="mt-3">
                                                        <Button variant="outline" size="sm" className="text-xs">
                                                            + Chọn
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    <tr className="border-t border-gray-100 bg-white hover:bg-gray-50/50">
                                        <td className="p-4 font-medium text-gray-500 border-r border-gray-100">Danh mục</td>
                                        {items.map((item) => (
                                            <td key={item.id} className="p-4 border-r border-gray-100 last:border-r-0 text-gray-900">
                                                {item.category}
                                            </td>
                                        ))}
                                        {[...Array(3 - items.length)].map((_, i) => <td key={i} className="border-r border-gray-100 last:border-r-0"></td>)}
                                    </tr>
                                    <tr className="border-t border-gray-100 bg-white hover:bg-gray-50/50">
                                        <td className="p-4 font-medium text-gray-500 border-r border-gray-100">Đánh giá</td>
                                        {items.map((item) => (
                                            <td key={item.id} className="p-4 border-r border-gray-100 last:border-r-0">
                                                <div className="flex items-center text-yellow-500">
                                                    <span className="font-bold mr-1">{item.avgRating?.toFixed(1) || '0'}</span>
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                </div>
                                            </td>
                                        ))}
                                        {[...Array(3 - items.length)].map((_, i) => <td key={i} className="border-r border-gray-100 last:border-r-0"></td>)}
                                    </tr>
                                    <tr className="border-t border-gray-100 bg-white hover:bg-gray-50/50">
                                        <td className="p-4 font-medium text-gray-500 border-r border-gray-100">Đã bán</td>
                                        {items.map((item) => (
                                            <td key={item.id} className="p-4 border-r border-gray-100 last:border-r-0 text-gray-900">
                                                {item.soldCount || 0}
                                            </td>
                                        ))}
                                        {[...Array(3 - items.length)].map((_, i) => <td key={i} className="border-r border-gray-100 last:border-r-0"></td>)}
                                    </tr>
                                    {/* Additional generic rows if needed */}
                                    <tr className="border-t border-gray-100 bg-white hover:bg-gray-50/50">
                                        <td className="p-4 font-medium text-gray-500 border-r border-gray-100">Tình trạng</td>
                                        {items.map((item) => (
                                            <td key={item.id} className="p-4 border-r border-gray-100 last:border-r-0 text-green-600 font-medium">
                                                Còn hàng
                                            </td>
                                        ))}
                                        {[...Array(3 - items.length)].map((_, i) => <td key={i} className="border-r border-gray-100 last:border-r-0"></td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
