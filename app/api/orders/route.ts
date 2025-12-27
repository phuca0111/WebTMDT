import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';

// GET all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST create new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName, customerEmail, customerPhone, address,
            paymentMethod, items, total, subtotal, discount, voucherId
        } = body;

        console.log('Creating order with data:', { customerName, customerEmail, paymentMethod, total, itemCount: items?.length });

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone || !address || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate that all products exist
        const productIds = items.map((item: { productId: string }) => item.productId);
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true },
        });

        const existingProductIds = existingProducts.map(p => p.id);
        const missingProducts = productIds.filter((id: string) => !existingProductIds.includes(id));

        if (missingProducts.length > 0) {
            console.error('Missing products:', missingProducts);
            return NextResponse.json(
                { error: `Sản phẩm không tồn tại: ${missingProducts.join(', ')}` },
                { status: 400 }
            );
        }

        // Create order with items
        let userId = null;
        const cookieStore = await cookies();
        const token = cookieStore.get('user-token')?.value;
        const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
                userId = decoded.userId;
            } catch (err) {
                console.log('Invalid token, processing as guest order');
            }
        }

        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                address,
                subtotal: subtotal || total,
                discount: discount || 0,
                total,
                paymentMethod,
                status: 'PENDING',
                voucherId: voucherId || null,
                userId: userId, // Link order to user if logged in
                items: {
                    create: items.map((item: { productId: string; quantity: number; price: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        console.log('Order created successfully:', order.id);

        // Update product stock and soldCount
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                    soldCount: {
                        increment: item.quantity,  // Tăng số lượng đã bán
                    },
                },
            });
        }

        // Send confirmation email asynchronously
        try {
            await sendOrderConfirmationEmail({
                email: customerEmail,
                orderId: order.id,
                customerName,
                total: Number(order.total),
                address,
                items: order.items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: Number(item.price),
                    image: item.product.image
                }))
            });
            console.log('Confirmation email sent to:', customerEmail);
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order', details: String(error) },
            { status: 500 }
        );
    }
}
