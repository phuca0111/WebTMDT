'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Package, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const payment = searchParams.get('payment');
    const error = searchParams.get('error');
    const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (error) {
            setOrderStatus('error');
        } else if (orderId) {
            setOrderStatus('success');
        }
    }, [orderId, error]);

    if (!orderId && !error) {
        return (
            <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy đơn hàng</h1>
                <Link href="/products">
                    <Button className="mt-4">Quay lại mua sắm</Button>
                </Link>
            </div>
        );
    }

    if (orderStatus === 'error') {
        return (
            <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Thanh toán thất bại</h1>
                <p className="text-slate-500 mb-6">
                    Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                </p>
                {orderId && (
                    <p className="text-sm text-slate-400 mb-4">
                        Mã đơn hàng: <span className="font-mono">{orderId.slice(0, 8)}</span>
                    </p>
                )}
                <div className="flex flex-col gap-3">
                    <Link href="/checkout">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Thử thanh toán lại
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="w-full">
                            Quay lại mua sắm
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-500 mb-4">
                Cảm ơn bạn đã mua hàng tại nhom2team4dua
            </p>

            {orderId && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-500 mb-1">Mã đơn hàng</p>
                    <p className="font-mono font-bold text-lg text-indigo-600">{orderId.slice(0, 8).toUpperCase()}</p>
                </div>
            )}

            {payment === 'momo' && (
                <div className="flex items-center justify-center gap-2 bg-pink-50 text-pink-700 rounded-lg p-3 mb-6">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Đã thanh toán qua MoMo</span>
                </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin vận chuyển
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Đơn hàng sẽ được xử lý trong 24h</li>
                    <li>• Thời gian giao hàng: 2-5 ngày làm việc</li>
                    <li>• Bạn sẽ nhận thông báo khi đơn hàng được giao</li>
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                {orderId && (
                    <Link href={`/orders/${orderId}`}>
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                            Xem chi tiết đơn hàng
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                )}
                <Link href="/profile">
                    <Button variant="outline" className="w-full">
                        Xem lịch sử đơn hàng
                    </Button>
                </Link>
                <Link href="/products">
                    <Button variant="ghost" className="w-full text-gray-500">
                        Tiếp tục mua sắm
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12">
                <Suspense fallback={<LoadingFallback />}>
                    <OrderSuccessContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
