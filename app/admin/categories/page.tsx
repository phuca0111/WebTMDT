'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Pencil, Trash2, ArrowLeft, Save, X,
    GripVertical, Check, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    order: number;
    isActive: boolean;
    _count?: { products: number };
}

const EMOJI_OPTIONS = [
    '📚', '🏠', '📱', '🧸', '🎧', '🔌', '💄', '🏍️',
    '👗', '🛒', '⚽', '👔', '🌍', '💻', '🎮', '📷',
    '🎵', '🍔', '🎁', '✨', '🔥', '⭐', '💎', '🎯'
];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        icon: '📚',
        description: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            setError('Không thể tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            icon: '📚',
            description: '',
            order: categories.length,
            isActive: true
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setIsAdding(false);
        setFormData({
            name: category.name,
            slug: category.slug,
            icon: category.icon || '📚',
            description: category.description || '',
            order: category.order,
            isActive: category.isActive
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.slug) {
            setError('Vui lòng nhập tên và slug');
            return;
        }

        try {
            const url = editingId
                ? `/api/categories/${editingId}`
                : '/api/categories';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Có lỗi xảy ra');
            }

            setSuccess(editingId ? 'Cập nhật thành công!' : 'Thêm danh mục thành công!');
            resetForm();
            fetchCategories();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Không thể xóa');

            setSuccess('Xóa thành công!');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Không thể xóa danh mục');
            setTimeout(() => setError(''), 3000);
        }
    };

    const toggleActive = async (category: Category) => {
        try {
            await fetch(`/api/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !category.isActive })
            });
            fetchCategories();
        } catch (err) {
            setError('Không thể cập nhật');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a94ff]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
                        <p className="text-gray-500">Thêm, sửa, xóa danh mục sản phẩm</p>
                    </div>
                </div>
                <Button
                    onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ ...formData, order: categories.length }); }}
                    className="bg-[#1a94ff] hover:bg-[#0d7fd9]"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm danh mục
                </Button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    {success}
                </div>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                            <div className="flex flex-wrap gap-1 p-2 border rounded-lg max-h-24 overflow-y-auto">
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => setFormData({ ...formData, icon: emoji })}
                                        className={`text-2xl p-1 rounded hover:bg-gray-100 ${formData.icon === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="VD: Điện Thoại"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="VD: dien-thoai"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả ngắn về danh mục"
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Hiển thị</span>
                        </label>
                        <div className="flex-1" />
                        <Button variant="outline" onClick={resetForm}>
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                        <Button onClick={handleSave} className="bg-[#1a94ff] hover:bg-[#0d7fd9]">
                            <Save className="h-4 w-4 mr-2" />
                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STT</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Icon</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên danh mục</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Slug</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sản phẩm</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    Chưa có danh mục nào. Hãy thêm danh mục mới!
                                </td>
                            </tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr key={category.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-2xl">{category.icon || '📦'}</td>
                                    <td className="py-3 px-4 font-medium">{category.name}</td>
                                    <td className="py-3 px-4 text-gray-500 text-sm">{category.slug}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant="secondary">{category._count?.products || 0} sản phẩm</Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => toggleActive(category)}>
                                            <Badge className={category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                                                {category.isActive ? 'Hiển thị' : 'Ẩn'}
                                            </Badge>
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(category.id)}
                                            >
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
