import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET order by email and orderId (for guest lookup)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const orderId = searchParams.get('orderId');

        if (!email || !orderId) {
            return NextResponse.json(
                { error: 'Vui lòng nhập đầy đủ email và mã đơn hàng' },
                { status: 400 }
            );
        }

        // Find order by id that starts with the provided orderId and matches email
        const order = await prisma.order.findFirst({
            where: {
                AND: [
                    { customerEmail: email.toLowerCase() },
                    {
                        OR: [
                            { id: orderId },
                            { id: { startsWith: orderId.toLowerCase() } },
                        ]
                    }
                ]
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại email và mã đơn hàng.' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Order lookup error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra khi tra cứu đơn hàng' },
            { status: 500 }
        );
    }
}
