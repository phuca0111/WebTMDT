'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function OrderLookupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!email.trim() || !orderId.trim()) {
                throw new Error('Vui lòng nhập đầy đủ thông tin');
            }

            // Fetch order
            const res = await fetch(`/api/orders/lookup?email=${encodeURIComponent(email)}&orderId=${encodeURIComponent(orderId)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Không tìm thấy đơn hàng');
            }

            // Redirect to order detail page
            router.push(`/orders/${data.id}`);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1a94ff] to-[#0d5cb6] mb-4">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Tra cứu đơn hàng</h1>
                            <p className="text-gray-500 mt-2">Nhập email và mã đơn hàng để xem chi tiết</p>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email đặt hàng</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="orderId">Mã đơn hàng</Label>
                                    <Input
                                        id="orderId"
                                        type="text"
                                        placeholder="Ví dụ: a1b2c3d4"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Mã đơn hàng được gửi trong email xác nhận</p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Đang tìm kiếm...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Search className="h-4 w-4" />
                                            Tra cứu đơn hàng
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500 mb-3">Đã có tài khoản?</p>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full">
                                        Đăng nhập để xem lịch sử
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Không tìm thấy đơn hàng?</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Kiểm tra lại email đã dùng khi đặt hàng</li>
                                <li>• Mã đơn hàng có trong email xác nhận đơn</li>
                                <li>• Liên hệ hotline: <strong>1900 1234</strong></li>
                            </ul>
                        </div>

                        <div className="text-center mt-6">
                            <Link href="/" className="text-[#1a94ff] hover:underline text-sm flex items-center justify-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Quay về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
