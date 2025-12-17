import crypto from 'crypto';

// MoMo Sandbox Config
export const MOMO_CONFIG = {
    partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
    accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
    secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/order-success`
        : 'http://localhost:3000/order-success',
    ipnUrl: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/momo/callback`
        : 'http://localhost:3000/api/payment/momo/callback',
};

export interface MoMoPaymentRequest {
    orderId: string;
    amount: number;
    orderInfo: string;
    extraData?: string;
}

export interface MoMoPaymentResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    shortLink: string;
    qrCodeUrl?: string;
}

export function createMoMoSignature(
    rawSignature: string,
    secretKey: string
): string {
    return crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
}

export async function createMoMoPayment(
    request: MoMoPaymentRequest
): Promise<MoMoPaymentResponse> {
    const requestId = `${Date.now()}_${request.orderId}`;
    const orderInfo = request.orderInfo || `Thanh toán đơn hàng #${request.orderId}`;
    const extraData = request.extraData || '';

    const rawSignature = [
        `accessKey=${MOMO_CONFIG.accessKey}`,
        `amount=${request.amount}`,
        `extraData=${extraData}`,
        `ipnUrl=${MOMO_CONFIG.ipnUrl}`,
        `orderId=${request.orderId}`,
        `orderInfo=${orderInfo}`,
        `partnerCode=${MOMO_CONFIG.partnerCode}`,
        `redirectUrl=${MOMO_CONFIG.redirectUrl}?orderId=${request.orderId}`,
        `requestId=${requestId}`,
        `requestType=payWithMethod`,
    ].join('&');

    const signature = createMoMoSignature(rawSignature, MOMO_CONFIG.secretKey);

    const requestBody = {
        partnerCode: MOMO_CONFIG.partnerCode,
        partnerName: 'nhom2team4dua',
        storeId: 'TechStore',
        requestId,
        amount: request.amount,
        orderId: request.orderId,
        orderInfo,
        redirectUrl: `${MOMO_CONFIG.redirectUrl}?orderId=${request.orderId}`,
        ipnUrl: MOMO_CONFIG.ipnUrl,
        lang: 'vi',
        requestType: 'payWithMethod',
        autoCapture: true,
        extraData,
        signature,
    };

    const response = await fetch(MOMO_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data as MoMoPaymentResponse;
}

export function verifyMoMoCallback(params: Record<string, string>): boolean {
    const {
        accessKey, amount, extraData, message, orderId, orderInfo,
        orderType, partnerCode, payType, requestId, responseTime,
        resultCode, transId, signature
    } = params;

    const rawSignature = [
        `accessKey=${MOMO_CONFIG.accessKey}`,
        `amount=${amount}`,
        `extraData=${extraData}`,
        `message=${message}`,
        `orderId=${orderId}`,
        `orderInfo=${orderInfo}`,
        `orderType=${orderType}`,
        `partnerCode=${partnerCode}`,
        `payType=${payType}`,
        `requestId=${requestId}`,
        `responseTime=${responseTime}`,
        `resultCode=${resultCode}`,
        `transId=${transId}`,
    ].join('&');

    const expectedSignature = createMoMoSignature(rawSignature, MOMO_CONFIG.secretKey);
    return signature === expectedSignature;
}
