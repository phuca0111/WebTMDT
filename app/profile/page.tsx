import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Package, LogOut, ChevronRight } from 'lucide-react';
import prisma from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/format';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LogoutButton from './LogoutButton';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('user-token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        return user;
    } catch {
        return null;
    }
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

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Info Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                                    <p className="text-slate-500 text-sm">Thành viên</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm">{user.phone}</span>
                                        </div>
                                    )}
                                    {user.address && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm">{user.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-indigo-600">{user.orders.length}</p>
                                            <p className="text-xs text-slate-500">Đơn hàng</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                {user.orders.filter(o => o.status === 'COMPLETED').length}
                                            </p>
                                            <p className="text-xs text-slate-500">Hoàn thành</p>
                                        </div>
                                    </div>
                                </div>

                                <LogoutButton />
                            </div>
                        </div>

                        {/* Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                    <h2 className="text-lg font-bold text-slate-800">Lịch sử đơn hàng</h2>
                                </div>

                                {user.orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 mb-4">Bạn chưa có đơn hàng nào</p>
                                        <Link href="/products">
                                            <Button>Mua sắm ngay</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {user.orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</p>
                                                        <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <Badge className={statusColors[order.status]}>
                                                        {statusLabels[order.status]}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2">
                                                    {order.items.slice(0, 2).map((item) => (
                                                        <div key={item.id} className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={item.product.image}
                                                                    alt={item.product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                                    {item.product.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">x{item.quantity}</p>
                                                            </div>
                                                            <p className="text-sm font-medium text-indigo-600">
                                                                {formatPrice(Number(item.price) * item.quantity)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <p className="text-xs text-slate-400">
                                                            +{order.items.length - 2} sản phẩm khác
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                    <p className="text-sm text-slate-500">Tổng cộng:</p>
                                                    <p className="font-bold text-indigo-600">{formatPrice(Number(order.total))}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
