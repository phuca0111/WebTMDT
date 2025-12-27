import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import {
    ArrowLeft,
    Users,
    UserPlus,
    ShoppingBag,
    TrendingUp,
    Mail,
    Phone,
    Calendar,
    Star,
    ChevronRight,
    Search,
    Filter,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import prisma from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/format';

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

async function getCustomerData() {
    // Lấy tất cả users với orders
    const users = await prisma.user.findMany({
        include: {
            orders: {
                include: {
                    items: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    // Tính toán thống kê cho mỗi customer
    const customers = users.map(user => {
        const totalOrders = user.orders.length;
        const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.total), 0);
        const completedOrders = user.orders.filter(o => o.status === 'COMPLETED').length;
        const lastOrderDate = user.orders.length > 0
            ? user.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
            : null;

        // Phân loại khách hàng
        let segment = 'Mới';
        let segmentColor = 'bg-blue-100 text-blue-700';
        if (totalSpent >= 10000000) {
            segment = 'VIP';
            segmentColor = 'bg-yellow-100 text-yellow-700';
        } else if (totalSpent >= 5000000) {
            segment = 'Thân thiết';
            segmentColor = 'bg-purple-100 text-purple-700';
        } else if (totalOrders >= 3) {
            segment = 'Thường xuyên';
            segmentColor = 'bg-green-100 text-green-700';
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            totalOrders,
            totalSpent,
            completedOrders,
            lastOrderDate,
            segment,
            segmentColor,
        };
    });

    // Thống kê tổng quan
    const totalCustomers = customers.length;
    const newCustomersThisMonth = customers.filter(c => {
        const createdAt = new Date(c.createdAt);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / Math.max(customers.reduce((sum, c) => sum + c.totalOrders, 0), 1);
    const vipCustomers = customers.filter(c => c.segment === 'VIP').length;

    // Top customers
    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    return {
        customers,
        stats: {
            totalCustomers,
            newCustomersThisMonth,
            totalRevenue,
            avgOrderValue,
            vipCustomers,
        },
        topCustomers,
    };
}

export default async function AdminCRMPage() {
    await verifyAdmin();
    const { customers, stats, topCustomers } = await getCustomerData();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-xl">Quản lý Khách hàng (CRM)</h1>
                    <Badge variant="secondary" className="ml-auto">
                        {stats.totalCustomers} khách hàng
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng KH</p>
                                <p className="text-xl font-bold">{stats.totalCustomers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserPlus className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">KH mới (tháng)</p>
                                <p className="text-xl font-bold">{stats.newCustomersThisMonth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                                <p className="text-xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ShoppingBag className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Giá trị TB/đơn</p>
                                <p className="text-xl font-bold">{formatPrice(stats.avgOrderValue)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Khách VIP</p>
                                <p className="text-xl font-bold">{stats.vipCustomers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Tìm khách hàng..." className="pl-10" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Lọc
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>

                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {customers.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Chưa có khách hàng nào</p>
                                    </div>
                                ) : (
                                    customers.map(customer => (
                                        <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                                                        <Badge className={customer.segmentColor}>
                                                            {customer.segment}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {customer.email}
                                                        </span>
                                                        {customer.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {customer.phone}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Tham gia: {formatDate(customer.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-blue-600">{formatPrice(customer.totalSpent)}</p>
                                                    <p className="text-sm text-gray-500">{customer.totalOrders} đơn hàng</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Customers */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Top Khách hàng
                            </h2>
                            <div className="space-y-3">
                                {topCustomers.map((customer, index) => (
                                    <div key={customer.id} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.totalOrders} đơn</p>
                                        </div>
                                        <p className="font-bold text-blue-600 text-sm">{formatPrice(customer.totalSpent)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Segments */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold text-gray-800 mb-4">Phân khúc Khách hàng</h2>
                            <div className="space-y-3">
                                {[
                                    { name: 'VIP', color: 'bg-yellow-500', count: customers.filter(c => c.segment === 'VIP').length, desc: '≥ 10 triệu' },
                                    { name: 'Thân thiết', color: 'bg-purple-500', count: customers.filter(c => c.segment === 'Thân thiết').length, desc: '≥ 5 triệu' },
                                    { name: 'Thường xuyên', color: 'bg-green-500', count: customers.filter(c => c.segment === 'Thường xuyên').length, desc: '≥ 3 đơn' },
                                    { name: 'Mới', color: 'bg-blue-500', count: customers.filter(c => c.segment === 'Mới').length, desc: 'Khách mới' },
                                ].map(segment => (
                                    <div key={segment.name} className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{segment.name}</p>
                                            <p className="text-xs text-gray-500">{segment.desc}</p>
                                        </div>
                                        <Badge variant="secondary">{segment.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold text-gray-800 mb-4">Hành động nhanh</h2>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Mail className="h-4 w-4" />
                                    Gửi email marketing
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Thêm khách hàng mới
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Download className="h-4 w-4" />
                                    Xuất báo cáo CRM
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
