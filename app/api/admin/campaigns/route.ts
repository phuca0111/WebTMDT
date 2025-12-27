import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all campaigns
export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, type, discount, startDate, endDate, isActive } = body;

        if (!name || !type || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const campaign = await prisma.campaign.create({
            data: {
                name,
                description,
                type,
                discount: discount ? parseFloat(discount) : null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}

// PUT - Update campaign
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, description, type, discount, startDate, endDate, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }

        const campaign = await prisma.campaign.update({
            where: { id },
            data: {
                name,
                description,
                type,
                discount: discount ? parseFloat(discount) : null,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive,
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}

// DELETE - Remove campaign
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }

        await prisma.campaign.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
    }
}
