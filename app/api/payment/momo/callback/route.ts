import { NextRequest, NextResponse } from 'next/server';
import { verifyMoMoCallback } from '@/lib/momo';
import prisma from '@/lib/db';

// MoMo IPN Callback
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('MoMo Callback received:', body);

        const { orderId, resultCode, transId, message } = body;

        // Verify signature
        const isValid = verifyMoMoCallback(body);
        if (!isValid) {
            console.error('Invalid MoMo signature');
            return NextResponse.json(
                { message: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Find order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            console.error('Order not found:', orderId);
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order status based on result
        if (resultCode === 0) {
            // Payment successful
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'PAID',
                    paymentId: transId,
                },
            });
            console.log('Payment successful for order:', orderId);
        } else {
            // Payment failed
            console.log('Payment failed for order:', orderId, 'Message:', message);
        }

        // MoMo expects a 204 response
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('MoMo callback error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle redirect from MoMo
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const resultCode = searchParams.get('resultCode');

    if (!orderId) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If payment was successful, redirect to success page
    if (resultCode === '0') {
        return NextResponse.redirect(
            new URL(`/order-success?orderId=${orderId}&payment=momo`, request.url)
        );
    }

    // Payment failed, redirect to failure page
    return NextResponse.redirect(
        new URL(`/order-success?orderId=${orderId}&error=payment_failed`, request.url)
    );
}
