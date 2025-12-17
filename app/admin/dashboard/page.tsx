import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { Package, ShoppingCart, DollarSign, Users, ArrowUpRight, LogOut, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/format';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
        redirect('/admin');
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch {
        redirect('/admin');
    }
}

async function getDashboardStats() {
    const [productsCount, ordersCount, orders, recentOrders, vouchersCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.findMany({
            select: { total: true },
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: true },
                },
            },
        }),
        prisma.voucher.count(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    return {
        productsCount,
        ordersCount,
        totalRevenue,
        recentOrders,
        vouchersCount,
    };
}

export default async function AdminDashboardPage() {
    await verifyAdmin();
    const stats = await getDashboardStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="font-bold text-xl">
                            Admin Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                            Xem cửa hàng
                        </Link>
                        <form action="/api/admin/logout" method="POST">
                            <Button variant="outline" size="sm" type="submit">
                                <LogOut className="h-4 w-4 mr-2" />
                                Đăng xuất
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ordersCount}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.productsCount}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Voucher</CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.vouchersCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Quản lý sản phẩm
                                <Link href="/admin/products">
                                    <Button size="sm" className="gap-1">
                                        Xem tất cả
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Thêm, sửa, xóa sản phẩm trong cửa hàng
                            </p>
                            <Link href="/admin/products/new">
                                <Button variant="outline">+ Thêm sản phẩm mới</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Quản lý đơn hàng
                                <Link href="/admin/orders">
                                    <Button size="sm" className="gap-1">
                                        Xem tất cả
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Xem và cập nhật trạng thái đơn hàng
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {stats.ordersCount} đơn hàng đang chờ xử lý
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Quản lý Voucher
                                <Link href="/admin/vouchers">
                                    <Button size="sm" className="gap-1">
                                        Xem tất cả
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Tạo và quản lý mã giảm giá
                            </p>
                            <Link href="/admin/vouchers">
                                <Button variant="outline">+ Tạo voucher mới</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Đơn hàng gần đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{order.customerName}</p>
                                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {order.items.length} sản phẩm
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-blue-600">
                                                {formatPrice(Number(order.total))}
                                            </p>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Chưa có đơn hàng nào
                            </p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
