'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, Palette, Sparkles, Snowflake, PartyPopper, RotateCcw, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Theme {
    name: string;
    displayName: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerBg: string;
    navbarStyle: string;
    snowEffect: boolean;
    fireworkEffect: boolean;
    specialIcon: string;
    isActive?: boolean;
}

const DEFAULT_COLORS = {
    primaryColor: '#1a94ff',
    secondaryColor: '#ff424e',
    accentColor: '#00ab56',
    backgroundColor: '#f5f5fa',
    headerBg: '#ffffff',
};

export default function AdminLayoutPage() {
    const [presets, setPresets] = useState<Theme[]>([]);
    const [activeTheme, setActiveTheme] = useState<string>('default');
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);

    // Custom colors
    const [customColors, setCustomColors] = useState(DEFAULT_COLORS);
    const [showCustom, setShowCustom] = useState(false);
    const [savingCustom, setSavingCustom] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [presetsRes, activeRes] = await Promise.all([
                fetch('/api/admin/themes?presets=true'),
                fetch('/api/admin/themes?active=true'),
            ]);

            if (presetsRes.ok) {
                const data = await presetsRes.json();
                setPresets(data);
            }

            if (activeRes.ok) {
                const data = await activeRes.json();
                setActiveTheme(data.name || 'default');
                // Load custom colors from active theme
                if (data.primaryColor) {
                    setCustomColors({
                        primaryColor: data.primaryColor,
                        secondaryColor: data.secondaryColor,
                        accentColor: data.accentColor,
                        backgroundColor: data.backgroundColor,
                        headerBg: data.headerBg,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching themes:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = async (themeName: string) => {
        setApplying(themeName);
        try {
            const res = await fetch('/api/admin/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presetName: themeName }),
            });

            if (res.ok) {
                setActiveTheme(themeName);
                const preset = presets.find(t => t.name === themeName);
                if (preset) {
                    setCustomColors({
                        primaryColor: preset.primaryColor,
                        secondaryColor: preset.secondaryColor,
                        accentColor: preset.accentColor,
                        backgroundColor: preset.backgroundColor,
                        headerBg: preset.headerBg,
                    });
                }
                alert('Đã áp dụng giao diện thành công!');
            }
        } catch (error) {
            console.error('Error applying theme:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setApplying(null);
        }
    };

    const applyCustomColors = async () => {
        setSavingCustom(true);
        try {
            const res = await fetch('/api/admin/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    presetName: 'custom',
                    ...customColors,
                }),
            });

            if (res.ok) {
                setActiveTheme('custom');
                alert('Đã áp dụng màu tùy chỉnh!');
            }
        } catch (error) {
            console.error('Error applying custom colors:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setSavingCustom(false);
        }
    };

    const resetToDefault = () => {
        setCustomColors(DEFAULT_COLORS);
        applyTheme('default');
    };

    const getThemePreview = (theme: Theme) => {
        return (
            <div
                className="rounded-lg overflow-hidden border-2 transition-all"
                style={{
                    borderColor: activeTheme === theme.name ? theme.primaryColor : '#e5e7eb',
                    boxShadow: activeTheme === theme.name ? `0 0 0 3px ${theme.primaryColor}30` : 'none'
                }}
            >
                {/* Mock Header */}
                <div
                    className="h-10 flex items-center px-3 gap-2"
                    style={{ backgroundColor: theme.headerBg }}
                >
                    <div
                        className="w-16 h-4 rounded"
                        style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div className="flex-1" />
                    <div
                        className="w-8 h-4 rounded"
                        style={{ backgroundColor: theme.secondaryColor }}
                    />
                </div>

                {/* Mock Body */}
                <div
                    className="h-24 p-2 space-y-2"
                    style={{ backgroundColor: theme.backgroundColor }}
                >
                    <div className="flex gap-2">
                        <div
                            className="w-12 h-12 rounded"
                            style={{ backgroundColor: theme.primaryColor + '40' }}
                        />
                        <div className="flex-1 space-y-1">
                            <div
                                className="h-3 w-3/4 rounded"
                                style={{ backgroundColor: theme.primaryColor + '60' }}
                            />
                            <div
                                className="h-3 w-1/2 rounded"
                                style={{ backgroundColor: theme.secondaryColor + '60' }}
                            />
                        </div>
                    </div>
                    <div
                        className="h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: theme.accentColor }}
                    >
                        Button
                    </div>
                </div>

                {/* Effects indicator */}
                {(theme.snowEffect || theme.fireworkEffect) && (
                    <div className="absolute top-2 right-2 flex gap-1">
                        {theme.snowEffect && <Snowflake className="h-4 w-4 text-white drop-shadow" />}
                        {theme.fireworkEffect && <PartyPopper className="h-4 w-4 text-yellow-400 drop-shadow" />}
                    </div>
                )}
            </div>
        );
    };

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
                            <Palette className="h-5 w-5 text-purple-600" />
                            Quản lý Giao diện
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={resetToDefault}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Về mặc định
                        </Button>
                        <Badge variant="outline" className="text-purple-600 border-purple-300">
                            Đang sử dụng: {presets.find(t => t.name === activeTheme)?.displayName || activeTheme === 'custom' ? 'Tùy chỉnh' : 'Mặc định'}
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <>
                        {/* Custom Color Picker */}
                        <Card className="mb-6 border-2 border-dashed border-purple-300">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Paintbrush className="h-5 w-5 text-purple-600" />
                                        Tùy chỉnh màu sắc
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowCustom(!showCustom)}
                                    >
                                        {showCustom ? 'Ẩn' : 'Hiện'}
                                    </Button>
                                </CardTitle>
                                <CardDescription>Tự chọn màu sắc theo ý thích của bạn</CardDescription>
                            </CardHeader>

                            {showCustom && (
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {/* Primary Color */}
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Màu chính</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customColors.primaryColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, primaryColor: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <Input
                                                    value={customColors.primaryColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, primaryColor: e.target.value })}
                                                    className="flex-1 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Secondary Color */}
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Màu phụ</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customColors.secondaryColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, secondaryColor: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <Input
                                                    value={customColors.secondaryColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, secondaryColor: e.target.value })}
                                                    className="flex-1 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Accent Color */}
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Màu nhấn</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customColors.accentColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, accentColor: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <Input
                                                    value={customColors.accentColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, accentColor: e.target.value })}
                                                    className="flex-1 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Background Color */}
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Màu nền</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customColors.backgroundColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <Input
                                                    value={customColors.backgroundColor}
                                                    onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                                                    className="flex-1 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Header Color */}
                                        <div>
                                            <label className="text-sm font-medium block mb-1">Màu header</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customColors.headerBg}
                                                    onChange={(e) => setCustomColors({ ...customColors, headerBg: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <Input
                                                    value={customColors.headerBg}
                                                    onChange={(e) => setCustomColors({ ...customColors, headerBg: e.target.value })}
                                                    className="flex-1 text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <p className="text-sm text-gray-500 mb-2">Xem trước:</p>
                                        <div className="rounded-lg overflow-hidden border">
                                            <div className="h-8 flex items-center px-3" style={{ backgroundColor: customColors.headerBg }}>
                                                <div className="w-12 h-3 rounded" style={{ backgroundColor: customColors.primaryColor }} />
                                            </div>
                                            <div className="h-16 p-2 flex items-center gap-2" style={{ backgroundColor: customColors.backgroundColor }}>
                                                <div className="w-10 h-10 rounded" style={{ backgroundColor: customColors.primaryColor + '40' }} />
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-2 w-3/4 rounded" style={{ backgroundColor: customColors.secondaryColor }} />
                                                    <div className="h-2 w-1/2 rounded" style={{ backgroundColor: customColors.accentColor }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCustomColors(DEFAULT_COLORS)}
                                            className="flex-1"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            Reset màu
                                        </Button>
                                        <Button
                                            onClick={applyCustomColors}
                                            disabled={savingCustom}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                                        >
                                            {savingCustom ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                                            Áp dụng màu tùy chỉnh
                                        </Button>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Info Banner */}
                        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-6 w-6" />
                                    <div>
                                        <p className="font-medium">Thay đổi giao diện theo mùa lễ</p>
                                        <p className="text-sm opacity-90">Chọn một giao diện phù hợp với sự kiện để thu hút khách hàng</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Theme Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {presets.map((theme) => (
                                <Card
                                    key={theme.name}
                                    className={`relative overflow-hidden transition-all hover:shadow-lg ${activeTheme === theme.name ? 'ring-2 ring-purple-500' : ''
                                        }`}
                                >
                                    {activeTheme === theme.name && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-purple-500 text-white">
                                                <Check className="h-3 w-3 mr-1" />
                                                Đang dùng
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <span className="text-2xl">{theme.specialIcon}</span>
                                            {theme.displayName}
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            {theme.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Theme Preview */}
                                        <div className="relative">
                                            {getThemePreview(theme)}
                                        </div>

                                        {/* Color Palette */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Màu sắc:</span>
                                            <div className="flex gap-1">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                    title="Primary"
                                                />
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                                    style={{ backgroundColor: theme.secondaryColor }}
                                                    title="Secondary"
                                                />
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                                    style={{ backgroundColor: theme.accentColor }}
                                                    title="Accent"
                                                />
                                            </div>
                                        </div>

                                        {/* Effects */}
                                        {(theme.snowEffect || theme.fireworkEffect) && (
                                            <div className="flex gap-2">
                                                {theme.snowEffect && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Snowflake className="h-3 w-3 mr-1" />
                                                        Tuyết rơi
                                                    </Badge>
                                                )}
                                                {theme.fireworkEffect && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <PartyPopper className="h-3 w-3 mr-1" />
                                                        Pháo hoa
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Apply Button */}
                                        <Button
                                            onClick={() => applyTheme(theme.name)}
                                            disabled={applying !== null || activeTheme === theme.name}
                                            className="w-full"
                                            variant={activeTheme === theme.name ? "secondary" : "default"}
                                            style={{
                                                backgroundColor: activeTheme !== theme.name ? theme.primaryColor : undefined
                                            }}
                                        >
                                            {applying === theme.name ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Đang áp dụng...
                                                </>
                                            ) : activeTheme === theme.name ? (
                                                'Đang sử dụng'
                                            ) : (
                                                'Áp dụng giao diện'
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Note */}
                        <Card className="mt-6 bg-amber-50 border-amber-200">
                            <CardContent className="py-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Lưu ý:</strong> Sau khi áp dụng giao diện, bạn cần refresh trang để thấy thay đổi trên website.
                                    Một số hiệu ứng đặc biệt (tuyết rơi, pháo hoa) sẽ hiển thị trên trang chủ.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
        </div>
    );
}

