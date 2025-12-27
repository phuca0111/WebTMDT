import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all products
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');
        const brand = searchParams.get('brand');
        const category = searchParams.get('category');

        // Build where clause dynamically
        const where: {
            name?: { contains: string; mode: 'insensitive' };
            brand?: { equals: string; mode: 'insensitive' };
            category?: { equals: string; mode: 'insensitive' };
        } = {};

        if (query) {
            where.name = {
                contains: query,
                mode: 'insensitive' as const,
            };
        }

        if (brand) {
            where.brand = {
                equals: brand,
                mode: 'insensitive' as const,
            };
        }

        if (category) {
            where.category = {
                equals: category,
                mode: 'insensitive' as const,
            };
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST create product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, image, category, stock } = body;

        if (!name || !price || !image || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                image,
                category,
                stock: stock || 0,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
