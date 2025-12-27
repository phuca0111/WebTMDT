import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, slug, icon, description, order, isActive } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(icon !== undefined && { icon }),
                ...(description !== undefined && { description }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
            }
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Error updating category:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
