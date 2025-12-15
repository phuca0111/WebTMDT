import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl">
                <div className="aspect-square w-96 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl">
                <div className="aspect-square w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20" />
            </div>

            <div className="container relative mx-auto px-4 py-24 sm:py-32">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span>Giảm giá lớn mùa lễ hội</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Công nghệ{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            đỉnh cao
                        </span>
                        <br />
                        cho cuộc sống hiện đại
                    </h1>

                    {/* Description */}
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Khám phá bộ sưu tập điện thoại, laptop và phụ kiện công nghệ mới nhất
                        với giá tốt nhất thị trường. Giao hàng nhanh, bảo hành chính hãng.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/products">
                            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                                Khám phá ngay
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/products?category=Điện+thoại">
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                Xem điện thoại
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                        <div className="rounded-xl bg-blue-500/20 p-3">
                            <Truck className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Giao hàng miễn phí</h3>
                            <p className="text-sm text-gray-400">Đơn hàng trên 1 triệu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                        <div className="rounded-xl bg-purple-500/20 p-3">
                            <Shield className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Bảo hành chính hãng</h3>
                            <p className="text-sm text-gray-400">12-24 tháng</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                        <div className="rounded-xl bg-pink-500/20 p-3">
                            <Headphones className="h-6 w-6 text-pink-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Hỗ trợ 24/7</h3>
                            <p className="text-sm text-gray-400">Hotline: 1900 xxxx</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
