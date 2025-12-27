'use client';

import { useCompareStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompareFloatingBar() {
    const { items, removeItem, clearCompare } = useCompareStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto pb-1 max-w-[70%] lg:max-w-[80%]">
                        <div className="flex items-center gap-2 font-semibold text-gray-700 whitespace-nowrap mr-2">
                            <Scale className="h-5 w-5 text-[#1a94ff]" />
                            So sánh ({items.length}/3)
                        </div>

                        {items.map((item) => (
                            <div key={item.id} className="relative flex-shrink-0 group">
                                <div className="w-12 h-12 border border-gray-200 rounded overflow-hidden bg-white">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearCompare()}
                            className="hidden sm:inline-flex text-gray-500 hover:text-red-500 hover:bg-red-50"
                        >
                            Xóa tất cả
                        </Button>
                        <Link href="/compare">
                            <Button className="bg-[#1a94ff] hover:bg-[#0d5cb6] shadow-md whitespace-nowrap h-9 sm:h-10 text-xs sm:text-sm">
                                So sánh ngay <Scale className="h-4 w-4 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
