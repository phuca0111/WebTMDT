'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const productSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    description: z.string().optional(),
    price: z.number().min(1000, 'Giá phải lớn hơn 1,000'),
    image: z.string().url('URL hình ảnh không hợp lệ'),
    category: z.string().min(1, 'Vui lòng chọn danh mục'),
    stock: z.number().min(0, 'Số lượng không thể âm'),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện'];

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            stock: 0,
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Create failed');

            toast.success('Đã tạo sản phẩm mới');
            router.push('/admin/products');
        } catch (error) {
            toast.error('Không thể tạo sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-xl">Thêm sản phẩm mới</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                        <Label htmlFor="name">Tên sản phẩm *</Label>
                        <Input
                            id="name"
                            placeholder="iPhone 15 Pro Max"
                            {...register('name')}
                            className="mt-1"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <Input
                            id="description"
                            placeholder="Mô tả chi tiết sản phẩm..."
                            {...register('description')}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Giá (VNĐ) *</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="29990000"
                                {...register('price', { valueAsNumber: true })}
                                className="mt-1"
                            />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="stock">Số lượng tồn kho *</Label>
                            <Input
                                id="stock"
                                type="number"
                                placeholder="50"
                                {...register('stock', { valueAsNumber: true })}
                                className="mt-1"
                            />
                            {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="category">Danh mục *</Label>
                        <Select onValueChange={(value) => setValue('category', value)}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="image">URL hình ảnh *</Label>
                        <Input
                            id="image"
                            placeholder="https://images.unsplash.com/..."
                            {...register('image')}
                            className="mt-1"
                        />
                        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}
                    </div>

                    <div className="flex gap-4">
                        <Link href="/admin/products" className="flex-1">
                            <Button type="button" variant="outline" className="w-full">
                                Hủy
                            </Button>
                        </Link>
                        <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Lưu sản phẩm
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
