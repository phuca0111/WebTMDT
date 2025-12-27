import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';
import AdminOrdersClient from './AdminOrdersClient';

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
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    // Serialize data for client component
    return orders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        total: order.total.toString(),
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                name: item.product.name,
            },
        })),
    }));
}

export default async function AdminOrdersPage() {
    await verifyAdmin();
    const orders = await getOrders();

    return <AdminOrdersClient initialOrders={orders} />;
}
