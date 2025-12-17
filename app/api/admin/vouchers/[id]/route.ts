import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

interface Params {
    params: Promise<{ id: string }>;
}

// Update voucher
export async function PUT(request: NextRequest, { params }: Params) {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.success) {
        return NextResponse.json({ error: adminResult.error }, { status: 401 });
    }

    try {
        const { id } = await params;
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
            isActive,
        } = body;

        const voucher = await prisma.voucher.update({
            where: { id },
            data: {
                code: code?.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderValue: minOrderValue || null,
                maxDiscount: maxDiscount || null,
                usageLimit: usageLimit || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive,
            },
        });

        return NextResponse.json(voucher);
    } catch (error) {
        console.error('Update voucher error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật voucher' },
            { status: 500 }
        );
    }
}

// Delete voucher
export async function DELETE(request: NextRequest, { params }: Params) {
    const adminResult = await verifyAdmin(request);
    if (!adminResult.success) {
        return NextResponse.json({ error: adminResult.error }, { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.voucher.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete voucher error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa voucher' },
            { status: 500 }
        );
    }
}
