'use client';

import { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';

// Đăng ký font hỗ trợ tiếng Việt
Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
            fontWeight: 'normal',
        },
        {
            src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
            fontWeight: 'bold',
        },
    ],
});

// Định nghĩa styles cho PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Roboto',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottom: 1,
        borderBottomColor: '#1a94ff',
        paddingBottom: 20,
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a94ff',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    invoiceInfo: {
        textAlign: 'right',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#f5f5fa',
        padding: 8,
        marginBottom: 10,
        color: '#1a94ff',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 120,
        color: '#666',
    },
    value: {
        flex: 1,
        fontWeight: 'bold',
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1a94ff',
        color: '#fff',
        padding: 8,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: 1,
        borderBottomColor: '#eee',
        padding: 8,
    },
    colNo: { width: '8%' },
    colName: { width: '42%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '17%', textAlign: 'right' },
    colTotal: { width: '18%', textAlign: 'right' },
    summary: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    summaryRow: {
        flexDirection: 'row',
        width: 250,
        justifyContent: 'space-between',
        marginBottom: 5,
        padding: 5,
    },
    summaryTotal: {
        flexDirection: 'row',
        width: 250,
        justifyContent: 'space-between',
        backgroundColor: '#1a94ff',
        color: '#fff',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#999',
        fontSize: 10,
        borderTop: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    thankYou: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 14,
        color: '#1a94ff',
        fontWeight: 'bold',
    },
});

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
    };
}

interface OrderData {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    subtotal: number;
    discount: number;
    total: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    items: OrderItem[];
}

// Component PDF Document
const InvoiceDocument = ({ order }: { order: OrderData }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const paymentMethods: Record<string, string> = {
        COD: 'Thanh toán khi nhận hàng',
        MOMO: 'Ví MoMo',
        BANK: 'Chuyển khoản ngân hàng',
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logo}>SHOP TMDT</Text>
                        <Text>Nhóm 2 - Team 4 Đua</Text>
                    </View>
                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>HÓA ĐƠN</Text>
                        <Text>Mã: #{order.id.slice(0, 8).toUpperCase()}</Text>
                        <Text>Ngày: {formatDate(order.createdAt)}</Text>
                    </View>
                </View>

                {/* Customer Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>THÔNG TIN KHÁCH HÀNG</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Họ tên:</Text>
                        <Text style={styles.value}>{order.customerName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{order.customerEmail}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Điện thoại:</Text>
                        <Text style={styles.value}>{order.customerPhone}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Địa chỉ:</Text>
                        <Text style={styles.value}>{order.address}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Thanh toán:</Text>
                        <Text style={styles.value}>{paymentMethods[order.paymentMethod] || order.paymentMethod}</Text>
                    </View>
                </View>

                {/* Products */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CHI TIẾT ĐƠN HÀNG</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.colNo}>STT</Text>
                            <Text style={styles.colName}>Sản phẩm</Text>
                            <Text style={styles.colQty}>SL</Text>
                            <Text style={styles.colPrice}>Đơn giá</Text>
                            <Text style={styles.colTotal}>Thành tiền</Text>
                        </View>
                        {/* Table Rows */}
                        {order.items.map((item, index) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={styles.colNo}>{index + 1}</Text>
                                <Text style={styles.colName}>{item.product.name}</Text>
                                <Text style={styles.colQty}>{item.quantity}</Text>
                                <Text style={styles.colPrice}>{Number(item.price).toLocaleString('vi-VN')}đ</Text>
                                <Text style={styles.colTotal}>{(Number(item.price) * item.quantity).toLocaleString('vi-VN')}đ</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text>Tạm tính:</Text>
                        <Text>{Number(order.subtotal).toLocaleString('vi-VN')}đ</Text>
                    </View>
                    {Number(order.discount) > 0 && (
                        <View style={styles.summaryRow}>
                            <Text>Giảm giá:</Text>
                            <Text>-{Number(order.discount).toLocaleString('vi-VN')}đ</Text>
                        </View>
                    )}
                    <View style={styles.summaryRow}>
                        <Text>Phí vận chuyển:</Text>
                        <Text>Miễn phí</Text>
                    </View>
                    <View style={styles.summaryTotal}>
                        <Text>TỔNG CỘNG:</Text>
                        <Text>{Number(order.total).toLocaleString('vi-VN')}đ</Text>
                    </View>
                </View>

                {/* Thank you */}
                <Text style={styles.thankYou}>Cam on quy khach da mua hang!</Text>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>SHOP THƯƠNG MẠI ĐIỆN TỬ - Nhóm 2 Team 4 Đua</Text>
                    <Text>Email: support@shop-tmdt.vn | Hotline: 1900 xxxx</Text>
                </View>
            </Page>
        </Document>
    );
};

// Component nút tải hóa đơn
export default function InvoiceDownloadButton({ order }: { order: OrderData }) {
    const [isClient, setIsClient] = useState(false);

    // Chỉ render PDFDownloadLink ở client
    useState(() => {
        setIsClient(true);
    });

    if (!isClient) {
        return (
            <Button variant="outline" disabled className="gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<InvoiceDocument order={order} />}
            fileName={`hoa-don-${order.id.slice(0, 8).toUpperCase()}.pdf`}
        >
            {({ loading }) => (
                <Button variant="outline" className="gap-2" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tạo PDF...
                        </>
                    ) : (
                        <>
                            <FileDown className="h-4 w-4" />
                            Tải hóa đơn PDF
                        </>
                    )}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
