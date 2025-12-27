import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);



export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run for /admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Skip login page and public assets
    if (pathname.startsWith('/admin/login') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        // Authentication successful - Allow access to all admin routes
        return NextResponse.next();
    } catch (error) {
        // Invalid token
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: '/admin/:path*',
};
