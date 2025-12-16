import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import prisma from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/format';
import UpdateOrderStatus from './UpdateOrderStatus';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) redirect('/admin');
    try {
        await jwtVerify(token, JWT_SECRET);
    } catch {
        redirect('/admin');
    }
}

async function getOrders() {
    return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: true },
            },
        },
    });
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    PAID: 'Đã thanh toán',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

export default async function AdminOrdersPage() {
    await verifyAdmin();
    const orders = await getOrders();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-xl">Quản lý đơn hàng</h1>
                    <Badge variant="secondary" className="ml-auto">
                        {orders.length} đơn hàng
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày đặt</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">
                                        <Link href={`/admin/orders/${order.id}`} className="hover:text-blue-600">
                                            {order.id.slice(0, 8)}...
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
                                    <TableCell className="font-bold text-blue-600">
                                        {formatPrice(Number(order.total))}
                                    </TableCell>
                                    <TableCell>
                                        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
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

                    {orders.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Chưa có đơn hàng nào
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
