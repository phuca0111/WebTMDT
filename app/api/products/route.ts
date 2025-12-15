import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
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
