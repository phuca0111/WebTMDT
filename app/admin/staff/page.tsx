'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Shield, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
    id: string;
    username: string;
    name: string;
    role: string;
    createdAt: string;
}

export default function AdminStaffPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/staff');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi tải danh sách nhân viên');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;

        try {
            // Add DELETE endpoint logic if needed, currently not implemented in route
            toast.info('Chức năng xóa đang phát triển');
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân Viên</h1>
                    <p className="text-gray-500">Danh sách tài khoản quản trị hệ thống</p>
                </div>
                <Link href="/admin/staff/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm nhân viên
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên hiển thị</TableHead>
                            <TableHead>Tên đăng nhập</TableHead>
                            <TableHead>Quyền (Role)</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        user.role === 'SUPER_ADMIN' ? 'default' :
                                            user.role === 'MANAGER' ? 'secondary' : 'outline'
                                    }>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    {user.username !== 'admin' && (
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
