'use client';

import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UpdateOrderStatusProps {
    orderId: string;
    currentStatus: string;
}

const statusOptions = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PAID', label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    { value: 'SHIPPING', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    { value: 'COMPLETED', label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
];

export default function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
    const router = useRouter();

    const handleChange = async (newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Update failed');

            toast.success('Đã cập nhật trạng thái');
            router.refresh();
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const currentOption = statusOptions.find((opt) => opt.value === currentStatus);

    return (
        <Select defaultValue={currentStatus} onValueChange={handleChange}>
            <SelectTrigger className={`w-32 ${currentOption?.color}`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
