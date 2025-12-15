'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';

const checkoutSchema = z.object({
    customerName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    customerEmail: z.string().email('Email không hợp lệ'),
    customerPhone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
    address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
    paymentMethod: z.enum(['COD', 'MOMO', 'BANK']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { items, getTotalPrice, clearCart } = useCartStore();
    const totalPrice = getTotalPrice();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: 'COD',
        },
    });

    const onSubmit = async (data: CheckoutFormData) => {
        if (items.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    items: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    total: totalPrice,
                }),
            });

            if (!response.ok) {
                throw new Error('Đặt hàng thất bại');
            }

            const order = await response.json();

            clearCart();
            toast.success('Đặt hàng thành công!');
            router.push(`/order-success?orderId=${order.id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md mx-auto px-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
                        <p className="text-gray-600 mb-6">
                            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
                        </p>
                        <Link href="/products">
                            <Button size="lg">Mua sắm ngay</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại giỏ hàng
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-4">Thông tin người nhận</h2>

                                    <div className="grid gap-4">
                                        <div>
                                            <Label htmlFor="customerName">Họ và tên *</Label>
                                            <Input
                                                id="customerName"
                                                placeholder="Nguyễn Văn A"
                                                {...register('customerName')}
                                                className="mt-1"
                                            />
                                            {errors.customerName && (
                                                <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="customerEmail">Email *</Label>
                                                <Input
                                                    id="customerEmail"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    {...register('customerEmail')}
                                                    className="mt-1"
                                                />
                                                {errors.customerEmail && (
                                                    <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="customerPhone">Số điện thoại *</Label>
                                                <Input
                                                    id="customerPhone"
                                                    placeholder="0901234567"
                                                    {...register('customerPhone')}
                                                    className="mt-1"
                                                />
                                                {errors.customerPhone && (
                                                    <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Địa chỉ nhận hàng *</Label>
                                            <Input
                                                id="address"
                                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                                {...register('address')}
                                                className="mt-1"
                                            />
                                            {errors.address && (
                                                <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

                                    <Select
                                        defaultValue="COD"
                                        onValueChange={(value) => setValue('paymentMethod', value as 'COD' | 'MOMO' | 'BANK')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="COD">💵 Thanh toán khi nhận hàng (COD)</SelectItem>
                                            <SelectItem value="MOMO">📱 Ví MoMo</SelectItem>
                                            <SelectItem value="BANK">🏦 Chuyển khoản ngân hàng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                                                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tạm tính</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển</span>
                                            <span className="text-green-600">Miễn phí</span>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Tổng cộng</span>
                                        <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-6"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Đặt hàng
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
