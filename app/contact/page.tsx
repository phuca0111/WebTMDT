'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Tin nhắn của bạn đã được gửi thành công!');
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Hãy để lại lời nhắn hoặc liên hệ trực tiếp qua thông tin bên dưới.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-[#1a94ff]">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Hotline</h3>
                                    <p className="text-gray-600 text-sm">1900 123 456</p>
                                    <p className="text-gray-400 text-xs mt-1">Thứ 2 - Chủ Nhật: 8h00 - 21h00</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-red-50 p-3 rounded-lg text-red-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <p className="text-gray-600 text-sm">support@nhom2team4dua.com</p>
                                    <p className="text-gray-400 text-xs mt-1">Phản hồi trong vòng 24h</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-lg text-green-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Văn phòng</h3>
                                    <p className="text-gray-600 text-sm">
                                        123 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                            <Input required placeholder="Nhập họ tên của bạn" className="bg-gray-50 border-gray-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <Input required type="email" placeholder="example@gmail.com" className="bg-gray-50 border-gray-200" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Chủ đề</label>
                                        <Input required placeholder="Bạn cần hỗ trợ về vấn đề gì?" className="bg-gray-50 border-gray-200" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Nội dung</label>
                                        <Textarea required placeholder="Chi tiết nội dung..." className="min-h-[150px] bg-gray-50 border-gray-200" />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto bg-[#1a94ff] hover:bg-[#0d5cb6] px-8"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            'Đang gửi...'
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" /> Gửi tin nhắn
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
