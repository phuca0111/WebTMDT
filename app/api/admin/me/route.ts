import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const adminId = payload.adminId as string;

        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                username: true,
                // name: true,
                // role: true,
            },
        });

        if (!admin) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: admin });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
