import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Vui lòng nhập email và mật khẩu' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            );
        }

        // Link guest orders (orders without userId that match the email)
        // This handles the case where user has account but ordered while not logged in
        // Use case-insensitive email matching
        const linkedOrders = await prisma.order.updateMany({
            where: {
                customerEmail: {
                    equals: user.email,
                    mode: 'insensitive',
                },
                userId: null,
            },
            data: {
                userId: user.id,
            },
        });

        if (linkedOrders.count > 0) {
            console.log(`✅ Linked ${linkedOrders.count} guest orders to user ${user.email}`);
        } else {
            console.log(`ℹ️ No guest orders found for ${user.email}`);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with cookie
        const response = NextResponse.json({
            message: 'Đăng nhập thành công!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set('user-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi, vui lòng thử lại' },
            { status: 500 }
        );
    }
}
