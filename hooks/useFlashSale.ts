'use client';

import { useState, useEffect } from 'react';

interface FlashSaleSettings {
    name: string;
    isActive: boolean;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    timeSlots: string; // "0,9,12,15,18,21"
    discountPercent: number;
}

interface UseFlashSaleReturn {
    settings: FlashSaleSettings | null;
    loading: boolean;
    isActive: boolean;
    currentSlot: number;
    nextSlot: number;
    timeLeft: { hours: number; minutes: number; seconds: number };
    isExpired: boolean;
}

const DEFAULT_SLOTS = [0, 9, 12, 15, 18, 21];

export function useFlashSale(): UseFlashSaleReturn {
    const [settings, setSettings] = useState<FlashSaleSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlot, setCurrentSlot] = useState(0);
    const [nextSlot, setNextSlot] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Helper functions
    const getSlots = (settingsValue: FlashSaleSettings | null) => {
        if (!settingsValue || !settingsValue.timeSlots) return DEFAULT_SLOTS;
        return settingsValue.timeSlots.split(',').map(Number).sort((a, b) => a - b);
    };

    const calculateSlotInfo = (slots: number[]) => {
        const now = new Date();
        const currentHour = now.getHours();

        // Find current slot
        let cSlot = slots[slots.length - 1];
        for (let i = slots.length - 1; i >= 0; i--) {
            if (currentHour >= slots[i]) {
                cSlot = slots[i];
                break;
            }
        }

        // Find next slot
        const cIndex = slots.indexOf(cSlot);
        let nSlot = slots[0];
        if (cIndex !== -1 && cIndex < slots.length - 1) {
            nSlot = slots[cIndex + 1];
        }

        return { cSlot, nSlot };
    };

    const getEndTime = (slots: number[]) => {
        const now = new Date();
        const currentHour = now.getHours();

        // Find next slot time
        for (const slot of slots) {
            if (currentHour < slot) {
                const endTime = new Date(now);
                endTime.setHours(slot, 0, 0, 0);
                return endTime;
            }
        }

        // If past all slots, next is tomorrow first slot
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(slots[0], 0, 0, 0);
        return tomorrow;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/flash-sale');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Failed to fetch flash sale settings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        if (loading) return;

        const slots = getSlots(settings);

        const updateTimer = () => {
            const { cSlot, nSlot } = calculateSlotInfo(slots);
            setCurrentSlot(cSlot);
            setNextSlot(nSlot);

            const now = new Date();
            const endTime = getEndTime(slots);
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setIsExpired(true);
                // logic to reset expired state could be handled here or by consumer
                return;
            }

            setIsExpired(false);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [settings, loading]);

    return {
        settings,
        loading,
        isActive: settings?.isActive ?? true, // Default true if not loaded yet to avoid flickering
        currentSlot,
        nextSlot,
        timeLeft,
        isExpired
    };
}
