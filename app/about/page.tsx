import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BadgeCheck, Users, Globe, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-[#1a94ff] to-[#0d5cb6] text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">Sứ Mệnh Của Chúng Tôi</h1>
                        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                            Mang đến trải nghiệm mua sắm trực tuyến tuyệt vời nhất cho người tiêu dùng Việt Nam.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a94ff]">
                                    <BadgeCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Chất Lượng Đảm Bảo</h3>
                                <p className="text-gray-600">Cam kết 100% hàng chính hãng, nguồn gốc xuất xứ rõ ràng.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Khách Hàng Là Trọng Tâm</h3>
                                <p className="text-gray-600">Luôn lắng nghe và hỗ trợ khách hàng 24/7 với thái độ tận tâm.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Phủ Sóng Toàn Quốc</h3>
                                <p className="text-gray-600">Giao hàng nhanh chóng đến mọi miền tổ quốc.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                                    <Award className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Dịch Vụ Hàng Đầu</h3>
                                <p className="text-gray-600">Tiên phong trong việc áp dụng công nghệ mới.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team/Story Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Our Team"
                                    className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <h2 className="text-3xl font-bold mb-6 text-gray-800">Câu Chuyện Của Chúng Tôi</h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        Được thành lập vào năm 2024 bởi nhóm sinh viên **Nhom2 Team4Dua** đầy nhiệt huyết, chúng tôi bắt đầu với một ước mơ đơn giản: xây dựng một nền tảng thương mại điện tử thân thiện và đáng tin cậy.
                                    </p>
                                    <p>
                                        Trải qua quá trình phát triển, chúng tôi không ngừng nỗ lực để cải thiện dịch vụ, mở rộng danh mục sản phẩm và mang đến những giá trị tốt nhất cho cộng đồng.
                                    </p>
                                    <p>
                                        Chúng tôi tin rằng công nghệ có thể thay đổi cuộc sống, và chúng tôi đang nỗ lực mỗi ngày để hiện thực hóa niềm tin đó.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
