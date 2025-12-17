import { NextRequest, NextResponse } from 'next/server';
import { createMoMoPayment } from '@/lib/momo';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get order from database
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Create MoMo payment
        const amount = Math.round(Number(order.total));
        const momoResponse = await createMoMoPayment({
            orderId: order.id,
            amount,
            orderInfo: `Thanh toán đơn hàng #${order.id.slice(0, 8)}`,
        });

        if (momoResponse.resultCode !== 0) {
            return NextResponse.json(
                { error: momoResponse.message || 'Lỗi tạo thanh toán MoMo' },
                { status: 400 }
            );
        }

        // Update order with payment ID
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentId: momoResponse.requestId,
            },
        });

        return NextResponse.json({
            success: true,
            payUrl: momoResponse.payUrl,
            shortLink: momoResponse.shortLink,
            qrCodeUrl: momoResponse.qrCodeUrl,
            orderId: order.id,
        });
    } catch (error) {
        console.error('MoMo payment error:', error);
        return NextResponse.json(
            { error: 'Lỗi tạo thanh toán MoMo' },
            { status: 500 }
        );
    }
}
