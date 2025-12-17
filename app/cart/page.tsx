'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, Truck, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-4 py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                        <h1 className="text-xl font-medium text-gray-800 mb-2">Giỏ hàng trống</h1>
                        <p className="text-gray-500 mb-6 text-sm">
                            Bạn chưa có sản phẩm nào trong giỏ hàng
                        </p>
                        <Link href="/products">
                            <Button className="bg-[#1a94ff] hover:bg-[#0d5cb6]">
                                Tiếp tục mua sắm
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />
            <main className="flex-1 py-4">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="text-gray-500 hover:text-[#1a94ff]">Trang chủ</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-800">Giỏ hàng ({totalItems})</span>
                    </nav>

                    <div className="flex gap-4">
                        {/* Cart Items */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="bg-white rounded-lg p-4 mb-2">
                                <div className="flex items-center gap-4">
                                    <Checkbox id="selectAll" />
                                    <label htmlFor="selectAll" className="text-sm font-medium text-gray-800 flex-1">
                                        Tất cả ({items.length} sản phẩm)
                                    </label>
                                    <span className="text-sm text-gray-500 hidden sm:block w-24 text-center">Đơn giá</span>
                                    <span className="text-sm text-gray-500 hidden sm:block w-32 text-center">Số lượng</span>
                                    <span className="text-sm text-gray-500 hidden sm:block w-24 text-center">Thành tiền</span>
                                    <span className="w-8"></span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-white rounded-lg divide-y">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center gap-4">
                                        <Checkbox />

                                        {/* Image */}
                                        <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                                                <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                                            </div>
                                        </Link>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.id}`} className="text-sm text-gray-800 hover:text-[#1a94ff] line-clamp-2">
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-green-600 flex items-center gap-1">
                                                    <Truck className="h-3 w-3" /> Freeship
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="hidden sm:block w-24 text-center">
                                            <span className="text-sm font-medium text-[#ff424e]">{formatPrice(item.price)}</span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="hidden sm:flex w-32 justify-center">
                                            <div className="flex items-center border rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-10 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile: Price + Qty */}
                                        <div className="sm:hidden text-right">
                                            <p className="text-sm font-medium text-[#ff424e]">{formatPrice(item.price)}</p>
                                            <div className="flex items-center border rounded mt-1 inline-flex">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                                                <span className="w-6 text-center text-xs">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="hidden sm:block w-24 text-center">
                                            <span className="text-sm font-bold text-[#ff424e]">{formatPrice(item.price * item.quantity)}</span>
                                        </div>

                                        {/* Delete */}
                                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="hidden lg:block w-[300px] flex-shrink-0">
                            <div className="bg-white rounded-lg p-4 sticky top-28">
                                {/* Shipping Address */}
                                <div className="mb-4 pb-4 border-b">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-500">Giao tới</span>
                                        <Link href="#" className="text-[#1a94ff]">Thay đổi</Link>
                                    </div>
                                    <p className="text-sm font-medium">Hồ Chí Minh, Việt Nam</p>
                                </div>

                                {/* Promotion */}
                                <div className="mb-4 pb-4 border-b">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Khuyến mãi</span>
                                        <Link href="#" className="text-[#1a94ff]">Chọn hoặc nhập mã</Link>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tạm tính</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Giảm giá</span>
                                        <span className="text-green-600">-0đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phí vận chuyển</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 border-t">
                                    <span className="font-medium">Tổng tiền</span>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-[#ff424e]">{formatPrice(totalPrice)}</span>
                                        <p className="text-xs text-gray-500">(Đã bao gồm VAT)</p>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full bg-[#ff424e] hover:bg-[#ee3a46] h-12 text-base">
                                        Mua Hàng ({totalItems})
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Bottom Bar */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-4 z-40">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Tổng tiền</p>
                            <p className="text-lg font-bold text-[#ff424e]">{formatPrice(totalPrice)}</p>
                        </div>
                        <Link href="/checkout">
                            <Button className="bg-[#ff424e] hover:bg-[#ee3a46] px-8">
                                Mua Hàng ({totalItems})
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <div className="lg:hidden h-20"></div>
            <Footer />
        </div>
    );
}
