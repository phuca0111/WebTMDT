import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Lấy Flash Sale settings và product IDs
export async function GET() {
    try {
        let flashSale = await prisma.flashSale.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        // Get active Flash Sale product IDs
        const activeProducts = await prisma.product.findMany({
            where: { isFlashSale: true },
            select: { id: true },
        });

        if (!flashSale) {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            flashSale = await prisma.flashSale.create({
                data: {
                    name: 'Flash Sale',
                    isActive: true,
                    startTime: now,
                    endTime: endOfDay,
                    timeSlots: '0,9,12,15,18,21',
                    discountPercent: 20,
                },
            });
        }

        return NextResponse.json({
            ...flashSale,
            productIds: activeProducts.map(p => p.id),
        });
    } catch (error) {
        console.error('Error fetching flash sale:', error);
        return NextResponse.json({ error: 'Failed to fetch flash sale' }, { status: 500 });
    }
}

// POST - Tạo hoặc cập nhật Flash Sale settings & Products
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, isActive, startTime, endTime, timeSlots, discountPercent, productIds } = body;

        // Cập nhật sản phẩm Flash Sale nếu có productIds
        if (Array.isArray(productIds)) {
            // Transaction để đảm bảo tính nhất quán (nếu dùng PostgreSQL/MySQL)
            // hoặc chạy tuần tự
            await prisma.product.updateMany({
                data: { isFlashSale: false }
            });

            if (productIds.length > 0) {
                await prisma.product.updateMany({
                    where: { id: { in: productIds } },
                    data: { isFlashSale: true }
                });
            }
        }

        const existing = await prisma.flashSale.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        let flashSale;

        if (existing) {
            flashSale = await prisma.flashSale.update({
                where: { id: existing.id },
                data: {
                    name: name || existing.name,
                    isActive: isActive !== undefined ? isActive : existing.isActive,
                    startTime: startTime ? new Date(startTime) : existing.startTime,
                    endTime: endTime ? new Date(endTime) : existing.endTime,
                    timeSlots: timeSlots || existing.timeSlots,
                    discountPercent: discountPercent !== undefined ? discountPercent : existing.discountPercent,
                },
            });
        } else {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            flashSale = await prisma.flashSale.create({
                data: {
                    name: name || 'Flash Sale',
                    isActive: isActive !== undefined ? isActive : true,
                    startTime: startTime ? new Date(startTime) : now,
                    endTime: endTime ? new Date(endTime) : endOfDay,
                    timeSlots: timeSlots || '0,9,12,15,18,21',
                    discountPercent: discountPercent || 20,
                },
            });
        }

        return NextResponse.json(flashSale);
    } catch (error) {
        console.error('Error saving flash sale:', error);
        return NextResponse.json({ error: 'Failed to save flash sale' }, { status: 500 });
    }
}
