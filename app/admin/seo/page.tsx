'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Search, Globe, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SeoSetting {
    id?: string;
    pageType: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
}

const PAGE_TYPES = [
    { value: 'homepage', label: 'Trang chủ', icon: '🏠' },
    { value: 'products', label: 'Sản phẩm', icon: '📦' },
    { value: 'categories', label: 'Danh mục', icon: '📁' },
    { value: 'about', label: 'Giới thiệu', icon: 'ℹ️' },
    { value: 'contact', label: 'Liên hệ', icon: '📞' },
];

export default function AdminSeoPage() {
    const [settings, setSettings] = useState<SeoSetting[]>([]);
    const [activeTab, setActiveTab] = useState('homepage');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentSetting, setCurrentSetting] = useState<SeoSetting>({
        pageType: 'homepage',
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        keywords: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const existing = settings.find(s => s.pageType === activeTab);
        if (existing) {
            setCurrentSetting(existing);
        } else {
            setCurrentSetting({
                pageType: activeTab,
                metaTitle: '',
                metaDescription: '',
                ogImage: '',
                keywords: '',
            });
        }
    }, [activeTab, settings]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/seo');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching SEO settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentSetting),
            });

            if (res.ok) {
                await fetchSettings();
                alert('Đã lưu cài đặt SEO!');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setSaving(false);
        }
    };

    const pageLabel = PAGE_TYPES.find(p => p.value === activeTab)?.label || activeTab;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </Link>
                        <h1 className="font-bold text-xl flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-600" />
                            Quản lý SEO
                        </h1>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Lưu thay đổi
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Page Types */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Chọn trang</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                {PAGE_TYPES.map((page) => (
                                    <button
                                        key={page.value}
                                        onClick={() => setActiveTab(page.value)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === page.value
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span className="text-lg">{page.icon}</span>
                                        <span>{page.label}</span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {loading ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                                    <p className="text-gray-500 mt-4">Đang tải...</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Meta Tags */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Search className="h-5 w-5 text-green-600" />
                                            Meta Tags - {pageLabel}
                                        </CardTitle>
                                        <CardDescription>
                                            Cài đặt tiêu đề và mô tả hiển thị trên Google Search
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Meta Title (Tiêu đề trang)
                                            </label>
                                            <Input
                                                value={currentSetting.metaTitle}
                                                onChange={(e) => setCurrentSetting({ ...currentSetting, metaTitle: e.target.value })}
                                                placeholder="VD: Mua sắm online giá rẻ | TikiShop"
                                                maxLength={70}
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                {currentSetting.metaTitle.length}/70 ký tự
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Meta Description (Mô tả)
                                            </label>
                                            <Textarea
                                                value={currentSetting.metaDescription}
                                                onChange={(e) => setCurrentSetting({ ...currentSetting, metaDescription: e.target.value })}
                                                placeholder="VD: TikiShop - Website mua sắm trực tuyến hàng đầu Việt Nam với hàng triệu sản phẩm..."
                                                rows={3}
                                                maxLength={160}
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                {currentSetting.metaDescription.length}/160 ký tự
                                            </p>
                                        </div>

                                        {/* Google Preview */}
                                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                            <p className="text-xs text-gray-500 mb-2">Xem trước trên Google:</p>
                                            <div className="bg-white rounded border p-3">
                                                <p className="text-blue-700 text-lg hover:underline cursor-pointer">
                                                    {currentSetting.metaTitle || 'Tiêu đề trang'}
                                                </p>
                                                <p className="text-green-700 text-sm">https://yoursite.com/{activeTab === 'homepage' ? '' : activeTab}</p>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {currentSetting.metaDescription || 'Mô tả trang sẽ hiển thị ở đây...'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Social Media */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5 text-purple-600" />
                                            Open Graph (Mạng xã hội)
                                        </CardTitle>
                                        <CardDescription>
                                            Ảnh hiển thị khi chia sẻ trên Facebook, Zalo...
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                OG Image URL
                                            </label>
                                            <Input
                                                value={currentSetting.ogImage || ''}
                                                onChange={(e) => setCurrentSetting({ ...currentSetting, ogImage: e.target.value })}
                                                placeholder="https://example.com/og-image.jpg"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                Kích thước khuyến nghị: 1200x630px
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Keywords */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-orange-600" />
                                            Từ khóa
                                        </CardTitle>
                                        <CardDescription>
                                            Các từ khóa liên quan đến trang (cách nhau bởi dấu phẩy)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={currentSetting.keywords || ''}
                                            onChange={(e) => setCurrentSetting({ ...currentSetting, keywords: e.target.value })}
                                            placeholder="mua sắm online, giá rẻ, freeship, ưu đãi..."
                                            rows={2}
                                        />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
