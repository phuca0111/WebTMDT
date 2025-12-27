import Link from 'next/link';
import { Facebook, Youtube, Instagram, MapPin, Phone, Mail, Award, CheckCircle, Truck, Package } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white pt-10 pb-6 border-t border-gray-100 text-[#333]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Customer Support */}
                    <div>
                        <h4 className="font-medium text-base mb-4 text-gray-900">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li><Link href="/" className="hover:underline">Hotline: <strong className="text-gray-800">1900-9999</strong> <span className="text-gray-400">(1000đ/phút)</span></Link></li>
                            <li><Link href="/" className="hover:underline">Các câu hỏi thường gặp</Link></li>
                            <li><Link href="/contact" className="hover:underline">Gửi yêu cầu hỗ trợ</Link></li>
                            <li><Link href="/" className="hover:underline">Hướng dẫn đặt hàng</Link></li>
                            <li><Link href="/" className="hover:underline">Phương thức vận chuyển</Link></li>
                            <li><Link href="/" className="hover:underline">Chính sách đổi trả</Link></li>
                            <li><Link href="/" className="hover:underline">Hỗ trợ khách hàng: hotro@nhom2.vn</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: About & Payment */}
                    <div>
                        <h4 className="font-medium text-base mb-4 text-gray-900">Nhom2</h4>
                        <ul className="space-y-2 text-xs text-gray-500 mb-6">
                            <li><Link href="/about" className="hover:underline">Giới thiệu Tiki</Link></li>
                            <li><Link href="/" className="hover:underline">Tuyển dụng</Link></li>
                            <li><Link href="/" className="hover:underline">Chính sách bảo mật thanh toán</Link></li>
                            <li><Link href="/" className="hover:underline">Bán hàng cùng Nhom2</Link></li>
                            <li><Link href="/settings/theme" className="hover:underline flex items-center gap-1">🎨 Cài đặt giao diện</Link></li>
                        </ul>

                        <h4 className="font-medium text-base mb-4 text-gray-900">Thanh toán</h4>
                        <div className="flex flex-wrap gap-2">
                            {/* Mock Payment Icons */}
                            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="max-w-full max-h-full" /></div>
                            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="max-w-full max-h-full" /></div>
                            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="max-w-full max-h-full" /></div>
                            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center p-1 text-[10px] font-bold text-gray-600">COD</div>
                        </div>
                    </div>

                    {/* Column 3: Partners & Delivery */}
                    <div>
                        <h4 className="font-medium text-base mb-4 text-gray-900">Đối tác & Liên kết</h4>
                        <ul className="space-y-2 text-xs text-gray-500 mb-6">
                            <li><Link href="/" className="hover:underline">Quy chế hoạt động Sàn GDTMĐT</Link></li>
                            <li><Link href="/" className="hover:underline">Bán hàng cùng Tiki</Link></li>
                        </ul>

                        <h4 className="font-medium text-base mb-4 text-gray-900">Đơn vị vận chuyển</h4>
                        <div className="flex gap-2 text-xs text-gray-500">
                            <div className="flex flex-col items-center gap-1">
                                <Truck className="h-6 w-6 text-[#1a94ff]" />
                                <span>Khangnhanhnhanh</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 ml-4">
                                <Package className="h-6 w-6 text-green-600" />
                                <span>Anhnhanhnhanh</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Social & App */}
                    <div>
                        <h4 className="font-medium text-base mb-4 text-gray-900">Kết nối với chúng tôi</h4>
                        <div className="flex gap-3 mb-6">
                            <Link href="https://www.facebook.com/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90"><Facebook className="h-4 w-4" /></Link>
                            <Link href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:opacity-90"><Youtube className="h-4 w-4" /></Link>
                            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white flex items-center justify-center hover:opacity-90"><Instagram className="h-4 w-4" /></Link>
                        </div>

                        <h4 className="font-medium text-base mb-4 text-gray-900">Tải ứng dụng PhucNow</h4>
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-center p-2 text-gray-500 border border-gray-200">
                                QR Code
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-[10px] text-white">App Store</div>
                                <div className="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-[10px] text-white">Google Play</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6 text-xs text-gray-500">
                    <p className="mb-2">
                        Địa chỉ văn phòng: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh
                    </p>
                    <p className="mb-2">
                        Nhận hàng, góp ý: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh
                    </p>
                    <p>
                        © 2025 Bản quyền đây là đề tài do các thành viên nhóm 2 Môn Thương mại điện tử ĐHSPKT thực hiện, Phúc,Khang,Anh
                    </p>
                </div>

                {/* Bottom Trust Badges */}
                <div className="mt-4 flex gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                    <div className="border rounded px-2 py-1 flex items-center gap-1">
                        <Award className="h-4 w-4 text-blue-500" /> <span className="text-[10px]">Đã đăng ký Bộ Công Thương</span>
                    </div>
                    <div className="border rounded px-2 py-1 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" /> <span className="text-[10px]">Đã thông báo Bộ Công Thương</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
