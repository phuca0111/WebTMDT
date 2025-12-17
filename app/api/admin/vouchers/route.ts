import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

// Get all vouchers (admin only)
export async function GET(request: NextRequest) {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.success) {
        return NextResponse.json({ error: adminResult.error }, { status: 401 });
    }

    try {
        const vouchers = await prisma.voucher.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });

        return NextResponse.json(vouchers);
    } catch (error) {
        console.error('Get vouchers error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy danh sách voucher' },
            { status: 500 }
        );
    }
}

// Create new voucher (admin only)
export async function POST(request: NextRequest) {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.success) {
        return NextResponse.json({ error: adminResult.error }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            expiresAt,
        } = body;

        // Validate required fields
        if (!code || !discountValue) {
            return NextResponse.json(
                { error: 'Mã code và giá trị giảm giá là bắt buộc' },
                { status: 400 }
            );
        }

        // Check if code already exists
        const existingVoucher = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (existingVoucher) {
            return NextResponse.json(
                { error: 'Mã voucher đã tồn tại' },
                { status: 400 }
            );
        }

        const voucher = await prisma.voucher.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType: discountType || 'PERCENT',
                discountValue,
                minOrderValue: minOrderValue || null,
                maxDiscount: maxDiscount || null,
                usageLimit: usageLimit || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return NextResponse.json(voucher);
    } catch (error) {
        console.error('Create voucher error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo voucher' },
            { status: 500 }
        );
    }
}
