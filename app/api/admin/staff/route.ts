import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

// Middleware check helper
async function checkSuperAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === 'SUPER_ADMIN';
    } catch {
        return false;
    }
}

export async function GET() {
    if (!await checkSuperAdmin()) {
        return new NextResponse('Unauthorized', { status: 403 });
    }

    try {
        const admins = await prisma.admin.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });

        return NextResponse.json(admins);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await checkSuperAdmin()) {
        return new NextResponse('Unauthorized', { status: 403 });
    }

    try {
        const body = await req.json();
        const { username, password, name, role } = body;

        if (!username || !password || !name || !role) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        // Check exists
        const existing = await prisma.admin.findUnique({
            where: { username }
        });

        if (existing) {
            return new NextResponse('Username already exists', { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role // Should be validated against enum
            }
        });

        return NextResponse.json({
            id: newAdmin.id,
            username: newAdmin.username,
            role: newAdmin.role
        });

    } catch (error) {
        console.error('[ADMIN_CREATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
