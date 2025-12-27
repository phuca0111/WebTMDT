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
    paymentMethod: string;
}

// Status options cho thanh toán Online
const onlineStatusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PAID', label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    { value: 'SHIPPING', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    { value: 'COMPLETED', label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
];

// Status options cho COD (không có "Đã thanh toán")
const codStatusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    { value: 'SHIPPING', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    { value: 'COMPLETED', label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
];

export default function UpdateOrderStatus({ orderId, currentStatus, paymentMethod }: UpdateOrderStatusProps) {
    const router = useRouter();

    // Chọn status options dựa trên payment method
    const statusOptions = paymentMethod === 'COD' ? codStatusOptions : onlineStatusOptions;

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

    const currentOption = statusOptions.find((opt) => opt.value === currentStatus)
        || onlineStatusOptions.find((opt) => opt.value === currentStatus);

    return (
        <Select defaultValue={currentStatus} onValueChange={handleChange}>
            <SelectTrigger className={`w-36 ${currentOption?.color}`}>
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
