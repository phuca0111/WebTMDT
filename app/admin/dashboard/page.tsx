import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { Package, ShoppingCart, DollarSign, Users, ArrowUpRight, LogOut, Ticket, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role as string;
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
    const role = await verifyAdmin();
    const stats = await getDashboardStats();

    // Permission checks removed - All visible


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="font-bold text-xl">
                            Admin Dashboard <Badge variant="outline" className="ml-2">{role}</Badge>
                        </Link>
                    </div>
                    {/* ... Logout ... */}
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
                    {/* Revenue */}
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
                    {/* Products */}
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

                    {/* Orders */}
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

                    {/* Vouchers */}
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

                {/* More Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* CRM */}
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    CRM - Quản lý Khách hàng
                                </span>
                                <Link href="/admin/crm">
                                    <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700">
                                        Mở CRM
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Xem danh sách khách hàng, phân khúc, top customers và thống kê
                            </p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">VIP</span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Thân thiết</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Thường xuyên</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Mới</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <FolderTree className="h-5 w-5 text-green-600" />
                                    Quản lý Danh mục
                                </span>
                                <Link href="/admin/categories">
                                    <Button size="sm" className="gap-1">
                                        Xem tất cả
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Thêm, sửa, xóa danh mục sản phẩm
                            </p>
                            <Link href="/admin/categories">
                                <Button variant="outline">+ Thêm danh mục</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* SEO & Marketing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* SEO */}
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    🔍 SEO Settings
                                </span>
                                <Link href="/admin/seo">
                                    <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                                        Quản lý SEO
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Cấu hình meta tags, OG images và keywords cho từng trang
                            </p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Meta Title</span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Description</span>
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Keywords</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing */}
                    <Card className="border-2 border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    📣 Marketing
                                </span>
                                <Link href="/admin/marketing">
                                    <Button size="sm" className="gap-1 bg-orange-600 hover:bg-orange-700">
                                        Quản lý Marketing
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Quản lý banners, popups và các chiến dịch khuyến mãi
                            </p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Flash Sale</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Banners</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Campaigns</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Layout Theme */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="border-2 border-purple-200 bg-purple-50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    🎨 Giao diện Website
                                </span>
                                <Link href="/admin/layout-theme">
                                    <Button size="sm" className="gap-1 bg-purple-600 hover:bg-purple-700">
                                        Quản lý Layout
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Thay đổi giao diện theo mùa lễ: Giáng sinh, Tết, Halloween...
                            </p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">🎄 Christmas</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">🧧 Tết</span>
                                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">💕 Valentine</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders - All */}
                <Card>
                    <CardHeader>
                        <CardTitle>Đơn hàng gần đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentOrders.map((order: any) => (
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
