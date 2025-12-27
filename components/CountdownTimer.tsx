'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59,
    });

    useEffect(() => {
        // Tính thời gian còn lại đến 23:59:59 hôm nay
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay.getTime() - now.getTime();

            if (diff <= 0) {
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5" />
            <div className="flex items-center gap-1 font-mono text-lg">
                <span className="bg-white/30 px-2 py-1 rounded">{formatNumber(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-white/30 px-2 py-1 rounded">{formatNumber(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-white/30 px-2 py-1 rounded">{formatNumber(timeLeft.seconds)}</span>
            </div>
        </div>
    );
}
