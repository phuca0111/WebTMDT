'use client';

import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    Ticket,
    BarChart3,
    Settings,
    Palette,
    LogOut,
    Shield,
    Menu,
    X,
    FolderTree,
    Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    userRole?: string;
}

export function AdminSidebar({ userRole = 'STAFF' }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Routes configuration - SHOW ALL FOR EVERYONE
    const routes = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
            color: 'text-sky-500',
        },
        {
            label: 'Đơn hàng',
            icon: ShoppingCart,
            href: '/admin/orders',
            color: 'text-violet-500',
        },
        {
            label: 'Sản phẩm',
            icon: ShoppingBag,
            href: '/admin/products',
            color: 'text-pink-700',
        },
        {
            label: 'Danh mục',
            icon: FolderTree,
            href: '/admin/categories',
            color: 'text-orange-700',
        },
        {
            label: 'Khách hàng (CRM)',
            icon: Users,
            href: '/admin/crm',
            color: 'text-orange-500',
        },
        {
            label: 'Nhân viên',
            icon: Shield,
            href: '/admin/staff',
            color: 'text-emerald-500',
        },
        {
            label: 'Vouchers',
            icon: Ticket,
            href: '/admin/vouchers',
            color: 'text-green-700',
        },
        {
            label: 'Marketing',
            icon: Megaphone,
            href: '/admin/marketing',
            color: 'text-red-500',
        },
        {
            label: 'Giao diện',
            icon: Palette,
            href: '/admin/layout-theme',
            color: 'text-indigo-500',
        },
        {
            label: 'SEO Settings',
            icon: BarChart3,
            href: '/admin/seo',
            color: 'text-blue-700',
        },
    ];

    // Show all routes
    const filteredRoutes = routes;

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-slate-700">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center font-bold text-white">
                                A
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                                Admin Panel
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                        {filteredRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-slate-800 group",
                                    pathname.startsWith(route.href) ? "bg-slate-800 text-white" : "text-slate-400"
                                )}
                            >
                                <route.icon className={cn("h-5 w-5 transition-colors", route.color, pathname.startsWith(route.href) ? "text-white" : "")} />
                                <span className={pathname.startsWith(route.href) ? "font-medium" : ""}>
                                    {route.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-800/50">
                            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                                <Users className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate text-white">
                                    {userRole}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    Online
                                </p>
                            </div>
                        </div>
                        <form action="/api/admin/logout" method="POST">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                <LogOut className="h-5 w-5" />
                                Đăng xuất
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
