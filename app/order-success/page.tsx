'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đặt hàng thành công!
            </h1>

            <p className="text-gray-600 mb-4">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            {orderId && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-mono font-bold text-gray-900">{orderId}</p>
                </div>
            )}

            <div className="space-y-3">
                <p className="text-sm text-gray-500">
                    Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/products" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                        <Package className="h-4 w-4" />
                        Tiếp tục mua sắm
                    </Button>
                </Link>
                <Link href="/" className="flex-1">
                    <Button className="w-full gap-2">
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center bg-gray-50 py-16">
                <Suspense fallback={<div>Loading...</div>}>
                    <OrderSuccessContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
