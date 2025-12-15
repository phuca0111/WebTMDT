'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    image: string;
    category: string;
    stock: number;
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
    category,
    stock,
}: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (stock <= 0) {
            toast.error('Sản phẩm đã hết hàng');
            return;
        }

        addItem({
            id,
            name,
            price,
            image,
        });

        toast.success(`Đã thêm "${name}" vào giỏ hàng`);
    };

    return (
        <Link href={`/products/${id}`}>
            <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-sm">Hết hàng</Badge>
                        </div>
                    )}
                    {stock > 0 && stock <= 5 && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">
                            Còn {stock} sản phẩm
                        </Badge>
                    )}
                </div>

                <CardContent className="p-4">
                    {/* Category */}
                    <Badge variant="secondary" className="mb-2 text-xs">
                        {category}
                    </Badge>

                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[48px] group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {description}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    {/* Price */}
                    <span className="text-lg font-bold text-blue-600">
                        {formatPrice(price)}
                    </span>

                    {/* Add to cart button */}
                    <Button
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={stock <= 0}
                        className="gap-1"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Thêm</span>
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
