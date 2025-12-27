'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Ticket, X, Check, MapPin, Truck, ChevronRight, LogIn, Loader2 } from 'lucide-react';
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

interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [applyingVoucher, setApplyingVoucher] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
    const [discount, setDiscount] = useState(0);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const { items, getTotalPrice, clearCart } = useCartStore();
    const subtotal = getTotalPrice();
    const totalPrice = Math.max(0, subtotal - discount);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { paymentMethod: 'COD' },
    });

    const paymentMethod = watch('paymentMethod');

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (data.user) {
                    setUser(data.user);
                    // Auto-fill form with user data
                    setValue('customerName', data.user.name || '');
                    setValue('customerEmail', data.user.email || '');
                    if (data.user.phone) setValue('customerPhone', data.user.phone);
                    if (data.user.address) setValue('address', data.user.address);
                } else {
                    // Not logged in, redirect to login
                    router.push('/login?returnUrl=/checkout');
                    return;
                }
            } catch (error) {
                // Error checking auth, redirect to login
                router.push('/login?returnUrl=/checkout');
                return;
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router, setValue]);

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

            // Xóa giỏ hàng và chuyển đến trang thành công
            clearCart();
            router.push(`/order-success?orderId=${order.id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1a94ff] mx-auto mb-4" />
                        <p className="text-gray-500">Đang kiểm tra đăng nhập...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // If not logged in (shouldn't reach here due to redirect, but just in case)
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center bg-white rounded-2xl p-8 shadow-sm max-w-md">
                        <LogIn className="h-12 w-12 text-[#1a94ff] mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
                        <p className="text-gray-500 mb-6">Bạn cần đăng nhập để tiếp tục thanh toán</p>
                        <Link href="/login?returnUrl=/checkout">
                            <Button className="bg-[#1a94ff] hover:bg-[#0d5cb6]">
                                Đăng nhập ngay
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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

                                {/* MoMo Payment Info */}
                                {paymentMethod === 'MOMO' && (
                                    <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Image src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" width={24} height={24} className="rounded" />
                                            <span className="font-semibold text-pink-700">Thanh toán qua MoMo</span>
                                        </div>

                                        {!paymentConfirmed ? (
                                            <>
                                                <div className="bg-white rounded-lg p-4 text-center">
                                                    <img
                                                        src="/momo-qr.png"
                                                        alt="MoMo QR Code"
                                                        className="w-48 h-48 mx-auto mb-3 rounded-lg"
                                                    />
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between px-4">
                                                            <span className="text-gray-500">Số điện thoại:</span>
                                                            <span className="font-bold text-pink-600">0939061833</span>
                                                        </div>
                                                        <div className="flex justify-between px-4">
                                                            <span className="text-gray-500">Chủ tài khoản:</span>
                                                            <span className="font-bold">TRẦN PHAN TẤN PHÚC</span>
                                                        </div>
                                                        <div className="flex justify-between px-4">
                                                            <span className="text-gray-500">Số tiền:</span>
                                                            <span className="font-bold text-[#1a94ff]">{formatPrice(totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-3">
                                                        Quét mã QR hoặc chuyển khoản đến số điện thoại trên
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        setConfirmingPayment(true);
                                                        // Mô phỏng đang xác nhận
                                                        await new Promise(resolve => setTimeout(resolve, 2000));
                                                        setPaymentConfirmed(true);
                                                        setConfirmingPayment(false);
                                                        toast.success('Xác nhận thanh toán thành công!');
                                                    }}
                                                    disabled={confirmingPayment}
                                                    className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {confirmingPayment ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            Đang xác nhận thanh toán...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="h-5 w-5" />
                                                            Tôi đã chuyển tiền
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Check className="h-8 w-8 text-green-600" />
                                                </div>
                                                <h4 className="font-bold text-green-700 text-lg">Thanh toán thành công!</h4>
                                                <p className="text-sm text-green-600 mt-1">Bấm "Hoàn tất đặt hàng" để xác nhận đơn</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bank Transfer Info */}
                                {paymentMethod === 'BANK' && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Image src="https://img.icons8.com/color/48/bank-card-back-side.png" alt="Bank" width={24} height={24} />
                                            <span className="font-semibold text-blue-700">Thông tin chuyển khoản ngân hàng</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 text-center">
                                            {/* Bank QR Code */}
                                            <img
                                                src={`https://img.vietqr.io/image/MB-0939061833-compact.png?amount=${totalPrice}&addInfo=Thanh%20toan%20don%20hang`}
                                                alt="Bank QR Code"
                                                className="w-48 h-48 mx-auto mb-3 rounded-lg"
                                            />
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between px-4">
                                                    <span className="text-gray-500">Ngân hàng:</span>
                                                    <span className="font-bold text-blue-600">MB Bank</span>
                                                </div>
                                                <div className="flex justify-between px-4">
                                                    <span className="text-gray-500">Số tài khoản:</span>
                                                    <span className="font-bold">0939061833</span>
                                                </div>
                                                <div className="flex justify-between px-4">
                                                    <span className="text-gray-500">Chủ tài khoản:</span>
                                                    <span className="font-bold">TRẦN PHAN TẤN PHÚC</span>
                                                </div>
                                                <div className="flex justify-between px-4">
                                                    <span className="text-gray-500">Số tiền:</span>
                                                    <span className="font-bold text-[#1a94ff]">{formatPrice(totalPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2 text-center">
                                            * Sau khi chuyển khoản, đơn hàng sẽ được xác nhận trong vòng 5-10 phút
                                        </p>
                                    </div>
                                )}
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

