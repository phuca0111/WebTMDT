import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all banners
export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: [{ position: 'asc' }, { order: 'asc' }],
        });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, image, link, position, isActive, startDate, endDate, order } = body;

        if (!title || !image || !position) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const banner = await prisma.banner.create({
            data: {
                title,
                image,
                link,
                position,
                isActive: isActive ?? true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                order: order ?? 0,
            },
        });

        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

// PUT - Update banner
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, image, link, position, isActive, startDate, endDate, order } = body;

        if (!id) {
            return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
        }

        const banner = await prisma.banner.update({
            where: { id },
            data: {
                title,
                image,
                link,
                position,
                isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                order,
            },
        });

        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }
}

// DELETE - Remove banner
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
        }

        await prisma.banner.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
