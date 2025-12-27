import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth-config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function GET(request: NextRequest) {
    try {
        // First, check NextAuth session (for Google login)
        const session = await auth();

        console.log('🔍 Auth check - NextAuth session:', session?.user?.email || 'no session');

        if (session?.user?.email) {
            // Get user from database by email
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            });

            console.log('🔍 Auth check - DB user found:', user?.email || 'not found');

            if (user) {
                return NextResponse.json({ user });
            }
        }

        // Fallback: check JWT token (for email/password login)
        const token = request.cookies.get('user-token')?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
            },
        });

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null });
    }
}
