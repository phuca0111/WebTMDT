'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, ExternalLink, QrCode, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoMoPaymentProps {
    orderId: string;
    amount: number;
    onBack: () => void;
}

export default function MoMoPayment({ orderId, amount, onBack }: MoMoPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [payUrl, setPayUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/payment/momo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Lỗi tạo thanh toán');
            }

            setPayUrl(data.payUrl);

            // Auto redirect to MoMo
            window.location.href = data.payUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi kết nối MoMo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">M</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Thanh toán MoMo</h2>
                <p className="text-slate-500 mt-1">Đơn hàng #{orderId.slice(0, 8)}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-pink-600">Số tiền thanh toán</p>
                <p className="text-2xl font-bold text-pink-700">
                    {amount.toLocaleString('vi-VN')}đ
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-sm">
                    {error}
                </div>
            )}

            {payUrl ? (
                <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <QrCode className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Đang chuyển hướng đến MoMo...</p>
                    </div>
                    <a href={payUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Mở trang thanh toán MoMo
                        </Button>
                    </a>
                </div>
            ) : (
                <div className="space-y-3">
                    <Button
                        onClick={handleCreatePayment}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang tạo thanh toán...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">📱</span>
                                Thanh toán với MoMo
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="w-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Chọn phương thức khác
                    </Button>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                    <span>🔒</span>
                    <span>Thanh toán an toàn qua MoMo</span>
                </div>
            </div>
        </div>
    );
}
