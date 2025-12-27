'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Search, ShoppingCart, User, Menu, X,
    Smartphone, Laptop, Tablet, Headphones,
    LogIn, UserCircle, Heart, Home, ChevronDown,
    Truck, MapPin, Clock, BadgeCheck, ShieldCheck, RotateCcw, Zap, Tag, CheckCircle, Flame, RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore, useSearchHistoryStore } from '@/lib/store';

const defaultCategories = [
    { name: 'Nhà Sách', href: '/products?category=Nhà+Sách', icon: '📚' },
    { name: 'Điện Thoại', href: '/products?category=Điện+Thoại+-+Máy+Tính+Bảng', icon: '📱' },
    { name: 'Thiết Bị Số', href: '/products?category=Thiết+Bị+Số+-+Phụ+Kiện', icon: '🎧' },
    { name: 'Điện Gia Dụng', href: '/products?category=Điện+Gia+Dụng', icon: '🔌' },
    { name: 'Làm Đẹp', href: '/products?category=Làm+Đẹp+-+Sức+Khỏe', icon: '💄' },
    { name: 'Thời Trang Nữ', href: '/products?category=Thời+Trang+Nữ', icon: '👗' },
    { name: 'Thời Trang Nam', href: '/products?category=Thời+Trang+Nam', icon: '👔' },
    { name: 'Thể Thao', href: '/products?category=Thể+Thao+-+Dã+Ngoại', icon: '⚽' },
    { name: 'Máy Vi Tính', href: '/products?category=Máy+Vi+Tính', icon: '💻' },
    { name: 'Nhà Cửa', href: '/products?category=Nhà+Cửa+-+Đời+Sống', icon: '🏠' },
    { name: 'Mẹ & Bé', href: '/products?category=Đồ+Chơi+-+Mẹ+%26+Bé', icon: '🧸' },
    { name: 'Bách Hóa', href: '/products?category=Bách+Hóa+Online', icon: '🛒' },
    { name: 'Hàng Quốc Tế', href: '/products?category=Hàng+Quốc+Tế', icon: '🌍' },
    { name: 'Xe Cộ', href: '/products?category=Ô+Tô+-+Xe+Máy+-+Xe+Đạp', icon: '🏍️' },
];

interface UserData {
    id: string;
    name: string;
    email: string;
}

export default function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { searches: searchHistory, addSearch, removeSearch } = useSearchHistoryStore();
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

    // Debounce search suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                try {
                    const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            setSuggestions(data.slice(0, 5));
                            setShowSuggestions(true);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch suggestions', error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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
        setShowSuggestions(false);
        setIsSearchFocused(false);
        if (searchQuery.trim()) {
            addSearch(searchQuery.trim());
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        addSearch(query);
        setIsSearchFocused(false);
        router.push(`/products?search=${encodeURIComponent(query)}`);
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
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="w-full h-10 pl-4 pr-24 bg-white border-0 rounded-lg text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-10 px-6 bg-[#0d5cb6] hover:bg-[#0a4a94] text-white font-medium rounded-r-lg transition-colors flex items-center gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="hidden sm:inline">Tìm kiếm</span>
                                </button>

                                {/* Search History Dropdown - Show when focused and no query */}
                                {isSearchFocused && !searchQuery && searchHistory.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
                                            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                                                Tìm kiếm gần đây
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => useSearchHistoryStore.getState().clearHistory()}
                                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                Xóa tất cả
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 p-3">
                                            {searchHistory.map((query) => (
                                                <div
                                                    key={query}
                                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 group transition-colors"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleHistoryClick(query)}
                                                        className="text-sm text-gray-700"
                                                    >
                                                        {query}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeSearch(query);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Search Suggestions */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                                        <div className="text-xs text-gray-400 px-4 py-2 border-b border-gray-50 uppercase font-semibold tracking-wider">
                                            Gợi ý tìm kiếm
                                        </div>
                                        {suggestions.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => {
                                                    setShowSuggestions(false);
                                                    addSearch(product.name);
                                                }}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[#1a94ff]">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs font-bold text-[#ff424e]">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                        </span>
                                                        {product.stock <= 0 && (
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                                                Hết hàng
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        <button
                                            type="submit"
                                            className="w-full text-center text-sm text-[#1a94ff] hover:bg-blue-50 py-2.5 font-medium transition-colors border-t border-blue-50/50"
                                        >
                                            Xem tất cả kết quả cho "{searchQuery}"
                                        </button>
                                    </div>
                                )}
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

            {/* Service Commitment & Quick Links Bar */}
            <div className="bg-white border-b border-gray-200 hidden lg:block">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between h-10 text-sm">
                        {/* Bên trái: Các cam kết dịch vụ */}
                        <div className="flex items-center gap-6 text-gray-500 overflow-x-auto scrollbar-hide">
                            <span className="flex items-center gap-1 font-bold text-blue-500 flex-shrink-0 uppercase text-xs">CAM KẾT</span>

                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span>100% hàng thật</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Truck className="h-4 w-4 text-blue-500" />
                                <span>Freeship mọi đơn</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Hoàn 200% nếu giả</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <RefreshCcw className="h-4 w-4 text-blue-500" />
                                <span>30 ngày đổi trả</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Zap className="h-4 w-4 text-blue-500" />
                                <span>Giao nhanh 2h</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Tag className="h-4 w-4 text-blue-500" />
                                <span>Giá siêu rẻ</span>
                            </div>
                        </div>

                        {/* Bên phải: Deal links */}
                        <div className="flex items-center gap-6 flex-shrink-0 pl-4 border-l border-gray-200">
                            <Link href="/deals/hot-coupon" className="flex items-center gap-1 text-orange-500 font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
                                <Flame className="h-4 w-4" />
                                Deal Hot
                            </Link>
                            <Link href="/deals/deal-soc" className="flex items-center gap-1 text-[#1a94ff] font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
                                <Zap className="h-4 w-4" />
                                Flash Sale
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-b shadow-lg">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="space-y-1">
                            {defaultCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#f5f5fa] hover:text-[#1a94ff] rounded-lg transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="text-lg">{category.icon}</span>
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
