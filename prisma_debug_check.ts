
import { Prisma } from '@prisma/client';

type OrderCreateInput = Prisma.OrderCreateInput;

const check: OrderCreateInput = {
    customerName: "Test",
    customerEmail: "test@test.com",
    customerPhone: "123",
    address: "123 St",
    total: 100,
    paymentMethod: "CASH",
    subtotal: 100, // This is the line we are checking
};

console.log("Type check passed if this runs without compilation error");
