'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Search, ShoppingCart, User, Menu, X,
    Smartphone, Laptop, Tablet, Headphones,
    LogIn, UserCircle, Heart, Home, ChevronDown,
    Truck, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore } from '@/lib/store';

const categories = [
    { name: 'Điện thoại', href: '/products?category=Điện+thoại', icon: Smartphone },
    { name: 'Laptop', href: '/products?category=Laptop', icon: Laptop },
    { name: 'Tablet', href: '/products?category=Tablet', icon: Tablet },
    { name: 'Phụ kiện', href: '/products?category=Phụ+kiện', icon: Headphones },
];

interface UserData {
    id: string;
    name: string;
    email: string;
}

export default function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const { items } = useCartStore();
    const wishlistItems = useWishlistStore((state) => state.items);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Main Header - Tiki Blue */}
            <div className={`bg-[#1a94ff] transition-shadow ${isScrolled ? 'shadow-lg' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 h-16">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-[#1a94ff] font-bold text-lg">N2</span>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-white font-bold text-lg leading-tight">nhom2</div>
                                    <div className="text-white/80 text-xs">team4dua</div>
                                </div>
                            </div>
                        </Link>

                        {/* Search Bar - Large */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                            <div className="relative flex">
                                <Input
                                    type="text"
                                    placeholder="Tìm sản phẩm, thương hiệu mong muốn..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-4 pr-24 bg-white border-0 rounded-lg text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-10 px-6 bg-[#0d5cb6] hover:bg-[#0a4a94] text-white font-medium rounded-r-lg transition-colors flex items-center gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="hidden sm:inline">Tìm kiếm</span>
                                </button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            {/* Home */}
                            <Link href="/" className="hidden lg:flex">
                                <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 px-3 gap-1">
                                    <Home className="h-5 w-5" />
                                    <span className="text-xs">Trang chủ</span>
                                </Button>
                            </Link>

                            {/* User */}
                            {user ? (
                                <Link href="/profile" className="hidden lg:flex">
                                    <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 px-3 gap-1">
                                        <UserCircle className="h-5 w-5" />
                                        <span className="text-xs truncate max-w-[60px]">{user.name}</span>
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login" className="hidden lg:flex">
                                    <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 px-3 gap-1">
                                        <UserCircle className="h-5 w-5" />
                                        <span className="text-xs">Tài khoản</span>
                                    </Button>
                                </Link>
                            )}

                            {/* Wishlist */}
                            <Link href="/wishlist" className="hidden sm:flex relative">
                                <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 px-3 gap-1">
                                    <Heart className="h-5 w-5" />
                                    <span className="text-xs">Yêu thích</span>
                                    {wishlistCount > 0 && (
                                        <Badge className="absolute top-0 right-0 h-5 min-w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold border-0">
                                            {wishlistCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative">
                                <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 px-3 gap-1">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="text-xs hidden sm:block">Giỏ hàng</span>
                                    {cartCount > 0 && (
                                        <Badge className="absolute top-0 right-0 h-5 min-w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold border-0">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            {/* Mobile Menu */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-white hover:bg-white/10"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Freeship Banner */}
            <div className="bg-[#f0f8ff] border-b border-[#dbeafe]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-9 text-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[#1a94ff]">
                                <Truck className="h-4 w-4" />
                                <span className="font-medium">Freeship</span>
                                <span className="text-gray-600">đơn từ 1 triệu</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4 text-[#1a94ff]" />
                                <span>Giao nhanh 2h</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <Link href="/profile" className="text-gray-600 hover:text-[#1a94ff] transition">
                                Theo dõi đơn hàng
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link href="/admin" className="text-gray-600 hover:text-[#1a94ff] transition">
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Bar */}
            <div className="bg-white border-b border-gray-200 hidden lg:block">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-1 h-11">
                        {/* Category Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShowCategories(true)}
                            onMouseLeave={() => setShowCategories(false)}
                        >
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#1a94ff] font-medium">
                                <Menu className="h-4 w-4" />
                                Danh mục
                                <ChevronDown className="h-3 w-3" />
                            </button>

                            {showCategories && (
                                <div className="absolute top-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.name}
                                            href={category.href}
                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] transition-colors"
                                        >
                                            <category.icon className="h-5 w-5" />
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#1a94ff] transition-colors"
                            >
                                <category.icon className="h-4 w-4" />
                                {category.name}
                            </Link>
                        ))}

                        <div className="ml-auto flex items-center gap-4 text-sm">
                            <span className="text-orange-500 font-medium">🔥 Deal Hot</span>
                            <span className="text-[#1a94ff] font-medium">⚡ Flash Sale</span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-b shadow-lg">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="space-y-1">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <category.icon className="h-5 w-5" />
                                    {category.name}
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 my-2" />
                            {user ? (
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <UserCircle className="h-5 w-5" />
                                    {user.name}
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-5 w-5" />
                                    Đăng nhập
                                </Link>
                            )}
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="h-5 w-5" />
                                Admin Dashboard
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
