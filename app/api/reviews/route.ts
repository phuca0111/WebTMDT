import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Get reviews for a product
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({ reviews, avgRating, count: reviews.length });
    } catch (error) {
        console.error('Get reviews error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy đánh giá' },
            { status: 500 }
        );
    }
}

// Create a review
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const token = request.cookies.get('user-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Vui lòng đăng nhập để đánh giá' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const body = await request.json();
        const { productId, rating, comment } = body;

        // Validate
        if (!productId || !rating) {
            return NextResponse.json(
                { error: 'Thiếu thông tin đánh giá' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Đánh giá phải từ 1-5 sao' },
                { status: 400 }
            );
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: decoded.userId,
                    productId,
                },
            },
        });

        if (existingReview) {
            // Update existing review
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment },
                include: {
                    user: {
                        select: { id: true, name: true },
                    },
                },
            });
            return NextResponse.json({ review: updatedReview, updated: true });
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId: decoded.userId,
                productId,
            },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json({ review, created: true });
    } catch (error) {
        console.error('Create review error:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo đánh giá' },
            { status: 500 }
        );
    }
}
