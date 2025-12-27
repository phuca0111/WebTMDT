'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/format';
import CancelOrderButton from './CancelOrderButton';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        image: string;
    };
}

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: Date;
    items: OrderItem[];
}

interface OrderTabsProps {
    orders: Order[];
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPING: 'bg-cyan-100 text-cyan-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    PAID: 'Đã thanh toán',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tất cả', icon: <Package className="h-4 w-4" /> },
    { key: 'pending', label: 'Đang xử lý', icon: <Clock className="h-4 w-4" /> },
    { key: 'completed', label: 'Đã mua', icon: <CheckCircle className="h-4 w-4" /> },
    { key: 'cancelled', label: 'Đã hủy', icon: <XCircle className="h-4 w-4" /> },
];

export default function OrderTabs({ orders }: OrderTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const filteredOrders = orders.filter((order) => {
        switch (activeTab) {
            case 'pending':
                return ['PENDING', 'PAID', 'PROCESSING', 'SHIPPING'].includes(order.status);
            case 'completed':
                return order.status === 'COMPLETED';
            case 'cancelled':
                return order.status === 'CANCELLED';
            default:
                return true;
        }
    });

    const counts = {
        all: orders.length,
        pending: orders.filter(o => ['PENDING', 'PAID', 'PROCESSING', 'SHIPPING'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Lịch sử đơn hàng</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key
                                ? 'bg-white/20'
                                : 'bg-slate-200'
                            }`}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">
                        {activeTab === 'all' && 'Bạn chưa có đơn hàng nào'}
                        {activeTab === 'pending' && 'Không có đơn hàng đang xử lý'}
                        {activeTab === 'completed' && 'Không có đơn hàng đã hoàn thành'}
                        {activeTab === 'cancelled' && 'Không có đơn hàng đã hủy'}
                    </p>
                    <Link href="/products">
                        <Button>Mua sắm ngay</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Mã đơn: <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
                                    </p>
                                    <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                                </div>
                                <Badge className={statusColors[order.status]}>
                                    {statusLabels[order.status]}
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-3">
                                {order.items.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                        <span className="text-slate-600">
                                            {item.product.name} x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <p className="text-xs text-slate-400">
                                        +{order.items.length - 2} sản phẩm khác
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-indigo-600">{formatPrice(Number(order.total))}</p>
                                    {order.status === 'PENDING' && (
                                        <CancelOrderButton orderId={order.id} />
                                    )}
                                </div>
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Xem chi tiết
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
