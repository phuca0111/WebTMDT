'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateAdminPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'STAFF'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || 'Failed to create');
            }

            toast.success('Tạo nhân viên thành công');
            router.push('/admin/staff');
            router.refresh();
        } catch (error) {
            toast.error('Lỗi: Username có thể đã tồn tại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/staff">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Thêm nhân viên mới</h1>
                    <p className="text-gray-500">Tạo tài khoản quản trị viên mới</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Tên đăng nhập</Label>
                                <Input
                                    id="username"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên hiển thị</Label>
                                <Input
                                    id="name"
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Phân quyền</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn quyền" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">STAFF (Nhân viên - Chỉ xem/xử lý đơn)</SelectItem>
                                    <SelectItem value="MANAGER">MANAGER (Quản lý - Full quyền trừ hệ thống)</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">SUPER_ADMIN (Toàn quyền)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                * STAFF: Quản lý đơn hàng, xem sản phẩm.<br />
                                * MANAGER: Quản lý thêm Marketing, Voucher, CRM.<br />
                                * SUPER_ADMIN: Quản lý SEO, Giao diện, Nhân viên.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Tạo tài khoản'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
