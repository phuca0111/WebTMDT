'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
}

export default function AddToCartButton({
    id,
    name,
    price,
    image,
    stock,
}: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (stock <= 0) {
            toast.error('Sản phẩm đã hết hàng');
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addItem({ id, name, price, image });
        }

        toast.success(`Đã thêm ${quantity} "${name}" vào giỏ hàng`);
        setQuantity(1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (quantity < stock) setQuantity(quantity + 1);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1 || stock <= 0}
                        className="h-10 w-10"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increaseQuantity}
                        disabled={quantity >= stock || stock <= 0}
                        className="h-10 w-10"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                size="lg"
                className="flex-1 gap-2"
            >
                <ShoppingCart className="h-5 w-5" />
                {stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </Button>
        </div>
    );
}
