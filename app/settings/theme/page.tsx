'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, Palette, Sparkles, Snowflake, PartyPopper, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Theme {
    name: string;
    displayName: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerBg: string;
    snowEffect: boolean;
    fireworkEffect: boolean;
    specialIcon: string;
}

export default function ThemeSettingsPage() {
    const [presets, setPresets] = useState<Theme[]>([]);
    const [activeTheme, setActiveTheme] = useState<string>('default');
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);

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
                // Reload to apply theme
                window.location.reload();
            }
        } catch (error) {
            console.error('Error applying theme:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
            <Navbar />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6">
                        <Link href="/" className="text-gray-500 hover:text-[#1a94ff] flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Trang chủ
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-800 font-medium flex items-center gap-1">
                            <Palette className="h-4 w-4" />
                            Cài đặt giao diện
                        </span>
                    </div>

                    {/* Header */}
                    <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        <CardContent className="py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Cài đặt giao diện</h1>
                                    <p className="opacity-90">Thay đổi giao diện website theo sở thích của bạn</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <>
                            {/* Current Theme */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Giao diện hiện tại</h2>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-base py-1 px-3">
                                    {presets.find(t => t.name === activeTheme)?.specialIcon}{' '}
                                    {presets.find(t => t.name === activeTheme)?.displayName || 'Mặc định'}
                                </Badge>
                            </div>

                            {/* Theme Grid */}
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Chọn giao diện</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {presets.map((theme) => (
                                    <Card
                                        key={theme.name}
                                        className={`relative overflow-hidden transition-all hover:shadow-lg cursor-pointer ${activeTheme === theme.name ? 'ring-2 ring-purple-500 shadow-lg' : ''
                                            }`}
                                        onClick={() => !applying && applyTheme(theme.name)}
                                    >
                                        {activeTheme === theme.name && (
                                            <div className="absolute top-2 right-2 z-10">
                                                <Badge className="bg-purple-500 text-white text-xs">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Đang dùng
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Theme Preview */}
                                        <div
                                            className="h-24 flex items-center justify-center"
                                            style={{ backgroundColor: theme.backgroundColor }}
                                        >
                                            <div
                                                className="w-20 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                                style={{ backgroundColor: theme.primaryColor }}
                                            >
                                                Preview
                                            </div>
                                        </div>

                                        <CardHeader className="pb-2 pt-3">
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <span className="text-xl">{theme.specialIcon}</span>
                                                {theme.displayName}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="pt-0 pb-3">
                                            <p className="text-xs text-gray-500 mb-3">{theme.description}</p>

                                            {/* Color Palette */}
                                            <div className="flex items-center gap-1 mb-2">
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white shadow-sm"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white shadow-sm"
                                                    style={{ backgroundColor: theme.secondaryColor }}
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white shadow-sm"
                                                    style={{ backgroundColor: theme.accentColor }}
                                                />
                                            </div>

                                            {/* Effects */}
                                            {(theme.snowEffect || theme.fireworkEffect) && (
                                                <div className="flex gap-1">
                                                    {theme.snowEffect && (
                                                        <Badge variant="outline" className="text-[10px] py-0">
                                                            <Snowflake className="h-2.5 w-2.5 mr-0.5" />
                                                            Tuyết
                                                        </Badge>
                                                    )}
                                                    {theme.fireworkEffect && (
                                                        <Badge variant="outline" className="text-[10px] py-0">
                                                            <PartyPopper className="h-2.5 w-2.5 mr-0.5" />
                                                            Pháo hoa
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {applying === theme.name && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Note */}
                            <Card className="mt-6 bg-blue-50 border-blue-200">
                                <CardContent className="py-3">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Mẹo:</strong> Chọn giao diện phù hợp với mùa lễ để có trải nghiệm mua sắm thú vị hơn!
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
