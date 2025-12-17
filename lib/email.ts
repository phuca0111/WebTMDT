import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationProps {
    email: string;
    orderId: string;
    customerName: string;
    total: number;
    address: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];
}

export const sendOrderConfirmationEmail = async ({
    email,
    orderId,
    customerName,
    total,
    address,
    items,
}: SendOrderConfirmationProps) => {
    try {
        const html = await render(
            OrderConfirmationEmail({
                customerName,
                orderId,
                total,
                address,
                items,
            })
        );

        const data = await resend.emails.send({
            from: 'Nhom2Team4Dua <onboarding@resend.dev>',
            to: email,
            subject: `Xác nhận đơn hàng #${orderId.slice(0, 8)}`,
            html: html,
        });

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
