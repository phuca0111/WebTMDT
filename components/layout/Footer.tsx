import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
    shop: [
        { name: 'Tất cả sản phẩm', href: '/products' },
        { name: 'Điện thoại', href: '/products?category=Điện+thoại' },
        { name: 'Laptop', href: '/products?category=Laptop' },
        { name: 'Phụ kiện', href: '/products?category=Phụ+kiện' },
    ],
    support: [
        { name: 'Liên hệ', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Chính sách đổi trả', href: '/return-policy' },
        { name: 'Bảo hành', href: '/warranty' },
    ],
    company: [
        { name: 'Về chúng tôi', href: '/about' },
        { name: 'Điều khoản sử dụng', href: '/terms' },
        { name: 'Chính sách bảo mật', href: '/privacy' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold">TS</span>
                            </div>
                            <span className="font-bold text-xl text-white">4 Đứa</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Cửa hàng công nghệ hàng đầu Việt Nam. Chuyên cung cấp các sản phẩm chính hãng với giá tốt nhất.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Cửa hàng</h3>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span>support@4dua.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-gray-700" />

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>© 2024 4 Đứa. Tất cả quyền được bảo lưu.</p>
                    <div className="flex gap-6">
                        {footerLinks.company.map((link) => (
                            <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
