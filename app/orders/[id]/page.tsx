'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, CreditCard, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatDate } from '@/lib/format';
import dynamic from 'next/dynamic';

// Dynamic import để tránh lỗi SSR với react-pdf
const InvoiceDownloadButton = dynamic(() => import('@/components/InvoiceDownloadButton'), {
    ssr: false,
    loading: () => <Button variant="outline" disabled>Đang tải...</Button>
});

interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: {
        id: string;
        name: string;
        image: string;
    };
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    subtotal: string;
    discount: string;
    total: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

// Steps cho thanh toán Online (có bước "Đã thanh toán")
const onlinePaymentSteps = [
    { key: 'PENDING', label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-500' },
    { key: 'PAID', label: 'Đã thanh toán', icon: CreditCard, color: 'text-blue-500' },
    { key: 'PROCESSING', label: 'Đang xử lý', icon: Package, color: 'text-purple-500' },
    { key: 'SHIPPING', label: 'Đang giao hàng', icon: Truck, color: 'text-cyan-500' },
    { key: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle, color: 'text-green-500' },
];

// Steps cho COD (không có bước "Đã thanh toán" - thanh toán khi nhận hàng)
const codSteps = [
    { key: 'PENDING', label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-500' },
    { key: 'PROCESSING', label: 'Đang xử lý', icon: Package, color: 'text-purple-500' },
    { key: 'SHIPPING', label: 'Đang giao hàng', icon: Truck, color: 'text-cyan-500' },
    { key: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle, color: 'text-green-500' },
];

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PAID: 'bg-blue-100 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-700 border-purple-200',
    SHIPPING: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const paymentMethods: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    MOMO: 'Ví MoMo',
    ZALOPAY: 'Ví ZaloPay',
    VNPAY: 'VNPay',
    BANK: 'Chuyển khoản ngân hàng',
};

// Hàm lấy steps phù hợp với payment method
function getStatusSteps(paymentMethod: string) {
    return paymentMethod === 'COD' ? codSteps : onlinePaymentSteps;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`);
                if (!res.ok) {
                    throw new Error('Không tìm thấy đơn hàng');
                }
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const getCurrentStepIndex = () => {
        if (!order) return -1;
        if (order.status === 'CANCELLED') return -1;
        const steps = getStatusSteps(order.paymentMethod);
        return steps.findIndex(step => step.key === order.status);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a94ff]"></div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-16">
                            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{error || 'Không tìm thấy đơn hàng'}</h2>
                            <p className="text-gray-500 mb-6">Vui lòng kiểm tra lại mã đơn hàng</p>
                            <Link href="/profile">
                                <Button>Quay lại trang cá nhân</Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                            <p className="text-sm text-gray-500">Mã đơn: #{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <Badge className={`ml-auto ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status === 'CANCELLED' ? 'Đã hủy' : getStatusSteps(order.paymentMethod).find((s: { key: string }) => s.key === order.status)?.label || order.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Timeline */}
                            {order.status !== 'CANCELLED' && (() => {
                                const statusSteps = getStatusSteps(order.paymentMethod);
                                return (
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Trạng thái đơn hàng</h2>
                                        <div className="relative">
                                            {/* Progress Line */}
                                            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-full bg-[#1a94ff] rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%` }}
                                                />
                                            </div>

                                            {/* Steps */}
                                            <div className="relative flex justify-between">
                                                {statusSteps.map((step, index) => {
                                                    const isCompleted = index <= currentStepIndex;
                                                    const isCurrent = index === currentStepIndex;
                                                    const Icon = step.icon;

                                                    return (
                                                        <div key={step.key} className="flex flex-col items-center">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                                ? 'bg-[#1a94ff] text-white'
                                                                : 'bg-gray-200 text-gray-400'
                                                                } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-[#1a94ff] font-medium' : 'text-gray-400'}`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-700">
                                                <span className="font-medium">Cập nhật lúc:</span> {formatDate(order.updatedAt)}
                                            </p>
                                            {order.status === 'SHIPPING' && (
                                                <p className="text-sm text-blue-700 mt-1">
                                                    <span className="font-medium">Dự kiến giao hàng:</span> 2-3 ngày làm việc
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Cancelled Order Notice */}
                            {order.status === 'CANCELLED' && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="h-8 w-8 text-red-500" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-700">Đơn hàng đã bị hủy</h3>
                                            <p className="text-sm text-red-600">Đơn hàng này đã được hủy vào {formatDate(order.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm ({order.items.length})</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/products/${item.product.id}`} className="text-sm font-medium text-gray-800 hover:text-[#1a94ff] line-clamp-2">
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[#1a94ff]">{formatPrice(Number(item.price) * item.quantity)}</p>
                                                <p className="text-xs text-gray-400">{formatPrice(Number(item.price))} / cái</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin nhận hàng</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{order.customerPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{order.customerEmail}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <span className="text-sm">{order.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thanh toán</h2>
                                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                    <p className="text-sm text-gray-600">{paymentMethods[order.paymentMethod] || order.paymentMethod}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tạm tính</span>
                                        <span className="text-gray-700">{formatPrice(Number(order.subtotal))}</span>
                                    </div>
                                    {Number(order.discount) > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Giảm giá</span>
                                            <span className="text-green-600">-{formatPrice(Number(order.discount))}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Phí vận chuyển</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-800">Tổng cộng</span>
                                            <span className="font-bold text-lg text-[#1a94ff]">{formatPrice(Number(order.total))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Time */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thời gian</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Đặt hàng</span>
                                        <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cập nhật</span>
                                        <span className="text-gray-700">{formatDate(order.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {/* Download Invoice */}
                                <InvoiceDownloadButton order={{
                                    id: order.id,
                                    customerName: order.customerName,
                                    customerEmail: order.customerEmail,
                                    customerPhone: order.customerPhone,
                                    address: order.address,
                                    subtotal: Number(order.subtotal),
                                    discount: Number(order.discount),
                                    total: Number(order.total),
                                    status: order.status,
                                    paymentMethod: order.paymentMethod,
                                    createdAt: order.createdAt,
                                    items: order.items.map(item => ({
                                        id: item.id,
                                        quantity: item.quantity,
                                        price: Number(item.price),
                                        product: item.product
                                    }))
                                }} />

                                <div className="flex gap-3">
                                    <Link href="/profile" className="flex-1">
                                        <Button variant="outline" className="w-full">Quay lại</Button>
                                    </Link>
                                    <Link href="/products" className="flex-1">
                                        <Button className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6]">Mua tiếp</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
