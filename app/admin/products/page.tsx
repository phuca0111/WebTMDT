import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/format';
import DeleteProductButton from './DeleteProductButton';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    if (!token) redirect('/admin');
    try {
        await jwtVerify(token, JWT_SECRET);
    } catch {
        redirect('/admin');
    }
}

async function getProducts() {
    return prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export default async function AdminProductsPage() {
    await verifyAdmin();
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="font-bold text-xl">Quản lý sản phẩm</h1>
                    </div>
                    <Link href="/admin/products/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Thêm sản phẩm
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Tồn kho</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatPrice(Number(product.price))}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'outline' : 'destructive'}>
                                            {product.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteProductButton productId={product.id} productName={product.name} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
