'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Đăng xuất thành công');
            router.push('/');
            router.refresh();
        } catch {
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
        </Button>
    );
}
