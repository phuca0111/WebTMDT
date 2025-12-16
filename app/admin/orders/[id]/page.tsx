import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { jwtVerify } from 'jose';
import { ArrowLeft, Package, User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/format';
import UpdateOrderStatus from '../UpdateOrderStatus';

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

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
    return prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: true },
            },
        },
    });
}

const paymentLabels: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    MOMO: 'Ví MoMo',
    BANK: 'Chuyển khoản ngân hàng',
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    await verifyAdmin();
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-xl">Chi tiết đơn hàng</h1>
                    <Badge variant="secondary" className="ml-auto font-mono">
                        #{order.id.slice(0, 8)}
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Sản phẩm đã đặt ({order.items.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/products/${item.product.id}`} className="font-medium hover:text-blue-600">
                                                {item.product.name}
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatPrice(Number(item.price))} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-blue-600">
                                                {formatPrice(Number(item.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{formatPrice(Number(order.total))}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline / Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                                <span className="text-sm text-gray-500">
                                    Cập nhật lần cuối: {formatDate(order.updatedAt)}
                                </span>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer Info & Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Thông tin khách hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-1 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 mt-1 text-gray-400" />
                                    <p>{order.customerPhone}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-1 text-gray-400" />
                                    <p className="text-sm">{order.customerEmail}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                                    <p className="text-sm">{order.address}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phương thức</span>
                                    <span>{paymentLabels[order.paymentMethod || 'COD']}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày đặt</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng tiền</span>
                                    <span className="text-blue-600">{formatPrice(Number(order.total))}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Link href="/admin/orders" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Quay lại
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
