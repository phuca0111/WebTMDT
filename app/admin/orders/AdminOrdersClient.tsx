'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPrice, formatDate } from '@/lib/format';
import UpdateOrderStatus from './UpdateOrderStatus';

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
    };
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    total: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
    items: OrderItem[];
}

const paymentLabels: Record<string, string> = {
    COD: 'COD',
    MOMO: 'MoMo',
    ZALOPAY: 'ZaloPay',
    VNPAY: 'VNPay',
    BANK: 'Chuyển khoản',
};

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    // Filter orders based on search term and status
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone.includes(searchTerm) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-xl">Quản lý đơn hàng</h1>
                    <Badge variant="secondary" className="ml-auto">
                        {filteredOrders.length} / {orders.length} đơn hàng
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm theo mã đơn, tên, SĐT, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'PENDING', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${statusFilter === status
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status === 'all' ? 'Tất cả' :
                                        status === 'PENDING' ? 'Chờ xử lý' :
                                            status === 'PROCESSING' ? 'Đang xử lý' :
                                                status === 'SHIPPING' ? 'Đang giao' :
                                                    status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Thanh toán</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày đặt</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">
                                        <Link href={`/admin/orders/${order.id}`} className="hover:text-blue-600">
                                            {order.id.slice(0, 8).toUpperCase()}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.customerName}</p>
                                            <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {order.items.slice(0, 2).map((item) => (
                                                <p key={item.id} className="line-clamp-1">
                                                    {item.quantity}x {item.product.name}
                                                </p>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-gray-400">+{order.items.length - 2} sản phẩm khác</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={order.paymentMethod === 'COD' ? 'border-orange-300 text-orange-600' : 'border-green-300 text-green-600'}>
                                            {paymentLabels[order.paymentMethod] || order.paymentMethod}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-blue-600">
                                        {formatPrice(Number(order.total))}
                                    </TableCell>
                                    <TableCell>
                                        <UpdateOrderStatus
                                            orderId={order.id}
                                            currentStatus={order.status}
                                            paymentMethod={order.paymentMethod}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="outline" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Không tìm thấy đơn hàng phù hợp'
                                    : 'Chưa có đơn hàng nào'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
