import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('admin-token');

    return NextResponse.redirect(new URL('/admin', 'http://localhost:3000'));
}
