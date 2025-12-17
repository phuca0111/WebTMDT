import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Column,
    Row,
} from '@react-email/components';
import { formatPrice } from '../lib/format';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface OrderConfirmationEmailProps {
    customerName: string;
    orderId: string;
    items: OrderItem[];
    total: number;
    address: string;
}

export const OrderConfirmationEmail = ({
    customerName,
    orderId,
    items,
    total,
    address,
}: OrderConfirmationEmailProps) => {
    const previewText = `Xác nhận đơn hàng #${orderId.slice(0, 8)}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Đặt hàng thành công!</Heading>
                    <Text style={text}>
                        Xin chào {customerName},
                    </Text>
                    <Text style={text}>
                        Cảm ơn bạn đã đặt hàng tại nhom2team4dua. Chúng tôi đã nhận được đơn hàng của bạn và sẽ sớm xử lý.
                    </Text>

                    <Section style={orderInfo}>
                        <Text style={subHeading}>Mã đơn hàng: <span style={bold}>{orderId.slice(0, 8).toUpperCase()}</span></Text>
                        <Text style={text}>Địa chỉ giao hàng: {address}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Section>
                        <Text style={subHeading}>Chi tiết đơn hàng</Text>
                        {items.map((item, index) => (
                            <Row key={index} style={itemRow}>
                                <Column style={itemImageCol}>
                                    <Img src={item.image} width="64" height="64" alt={item.name} style={itemImage} />
                                </Column>
                                <Column>
                                    <Text style={itemName}>{item.name}</Text>
                                    <Text style={itemSub}>Số lượng: {item.quantity}</Text>
                                </Column>
                                <Column style={itemPriceCol}>
                                    <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={hr} />

                    <Section style={totalSection}>
                        <Row>
                            <Column>
                                <Text style={totalLabel}>Tổng cộng:</Text>
                            </Column>
                            <Column style={totalValueCol}>
                                <Text style={totalValue}>{formatPrice(total)}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Nếu bạn có bất kỳ câu hỏi nào, vui lòng trả lời email này hoặc liên hệ với chúng tôi qua hotline 1900 xxxx.
                        <br />
                        Trân trọng,
                        <br />
                        nhom2team4dua Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 20px',
};

const orderInfo = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    margin: '20px',
    borderRadius: '8px',
};

const subHeading = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
};

const bold = {
    fontWeight: 'bold',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const itemRow = {
    marginBottom: '15px',
    padding: '0 20px',
};

const itemImageCol = {
    width: '80px',
};

const itemImage = {
    borderRadius: '8px',
    objectFit: 'cover' as const,
};

const itemName = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0',
};

const itemSub = {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0 0',
};

const itemPriceCol = {
    textAlign: 'right' as const,
};

const itemPrice = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
};

const totalSection = {
    padding: '0 20px',
};

const totalLabel = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
};

const totalValueCol = {
    textAlign: 'right' as const,
};

const totalValue = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center' as const,
    padding: '0 20px',
};

export default OrderConfirmationEmail;
