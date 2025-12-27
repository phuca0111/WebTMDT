'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface CancelOrderButtonProps {
    orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Có lỗi xảy ra');
            }

            toast.success('Đã hủy đơn hàng thành công');
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể hủy đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    disabled={loading}
                >
                    Hủy đơn hàng
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hủy đơn hàng này?</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
                    <Button
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
