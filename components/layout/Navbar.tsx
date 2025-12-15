'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';

const categories = [
    { name: 'Điện thoại', href: '/products?category=Điện+thoại' },
    { name: 'Laptop', href: '/products?category=Laptop' },
    { name: 'Tablet', href: '/products?category=Tablet' },
    { name: 'Phụ kiện', href: '/products?category=Phụ+kiện' },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const totalItems = useCartStore((state) => state.getTotalItems());

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                {/* Top bar */}
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">TS</span>
                        </div>
                        <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            4 Đứa
                        </span>
                    </Link>

                    {/* Search bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pl-10 pr-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Admin link */}
                        <Link href="/admin" className="hidden sm:flex">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden lg:inline">Admin</span>
                            </Button>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart">
                            <Button variant="ghost" size="sm" className="relative gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="hidden lg:inline">Giỏ hàng</span>
                                {totalItems > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Categories - Desktop */}
                <nav className="hidden md:flex items-center gap-6 h-10 text-sm">
                    <Link href="/products" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Tất cả sản phẩm
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {/* Search - Mobile */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {/* Categories - Mobile */}
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/products"
                                className="py-2 text-gray-900 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tất cả sản phẩm
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="py-2 text-gray-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                className="py-2 text-gray-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin Dashboard
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
