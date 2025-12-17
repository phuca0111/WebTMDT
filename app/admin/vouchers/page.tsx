'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Ticket, Percent, DollarSign, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { formatPrice, formatDate } from '@/lib/format';

interface Voucher {
    id: string;
    code: string;
    description: string | null;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    usedCount: number;
    expiresAt: string | null;
    isActive: boolean;
    createdAt: string;
    _count?: { orders: number };
}

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENT' as 'PERCENT' | 'FIXED',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        expiresAt: '',
    });

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const res = await fetch('/api/admin/vouchers');
            if (res.ok) {
                const data = await res.json();
                setVouchers(data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải voucher');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'PERCENT',
            discountValue: '',
            minOrderValue: '',
            maxDiscount: '',
            usageLimit: '',
            expiresAt: '',
        });
        setEditingVoucher(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            code: formData.code,
            description: formData.description || null,
            discountType: formData.discountType,
            discountValue: parseFloat(formData.discountValue),
            minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
            maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            expiresAt: formData.expiresAt || null,
        };

        try {
            const url = editingVoucher
                ? `/api/admin/vouchers/${editingVoucher.id}`
                : '/api/admin/vouchers';
            const method = editingVoucher ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            toast.success(editingVoucher ? 'Đã cập nhật voucher' : 'Đã tạo voucher mới');
            setDialogOpen(false);
            resetForm();
            fetchVouchers();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            code: voucher.code,
            description: voucher.description || '',
            discountType: voucher.discountType,
            discountValue: voucher.discountValue.toString(),
            minOrderValue: voucher.minOrderValue?.toString() || '',
            maxDiscount: voucher.maxDiscount?.toString() || '',
            usageLimit: voucher.usageLimit?.toString() || '',
            expiresAt: voucher.expiresAt ? voucher.expiresAt.split('T')[0] : '',
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa voucher này?')) return;

        try {
            const res = await fetch(`/api/admin/vouchers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Đã xóa voucher');
                fetchVouchers();
            } else {
                throw new Error('Delete failed');
            }
        } catch {
            toast.error('Lỗi khi xóa voucher');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý Voucher</h1>
                    <p className="text-slate-500">Tạo và quản lý mã giảm giá</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo Voucher
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingVoucher ? 'Sửa Voucher' : 'Tạo Voucher mới'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="code">Mã Code *</Label>
                                    <Input
                                        id="code"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="SALE10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="discountType">Loại giảm</Label>
                                    <Select
                                        value={formData.discountType}
                                        onValueChange={(v: 'PERCENT' | 'FIXED') => setFormData({ ...formData, discountType: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENT">Phần trăm (%)</SelectItem>
                                            <SelectItem value="FIXED">Số tiền cố định</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Giảm 10% cho đơn hàng đầu tiên"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="discountValue">
                                        Giá trị {formData.discountType === 'PERCENT' ? '(%)' : '(VND)'} *
                                    </Label>
                                    <Input
                                        id="discountValue"
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        placeholder={formData.discountType === 'PERCENT' ? '10' : '50000'}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="minOrderValue">Đơn tối thiểu (VND)</Label>
                                    <Input
                                        id="minOrderValue"
                                        type="number"
                                        value={formData.minOrderValue}
                                        onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                        placeholder="500000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
                                    <Input
                                        id="maxDiscount"
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                        placeholder="100000"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="usageLimit">Số lượt dùng</Label>
                                    <Input
                                        id="usageLimit"
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="expiresAt">Ngày hết hạn</Label>
                                <Input
                                    id="expiresAt"
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600">
                                    {editingVoucher ? 'Cập nhật' : 'Tạo Voucher'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Vouchers List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Mã</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Giảm giá</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Đơn tối thiểu</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Đã dùng</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Hết hạn</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Trạng thái</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vouchers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                    <Ticket className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                    <p>Chưa có voucher nào</p>
                                </td>
                            </tr>
                        ) : (
                            vouchers.map((voucher) => (
                                <tr key={voucher.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-indigo-500" />
                                            <span className="font-mono font-bold text-indigo-600">{voucher.code}</span>
                                        </div>
                                        {voucher.description && (
                                            <p className="text-xs text-slate-500 mt-1">{voucher.description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {voucher.discountType === 'PERCENT' ? (
                                                <>
                                                    <Percent className="h-4 w-4 text-emerald-500" />
                                                    <span className="font-medium">{voucher.discountValue}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                                    <span className="font-medium">{formatPrice(voucher.discountValue)}</span>
                                                </>
                                            )}
                                        </div>
                                        {voucher.maxDiscount && (
                                            <p className="text-xs text-slate-500">Tối đa: {formatPrice(voucher.maxDiscount)}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {voucher.minOrderValue ? formatPrice(voucher.minOrderValue) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm">
                                            {voucher.usedCount}{voucher.usageLimit ? `/${voucher.usageLimit}` : ''}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {voucher.expiresAt ? formatDate(new Date(voucher.expiresAt)) : 'Không giới hạn'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={voucher.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                                            {voucher.isActive ? 'Hoạt động' : 'Tắt'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(voucher)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(voucher.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
