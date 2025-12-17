'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Ticket, X, Check, MapPin, Truck, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';

const checkoutSchema = z.object({
    customerName: z.string().min(2, 'Vui lòng nhập họ tên'),
    customerEmail: z.string().email('Email không hợp lệ'),
    customerPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    address: z.string().min(10, 'Địa chỉ quá ngắn'),
    paymentMethod: z.enum(['COD', 'MOMO', 'BANK']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface AppliedVoucher {
    id: string; code: string; description: string | null;
    discountType: 'PERCENT' | 'FIXED'; discountValue: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [applyingVoucher, setApplyingVoucher] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
    const [discount, setDiscount] = useState(0);
    const { items, getTotalPrice, clearCart } = useCartStore();
    const subtotal = getTotalPrice();
    const totalPrice = Math.max(0, subtotal - discount);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { paymentMethod: 'COD' },
    });

    const paymentMethod = watch('paymentMethod');

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return toast.error('Vui lòng nhập mã giảm giá');
        setApplyingVoucher(true);
        try {
            const res = await fetch('/api/vouchers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: voucherCode, subtotal }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAppliedVoucher(data.voucher);
            setDiscount(data.discount);
            toast.success('Áp dụng mã giảm giá thành công');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Lỗi áp dụng mã');
        } finally {
            setApplyingVoucher(false);
        }
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (items.length === 0) return toast.error('Giỏ hàng trống');
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
                    subtotal, discount, total: totalPrice, voucherId: appliedVoucher?.id || null,
                }),
            });
            if (!res.ok) throw new Error('Đặt hàng thất bại');
            const order = await res.json();

            if (data.paymentMethod === 'MOMO') {
                const momoRes = await fetch('/api/payment/momo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: order.id }),
                });
                const momoData = await momoRes.json();
                if (!momoRes.ok) throw new Error(momoData.error || 'Lỗi MoMo');
                clearCart();
                window.location.href = momoData.payUrl;
                return;
            }

            clearCart();
            router.push(`/order-success?orderId=${order.id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) return null; // Or redirect

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />
            <main className="flex-1 py-4">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="text-gray-500 hover:text-[#1a94ff]">Trang chủ</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Link href="/cart" className="text-gray-500 hover:text-[#1a94ff]">Giỏ hàng</Link>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-800">Thanh toán</span>
                    </nav>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-4">
                        {/* Left Column */}
                        <div className="flex-1 space-y-4">
                            {/* Delivery Address */}
                            <div className="bg-white rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-[#1a94ff]" /> Địa chỉ nhận hàng
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Họ và tên</Label>
                                            <Input {...register('customerName')} placeholder="Nhập họ tên" />
                                            {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Số điện thoại</Label>
                                            <Input {...register('customerPhone')} placeholder="Nhập số điện thoại" />
                                            {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Email</Label>
                                        <Input {...register('customerEmail')} placeholder="Nhập email" />
                                        {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Địa chỉ chi tiết</Label>
                                        <Input {...register('address')} placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã..." />
                                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
                                <RadioGroup value={paymentMethod} onValueChange={(val) => setValue('paymentMethod', val as any)}>
                                    <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${paymentMethod === 'COD' ? 'border-[#1a94ff] bg-blue-50' : ''}`}>
                                        <RadioGroupItem value="COD" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-3">
                                            <Image src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png" alt="COD" width={32} height={32} />
                                            <span>Thanh toán tiền mặt khi nhận hàng (COD)</span>
                                        </Label>
                                    </div>
                                    <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${paymentMethod === 'MOMO' ? 'border-[#1a94ff] bg-blue-50' : ''}`}>
                                        <RadioGroupItem value="MOMO" id="momo" />
                                        <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-3">
                                            <Image src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" width={32} height={32} className="rounded" />
                                            <span>Thanh toán bằng ví MoMo</span>
                                        </Label>
                                    </div>
                                    <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${paymentMethod === 'BANK' ? 'border-[#1a94ff] bg-blue-50' : ''}`}>
                                        <RadioGroupItem value="BANK" id="bank" />
                                        <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center gap-3">
                                            <Image src="https://img.icons8.com/color/48/bank-card-back-side.png" alt="Bank" width={32} height={32} />
                                            <span>Chuyển khoản ngân hàng (QR Code)</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Link href="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-[#1a94ff]">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại giỏ hàng
                            </Link>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-[320px] space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Đơn hàng</h3>
                                    <Link href="/cart" className="text-sm text-[#1a94ff]">Sửa</Link>
                                </div>
                                <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-1">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-3 text-sm">
                                            <span className="text-[#1a94ff] font-bold">x{item.quantity}</span>
                                            <span className="flex-1 line-clamp-2 text-gray-700">{item.name}</span>
                                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-dashed my-3"></div>

                                {/* Discount */}
                                <div className="bg-gray-50 rounded p-3 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium flex items-center gap-1"><Ticket className="h-4 w-4 text-[#1a94ff]" /> Mã giảm giá</span>
                                        {appliedVoucher && <button type="button" onClick={() => { setAppliedVoucher(null); setDiscount(0); }} className="text-xs text-red-500">Xóa</button>}
                                    </div>
                                    {!appliedVoucher ? (
                                        <div className="flex gap-2">
                                            <Input
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value)}
                                                placeholder="Nhập mã"
                                                className="h-8 text-sm bg-white"
                                            />
                                            <Button type="button" size="sm" onClick={handleApplyVoucher} disabled={applyingVoucher} className="h-8 bg-[#1a94ff] hover:bg-[#0d5cb6]">
                                                {applyingVoucher ? '...' : 'Áp dụng'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <Check className="h-3 w-3" /> Đã giảm {formatPrice(discount)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-600">0đ</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t my-3 pt-3 flex justify-between items-end">
                                    <span className="font-medium text-gray-800">Tổng tiền</span>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-[#ff424e]">{formatPrice(totalPrice)}</span>
                                        <p className="text-xs text-gray-500">(Đã bao gồm VAT)</p>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-[#ff424e] hover:bg-[#ee3a46] h-11 text-base font-medium mt-2" disabled={isLoading}>
                                    {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                                </Button>
                            </div>

                            <div className="bg-white rounded-lg p-3 text-xs text-gray-500 flex items-start gap-2">
                                <Truck className="h-4 w-4 text-[#1a94ff] flex-shrink-0" />
                                <span>Được đổi trả nếu hàng không đúng mô tả. Xem thêm chính sách đổi trả.</span>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

