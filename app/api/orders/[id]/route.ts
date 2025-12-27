import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
import jwt from 'jsonwebtoken';

// PATCH update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        // Get the current order with items
        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Đơn hàng không tồn tại' }, { status: 404 });
        }

        // AUTH CHECK FOR USER CANCELLATION
        // If the request attempts to set status to 'CANCELLED', verify user ownership
        if (status === 'CANCELLED') {
            const token = request.cookies.get('user-token')?.value;
            if (token) {
                try {
                    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

                    if (existingOrder.userId === decoded.userId) {
                        // User can only cancel PENDING orders
                        if (existingOrder.status !== 'PENDING') {
                            return NextResponse.json({ error: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận' }, { status: 400 });
                        }
                    }
                } catch (e) {
                    // Token invalid
                }
            }

            // Restore stock and decrease soldCount when cancelling PENDING orders
            if (existingOrder.status === 'PENDING') {
                for (const item of existingOrder.items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                            soldCount: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// GET single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
