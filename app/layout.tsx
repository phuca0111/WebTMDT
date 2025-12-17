import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "nhom2team4dua - Cửa hàng công nghệ hàng đầu",
  description: "Mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ chính hãng với giá tốt nhất. Giao hàng nhanh, bảo hành chính hãng.",
  keywords: ["điện thoại", "laptop", "công nghệ", "apple", "samsung", "iphone", "macbook"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
