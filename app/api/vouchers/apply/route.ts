import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Apply voucher code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, subtotal } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Vui lòng nhập mã giảm giá' },
                { status: 400 }
            );
        }

        // Find voucher
        const voucher = await prisma.voucher.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!voucher) {
            return NextResponse.json(
                { error: 'Mã giảm giá không tồn tại' },
                { status: 404 }
            );
        }

        // Check if voucher is active
        if (!voucher.isActive) {
            return NextResponse.json(
                { error: 'Mã giảm giá đã hết hiệu lực' },
                { status: 400 }
            );
        }

        // Check expiry
        if (voucher.expiresAt && new Date() > voucher.expiresAt) {
            return NextResponse.json(
                { error: 'Mã giảm giá đã hết hạn' },
                { status: 400 }
            );
        }

        // Check usage limit
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            return NextResponse.json(
                { error: 'Mã giảm giá đã hết lượt sử dụng' },
                { status: 400 }
            );
        }

        // Check minimum order value
        const minOrder = voucher.minOrderValue ? Number(voucher.minOrderValue) : 0;
        if (subtotal < minOrder) {
            return NextResponse.json(
                { error: `Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;
        if (voucher.discountType === 'PERCENT') {
            discount = (subtotal * Number(voucher.discountValue)) / 100;
            // Apply max discount cap if exists
            if (voucher.maxDiscount) {
                discount = Math.min(discount, Number(voucher.maxDiscount));
            }
        } else {
            // FIXED discount
            discount = Number(voucher.discountValue);
        }

        // Discount cannot exceed subtotal
        discount = Math.min(discount, subtotal);

        return NextResponse.json({
            success: true,
            voucher: {
                id: voucher.id,
                code: voucher.code,
                description: voucher.description,
                discountType: voucher.discountType,
                discountValue: Number(voucher.discountValue),
            },
            discount: Math.round(discount),
            message: `Áp dụng mã "${voucher.code}" thành công!`,
        });
    } catch (error) {
        console.error('Apply voucher error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi áp dụng mã giảm giá' },
            { status: 500 }
        );
    }
}
