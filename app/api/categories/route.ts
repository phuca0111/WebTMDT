import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create new category (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, icon, description, order } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                icon: icon || null,
                description: description || null,
                order: order || 0,
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error('Error creating category:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category with this name or slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
