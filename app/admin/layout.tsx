import { AdminSidebar } from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

async function getAdminRole() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        console.log('Admin Layout Role:', payload.role); // Debug log
        return payload.role as string;
    } catch (error) {
        console.error('Admin Layout Token Verify Error:', error); // Debug log
        return null;
    }
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getAdminRole();
    console.log('Admin Layout Rendered. Role:', role); // Debug log

    // If no role (not logged in), and we are inside /admin (but not /admin/login),
    // The middleware should have handled this, but just in case for static generation
    // We let the page content decide specifically for login page, but this layout wraps ALL admin pages
    // So we need to be careful not to wrap the login page if it uses this layout? 
    // Wait, Next.js Layouts wrap nested pages.
    // If login is at /admin/login, it will use this layout. 
    // Usually login page should have a DIFFERENT layout (empty).
    // Let's check if the current segment is login.
    // Actually, in App Router, we can have (authenticated)/layout.tsx group.
    // But since we have flat structure, let's just render Sidebar if logged in.

    if (!role) {
        // If not logged in (and middleware didn't catch it for some reason), 
        // normally we should redirect or show nothing, but for now we just render children (login page)
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar userRole={role || 'STAFF'} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
