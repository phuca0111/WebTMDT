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
import CancelOrderButton from './CancelOrderButton';
import OrderTabs from './OrderTabs';
import { auth } from '@/lib/auth-config';

// Force dynamic rendering for Vercel deployment
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

async function getUser() {
    // First, check NextAuth session (for Google login)
    const session = await auth();

    if (session?.user?.email) {
        // Find user first
        let user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user) {
            // Link any guest orders that haven't been linked yet
            await prisma.order.updateMany({
                where: {
                    customerEmail: {
                        equals: session.user.email,
                        mode: 'insensitive',
                    },
                    userId: null,
                },
                data: {
                    userId: user.id,
                },
            });

            // Now fetch user with orders
            const userWithOrders = await prisma.user.findUnique({
                where: { email: session.user.email },
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
            return userWithOrders;
        }
    }

    // Fallback: check JWT token (for email/password login)
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
                            <OrderTabs orders={user.orders.map(o => ({
                                ...o,
                                subtotal: Number(o.subtotal),
                                discount: Number(o.discount),
                                total: Number(o.total),
                                items: o.items.map(item => ({
                                    ...item,
                                    price: Number(item.price),
                                })),
                            }))} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
