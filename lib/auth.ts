import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

export async function verifyAdmin(request: NextRequest): Promise<{ success: boolean; error?: string }> {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
        return { success: false, error: 'Chưa đăng nhập' };
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return { success: true };
    } catch {
        return { success: false, error: 'Token không hợp lệ' };
    }
}
