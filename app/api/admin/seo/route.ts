import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all SEO settings
export async function GET() {
    try {
        const settings = await prisma.seoSettings.findMany({
            orderBy: { pageType: 'asc' },
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
    }
}

// POST - Create or update SEO settings
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pageType, metaTitle, metaDescription, ogImage, keywords } = body;

        if (!pageType || !metaTitle || !metaDescription) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const settings = await prisma.seoSettings.upsert({
            where: { pageType },
            update: {
                metaTitle,
                metaDescription,
                ogImage,
                keywords,
            },
            create: {
                pageType,
                metaTitle,
                metaDescription,
                ogImage,
                keywords,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save SEO settings' }, { status: 500 });
    }
}
