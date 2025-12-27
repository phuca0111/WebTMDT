'use client';

import { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { useFlashSale } from '@/hooks/useFlashSale';

interface FlashSaleCountdownProps {
    compact?: boolean;
}

export default function FlashSaleCountdown({ compact = false }: FlashSaleCountdownProps) {
    const { isActive, currentSlot, nextSlot, timeLeft, isExpired, loading } = useFlashSale();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatTime = (n: number) => n.toString().padStart(2, '0');

    if (!mounted || loading) return null;
    if (!isActive) return null;

    if (compact) {
        return (
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-lg">
                <Zap className="h-4 w-4" fill="currentColor" />
                <span className="font-semibold">Flash Sale</span>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{formatTime(currentSlot)}:00 - {formatTime(nextSlot)}:00</span>
                </div>
                {isExpired ? (
                    <span className="text-xs animate-pulse">Đang cập nhật...</span>
                ) : (
                    <div className="flex gap-0.5 text-xs font-bold">
                        <span className="bg-white/30 px-1 rounded">{formatTime(timeLeft.hours)}</span>
                        <span>:</span>
                        <span className="bg-white/30 px-1 rounded">{formatTime(timeLeft.minutes)}</span>
                        <span>:</span>
                        <span className="bg-white/30 px-1 rounded">{formatTime(timeLeft.seconds)}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6" fill="currentColor" />
                    <h2 className="text-lg font-bold">Flash Sale</h2>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(currentSlot)}:00 - {formatTime(nextSlot)}:00</span>
                    </div>
                </div>

                {isExpired ? (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold animate-pulse">⏰ Đã kết thúc!</span>
                        <span className="text-sm opacity-80">Đang cập nhật...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-sm opacity-90">Kết thúc trong:</span>
                        <div className="flex gap-1">
                            <span className="bg-white text-red-500 px-2 py-1 rounded font-bold text-lg min-w-[32px] text-center">
                                {formatTime(timeLeft.hours)}
                            </span>
                            <span className="text-xl font-bold">:</span>
                            <span className="bg-white text-red-500 px-2 py-1 rounded font-bold text-lg min-w-[32px] text-center">
                                {formatTime(timeLeft.minutes)}
                            </span>
                            <span className="text-xl font-bold">:</span>
                            <span className="bg-white text-red-500 px-2 py-1 rounded font-bold text-lg min-w-[32px] text-center">
                                {formatTime(timeLeft.seconds)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
