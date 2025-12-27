import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Preset themes data
const PRESET_THEMES = [
    {
        name: 'default',
        displayName: 'Mặc định',
        description: 'Giao diện tiêu chuẩn của website',
        primaryColor: '#1a94ff',
        secondaryColor: '#ff424e',
        accentColor: '#00ab56',
        backgroundColor: '#f5f5fa',
        headerBg: '#ffffff',
        navbarStyle: 'default',
        snowEffect: false,
        fireworkEffect: false,
        specialIcon: '🛒',
    },
    {
        name: 'christmas',
        displayName: '🎄 Giáng Sinh',
        description: 'Giao diện lễ Giáng Sinh với hiệu ứng tuyết rơi',
        primaryColor: '#c41e3a',
        secondaryColor: '#228b22',
        accentColor: '#ffd700',
        backgroundColor: '#1a1a2e',
        headerBg: '#c41e3a',
        navbarStyle: 'christmas',
        snowEffect: true,
        fireworkEffect: false,
        specialIcon: '🎅',
    },
    {
        name: 'tet',
        displayName: '🧧 Tết Nguyên Đán',
        description: 'Giao diện Tết cổ truyền Việt Nam với pháo hoa',
        primaryColor: '#d4af37',
        secondaryColor: '#ff0000',
        accentColor: '#ffeb3b',
        backgroundColor: '#8b0000',
        headerBg: '#d4af37',
        navbarStyle: 'tet',
        snowEffect: false,
        fireworkEffect: true,
        specialIcon: '🧨',
    },
    {
        name: 'valentine',
        displayName: '💕 Valentine',
        description: 'Giao diện lãng mạn cho ngày Lễ Tình Nhân',
        primaryColor: '#ff69b4',
        secondaryColor: '#ff1493',
        accentColor: '#ff6b6b',
        backgroundColor: '#fff0f5',
        headerBg: '#ff69b4',
        navbarStyle: 'valentine',
        snowEffect: false,
        fireworkEffect: false,
        specialIcon: '💝',
    },
    {
        name: 'summer',
        displayName: '🌴 Mùa Hè',
        description: 'Giao diện tươi mát cho mùa hè',
        primaryColor: '#00bcd4',
        secondaryColor: '#ff9800',
        accentColor: '#4caf50',
        backgroundColor: '#e0f7fa',
        headerBg: '#00bcd4',
        navbarStyle: 'summer',
        snowEffect: false,
        fireworkEffect: false,
        specialIcon: '🏖️',
    },
    {
        name: 'halloween',
        displayName: '🎃 Halloween',
        description: 'Giao diện ma quái cho lễ Halloween',
        primaryColor: '#ff6600',
        secondaryColor: '#6a0dad',
        accentColor: '#39ff14',
        backgroundColor: '#1a1a1a',
        headerBg: '#ff6600',
        navbarStyle: 'halloween',
        snowEffect: false,
        fireworkEffect: false,
        specialIcon: '👻',
    },
    {
        name: 'blackfriday',
        displayName: '🏷️ Black Friday',
        description: 'Giao diện sale lớn Black Friday',
        primaryColor: '#000000',
        secondaryColor: '#ffd700',
        accentColor: '#ff0000',
        backgroundColor: '#111111',
        headerBg: '#000000',
        navbarStyle: 'blackfriday',
        snowEffect: false,
        fireworkEffect: false,
        specialIcon: '💰',
    },
];

// GET active theme or all themes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active');
        const presets = searchParams.get('presets');

        // Return preset themes
        if (presets === 'true') {
            return NextResponse.json(PRESET_THEMES);
        }

        // Return active theme only
        if (active === 'true') {
            const theme = await prisma.siteTheme.findFirst({
                where: { isActive: true },
            });
            return NextResponse.json(theme || PRESET_THEMES[0]);
        }

        // Return all themes
        const themes = await prisma.siteTheme.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(themes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}

// POST - Create or apply theme
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { presetName, primaryColor, secondaryColor, accentColor, backgroundColor, headerBg } = body;

        // If applying custom colors
        if (presetName === 'custom' && primaryColor) {
            // Deactivate all themes first
            await prisma.siteTheme.updateMany({
                data: { isActive: false },
            });

            // Upsert custom theme
            const theme = await prisma.siteTheme.upsert({
                where: { name: 'custom' },
                update: {
                    displayName: 'Tùy chỉnh',
                    description: 'Giao diện tùy chỉnh',
                    primaryColor,
                    secondaryColor,
                    accentColor,
                    backgroundColor,
                    headerBg,
                    isActive: true,
                },
                create: {
                    name: 'custom',
                    displayName: 'Tùy chỉnh',
                    description: 'Giao diện tùy chỉnh',
                    primaryColor,
                    secondaryColor,
                    accentColor,
                    backgroundColor,
                    headerBg,
                    navbarStyle: 'custom',
                    isActive: true,
                },
            });

            return NextResponse.json(theme);
        }

        // If applying a preset theme
        if (presetName) {
            const preset = PRESET_THEMES.find(t => t.name === presetName);
            if (!preset) {
                return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
            }

            // Deactivate all themes first
            await prisma.siteTheme.updateMany({
                data: { isActive: false },
            });

            // Upsert the preset theme
            const theme = await prisma.siteTheme.upsert({
                where: { name: preset.name },
                update: { ...preset, isActive: true },
                create: { ...preset, isActive: true },
            });

            return NextResponse.json(theme);
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        console.error('Theme error:', error);
        return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }
}

// PUT - Activate a theme
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Theme ID required' }, { status: 400 });
        }

        // Deactivate all themes
        await prisma.siteTheme.updateMany({
            data: { isActive: false },
        });

        // Activate selected theme
        const theme = await prisma.siteTheme.update({
            where: { id },
            data: { isActive: true },
        });

        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
    }
}

// DELETE - Remove theme
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Theme ID required' }, { status: 400 });
        }

        await prisma.siteTheme.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
    }
}
