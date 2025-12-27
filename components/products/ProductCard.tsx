'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Truck, Heart, BadgeCheck, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';

interface ProductCardProps {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    image: string;
    category: string;
    stock: number;
    soldCount?: number;      // Số lượng đã bán thực tế
    avgRating?: number;      // Rating trung bình từ reviews
    reviewCount?: number;    // Số lượng reviews
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
    category,
    stock,
    soldCount = 0,           // Mặc định 0 nếu chưa bán
    avgRating = 0,           // Mặc định 0 nếu chưa có review
    reviewCount = 0,         // Mặc định 0 nếu chưa có review
}: ProductCardProps) {
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const { items: compareItems, addItem: addToCompare, removeItem: removeFromCompare } = useCompareStore();

    const [isInList, setIsInList] = useState(false);
    const isInCompare = compareItems.some(i => i.id === id);

    useEffect(() => {
        setIsInList(isInWishlist(id));
    }, [id, isInWishlist]);

    // Calculate sale percent
    const hashCode = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const salePercent = 10 + (Math.abs(hashCode) % 25);
    const originalPrice = Math.round(price * (1 + salePercent / 100));

    // Format sold count
    const formatSoldCount = (count: number) => {
        if (count === 0) return '0';
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return count.toString();
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (stock <= 0) return;
        addItem({ id, name, price, image, stock });
        toast.success(`Đã thêm "${name}" vào giỏ hàng`);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleItem({ id, name, price, image, category });
        setIsInList(!isInList);
        toast.success(isInList ? `Đã xóa khỏi yêu thích` : `Đã thêm vào yêu thích`);
    };

    const handleToggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isInCompare) {
            removeFromCompare(id);
            toast.info('Đã xóa khỏi so sánh');
        } else {
            if (compareItems.length >= 3) {
                toast.error('Chỉ được so sánh tối đa 3 sản phẩm');
                return;
            }
            addToCompare({ id, name, price, image, category, avgRating, soldCount });
            toast.success('Đã thêm vào so sánh');
        }
    };

    return (
        <Link href={`/products/${id}`}>
            <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#1a94ff]/40 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />

                    {/* Sale Badge */}
                    <div className="absolute top-0 left-0 bg-[#ff424e] text-white text-xs font-bold px-1.5 py-1 rounded-br-lg">
                        -{salePercent}%
                    </div>

                    {/* Buttons Group: Wishlist & Compare */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {/* Wishlist Button */}
                        <button
                            onClick={handleToggleWishlist}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isInList
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 text-gray-400 hover:text-red-500 shadow'
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${isInList ? 'fill-current' : ''}`} />
                        </button>

                        {/* Compare Button */}
                        <button
                            onClick={handleToggleCompare}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isInCompare
                                ? 'bg-[#1a94ff] text-white'
                                : 'bg-white/90 text-gray-400 hover:text-[#1a94ff] shadow'
                                }`}
                            title="So sánh"
                        >
                            <Scale className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Out of Stock */}
                    {stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-gray-800 text-white text-sm px-3 py-1 rounded">Hết hàng</span>
                        </div>
                    )}

                    {/* Quick Add - Desktop */}
                    {stock > 0 && (
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6] text-white text-xs h-8"
                                size="sm"
                            >
                                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                Thêm vào giỏ
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 flex flex-col">
                    {/* Badges Row */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#1a94ff] bg-[#f0f8ff] px-1.5 py-0.5 rounded font-medium">
                            <BadgeCheck className="h-3 w-3" />
                            CHÍNH HÃNG
                        </span>
                        {price >= 1000000 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                                <Truck className="h-3 w-3" />
                                FREESHIP
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 leading-snug group-hover:text-[#1a94ff] transition-colors min-h-[40px]">
                        {name}
                    </h3>

                    {/* Rating & Sold */}
                    <div className="flex items-center gap-1 mb-2">
                        {avgRating > 0 ? (
                            <>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{avgRating.toFixed(1)}</span>
                                {reviewCount > 0 && <span className="text-xs text-gray-400">({reviewCount})</span>}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400">Chưa có đánh giá</span>
                        )}
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-400">Đã bán {formatSoldCount(soldCount)}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-blue-500">Còn {formatSoldCount(stock)}</span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-[#ff424e]">
                                {formatPrice(price)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
