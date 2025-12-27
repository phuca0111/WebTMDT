'use client';

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/format";

export default function ProductPriceFilter({
    initialMin,
    initialMax
}: {
    initialMin?: number;
    initialMax?: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default range: 0 - 50.000.000
    const LIMIT_MAX = 50000000;
    const [range, setRange] = useState([initialMin || 0, initialMax || LIMIT_MAX]);

    // Update local state when URL params change (e.g. clear filters)
    useEffect(() => {
        setRange([initialMin || 0, initialMax || LIMIT_MAX]);
    }, [initialMin, initialMax]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (range[0] > 0) params.set('minPrice', range[0].toString());
        else params.delete('minPrice');

        if (range[1] < LIMIT_MAX) params.set('maxPrice', range[1].toString());
        else params.delete('maxPrice');

        // Reset page to 1 when filtering
        params.set('page', '1');

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <Slider
                defaultValue={[0, LIMIT_MAX]}
                min={0}
                max={LIMIT_MAX}
                step={100000}
                value={range}
                onValueChange={(val) => setRange(val)}
                className="my-4"
            />
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <Input
                        type="number"
                        value={range[0]}
                        onChange={(e) => setRange([Number(e.target.value), range[1]])}
                        className="h-8 text-xs px-2"
                        placeholder="Từ"
                        min={0}
                    />
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1">
                    <Input
                        type="number"
                        value={range[1]}
                        onChange={(e) => setRange([range[0], Number(e.target.value)])}
                        className="h-8 text-xs px-2"
                        placeholder="Đến"
                        max={LIMIT_MAX}
                    />
                </div>
            </div>
            <div className="text-xs text-gray-500 text-center">
                {formatPrice(range[0])} - {formatPrice(range[1])}
            </div>
            <Button
                size="sm"
                onClick={handleApply}
                className="w-full bg-[#1a94ff] hover:bg-[#0d5cb6] text-xs h-8"
            >
                Áp dụng
            </Button>
        </div>
    );
}
