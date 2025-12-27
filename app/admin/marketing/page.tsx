'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Image as ImageIcon, Megaphone, Calendar, ToggleLeft, ToggleRight, Loader2, X, Zap, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Banner {
    id: string;
    title: string;
    image: string;
    link: string;
    position: string;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    order: number;
}

interface Campaign {
    id: string;
    name: string;
    description: string;
    type: string;
    discount: number | null;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
}

const POSITION_LABELS: Record<string, string> = {
    hero: '🎠 Hero Banner',
    sidebar: '📐 Sidebar',
    popup: '💬 Popup',
};

const CAMPAIGN_TYPES: Record<string, { label: string; color: string }> = {
    flash_sale: { label: 'Flash Sale', color: 'bg-red-100 text-red-700' },
    discount: { label: 'Giảm giá', color: 'bg-green-100 text-green-700' },
    freeship: { label: 'Freeship', color: 'bg-blue-100 text-blue-700' },
};

const DEFAULT_TIME_SLOTS = ['0', '9', '12', '15', '18', '21'];

interface FlashSaleSettings {
    id?: string;
    name: string;
    isActive: boolean;
    startTime: string;
    endTime: string;
    timeSlots: string;
    discountPercent: number;
    productIds?: string[];
}

export default function AdminMarketingPage() {
    const [activeTab, setActiveTab] = useState<'banners' | 'campaigns' | 'flashsale'>('banners');
    const [banners, setBanners] = useState<Banner[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [products, setProducts] = useState<Product[]>([]); // List sản phẩm để chọn
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Banner | Campaign | null>(null);
    const [searchP, setSearchP] = useState(''); // Search product

    // Flash Sale state
    const [flashSale, setFlashSale] = useState<FlashSaleSettings>({
        name: 'Flash Sale',
        isActive: true,
        startTime: '',
        endTime: '',
        timeSlots: '0,9,12,15,18,21',
        discountPercent: 20,
    });
    const [savingFlashSale, setSavingFlashSale] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bannersRes, campaignsRes, flashSaleRes, productsRes] = await Promise.all([
                fetch('/api/admin/banners'),
                fetch('/api/admin/campaigns'),
                fetch('/api/admin/flash-sale'),
                fetch('/api/products'),
            ]);

            if (bannersRes.ok) setBanners(await bannersRes.json());
            if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
            if (productsRes.ok) setProducts(await productsRes.json());
            if (flashSaleRes.ok) {
                const fsData = await flashSaleRes.json();
                setFlashSale({
                    id: fsData.id,
                    name: fsData.name || 'Flash Sale',
                    isActive: fsData.isActive ?? true,
                    startTime: fsData.startTime ? new Date(fsData.startTime).toISOString().slice(0, 16) : '',
                    endTime: fsData.endTime ? new Date(fsData.endTime).toISOString().slice(0, 16) : '',
                    timeSlots: fsData.timeSlots || '0,9,12,15,18,21',
                    discountPercent: fsData.discountPercent || 20,
                    productIds: fsData.productIds || [],
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBanner = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
        try {
            await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa chiến dịch này?')) return;
        try {
            await fetch(`/api/admin/campaigns?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleToggleBanner = async (banner: Banner) => {
        try {
            await fetch('/api/admin/banners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
            });
            fetchData();
        } catch (error) {
            console.error('Error toggling:', error);
        }
    };

    const handleToggleCampaign = async (campaign: Campaign) => {
        try {
            await fetch('/api/admin/campaigns', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...campaign, isActive: !campaign.isActive }),
            });
            fetchData();
        } catch (error) {
            console.error('Error toggling:', error);
        }
    };

    const saveFlashSale = async () => {
        setSavingFlashSale(true);
        try {
            const res = await fetch('/api/admin/flash-sale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flashSale),
            });
            if (res.ok) {
                alert('Đã lưu cài đặt Flash Sale!');
            }
        } catch (error) {
            console.error('Error saving flash sale:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setSavingFlashSale(false);
        }
    };

    const toggleTimeSlot = (slot: string) => {
        const slots = flashSale.timeSlots.split(',').filter(s => s);
        if (slots.includes(slot)) {
            setFlashSale({ ...flashSale, timeSlots: slots.filter(s => s !== slot).join(',') });
        } else {
            setFlashSale({ ...flashSale, timeSlots: [...slots, slot].sort((a, b) => Number(a) - Number(b)).join(',') });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </Link>
                        <h1 className="font-bold text-xl flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-orange-600" />
                            Quản lý Marketing
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'banners' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('banners')}
                        className={activeTab === 'banners' ? 'bg-blue-600' : ''}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Banners ({banners.length})
                    </Button>
                    <Button
                        variant={activeTab === 'flashsale' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('flashsale')}
                        className={activeTab === 'flashsale' ? 'bg-red-600' : ''}
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Flash Sale
                    </Button>
                    <Button
                        variant={activeTab === 'campaigns' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('campaigns')}
                        className={activeTab === 'campaigns' ? 'bg-blue-600' : ''}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Chiến dịch ({campaigns.length})
                    </Button>
                </div>

                {loading ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                            <p className="text-gray-500 mt-4">Đang tải...</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Banners Tab */}
                        {activeTab === 'banners' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Quản lý Banner</h2>
                                    <Button onClick={() => { setEditingItem(null); setShowModal(true); }} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm Banner
                                    </Button>
                                </div>

                                {banners.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Chưa có banner nào</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {banners.map((banner) => (
                                            <Card key={banner.id}>
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <img
                                                        src={banner.image}
                                                        alt={banner.title}
                                                        className="w-32 h-20 object-cover rounded-lg bg-gray-100"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{banner.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline">
                                                                {POSITION_LABELS[banner.position] || banner.position}
                                                            </Badge>
                                                            <Badge className={banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                                                                {banner.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleBanner(banner)}
                                                        >
                                                            {banner.isActive ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => { setEditingItem(banner); setShowModal(true); }}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteBanner(banner.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Flash Sale Tab */}
                        {activeTab === 'flashsale' && (
                            <div className="space-y-6 max-w-4xl mx-auto">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-red-600" />
                                        Cài đặt Flash Sale
                                    </h2>
                                    <Button onClick={saveFlashSale} disabled={savingFlashSale} className="bg-red-600 hover:bg-red-700">
                                        {savingFlashSale ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Lưu cài đặt
                                    </Button>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Trạng thái & Thông tin chung</CardTitle>
                                        <CardDescription>Cấu hình chung cho chương trình Flash Sale toàn trang</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50">
                                            <div className="space-y-0.5">
                                                <label className="text-base font-medium">Kích hoạt Flash Sale</label>
                                                <p className="text-sm text-gray-500">Bật/tắt hiển thị Flash Sale trên trang chủ và trang sản phẩm</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={flashSale.isActive ? "text-green-600 font-bold" : "text-gray-500"}>
                                                    {flashSale.isActive ? "ĐANG BẬT" : "ĐANG TẮT"}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFlashSale({ ...flashSale, isActive: !flashSale.isActive })}
                                                    className={flashSale.isActive ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : ""}
                                                >
                                                    {flashSale.isActive ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Tên chương trình</label>
                                                <Input
                                                    value={flashSale.name}
                                                    onChange={(e) => setFlashSale({ ...flashSale, name: e.target.value })}
                                                    placeholder="VD: Flash Sale tháng 12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Giảm giá mặc định (%)</label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="99"
                                                    value={flashSale.discountPercent}
                                                    onChange={(e) => setFlashSale({ ...flashSale, discountPercent: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Khung giờ hoạt động</CardTitle>
                                        <CardDescription>Chọn các khung giờ sẽ diễn ra Flash Sale trong ngày (Tự động lặp lại)</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                            {DEFAULT_TIME_SLOTS.map((slot) => {
                                                const isSelected = flashSale.timeSlots.split(',').includes(slot);
                                                return (
                                                    <div
                                                        key={slot}
                                                        onClick={() => toggleTimeSlot(slot)}
                                                        className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${isSelected
                                                            ? 'border-red-500 bg-red-50 text-red-700'
                                                            : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Clock className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                                                        <div className="font-bold text-lg">{slot}:00</div>
                                                        <div className="text-xs text-gray-500">đến {Number(slot) + 3}:00</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sản phẩm Flash Sale</CardTitle>
                                        <CardDescription>Chọn các sản phẩm cho chiến dịch (Đã chọn: {(flashSale.productIds || []).length})</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-white border rounded-lg overflow-hidden">
                                            <div className="p-3 border-b bg-gray-50">
                                                <Input
                                                    placeholder="Tìm kiếm sản phẩm..."
                                                    value={searchP}
                                                    onChange={(e) => setSearchP(e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div className="h-80 overflow-y-auto p-2 space-y-1">
                                                {products.filter(p => p.name.toLowerCase().includes(searchP.toLowerCase())).map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors ${(flashSale.productIds || []).includes(product.id) ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50 border-transparent'
                                                            }`}
                                                        onClick={() => {
                                                            const current = flashSale.productIds || [];
                                                            if (current.includes(product.id)) {
                                                                setFlashSale({ ...flashSale, productIds: current.filter(id => id !== product.id) });
                                                            } else {
                                                                setFlashSale({ ...flashSale, productIds: [...current, product.id] });
                                                            }
                                                        }}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${(flashSale.productIds || []).includes(product.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                                                            {(flashSale.productIds || []).includes(product.id) && <Zap className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <img src={product.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate">{product.name}</div>
                                                            <div className="text-xs text-red-600 font-bold">{parseInt(product.price).toLocaleString()}đ</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {products.length === 0 && <p className="text-center text-gray-500 py-4">Không có sản phẩm nào</p>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Campaigns Tab */}
                        {activeTab === 'campaigns' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Quản lý Chiến dịch</h2>
                                    <Button onClick={() => { setEditingItem(null); setShowModal(true); }} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tạo chiến dịch
                                    </Button>
                                </div>

                                {campaigns.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Chưa có chiến dịch nào</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {campaigns.map((campaign) => (
                                            <Card key={campaign.id}>
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl">
                                                        🎉
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{campaign.name}</h3>
                                                        <p className="text-sm text-gray-500">{campaign.description}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge className={CAMPAIGN_TYPES[campaign.type]?.color || 'bg-gray-100'}>
                                                                {CAMPAIGN_TYPES[campaign.type]?.label || campaign.type}
                                                            </Badge>
                                                            {campaign.discount && (
                                                                <Badge variant="outline">Giảm {campaign.discount}%</Badge>
                                                            )}
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(campaign.startDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleCampaign(campaign)}
                                                        >
                                                            {campaign.isActive ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteCampaign(campaign.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Modal for Add/Edit */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {activeTab === 'banners' ? (editingItem ? 'Sửa Banner' : 'Thêm Banner') : (editingItem ? 'Sửa Chiến dịch' : 'Tạo Chiến dịch')}
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {activeTab === 'banners' ? (
                                <BannerForm
                                    initial={editingItem as Banner | null}
                                    onSave={() => { setShowModal(false); fetchData(); }}
                                    onCancel={() => setShowModal(false)}
                                />
                            ) : (
                                <CampaignForm
                                    initial={editingItem as Campaign | null}
                                    onSave={() => { setShowModal(false); fetchData(); }}
                                    onCancel={() => setShowModal(false)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function BannerForm({ initial, onSave, onCancel }: { initial: Banner | null; onSave: () => void; onCancel: () => void }) {
    const [form, setForm] = useState({
        title: initial?.title || '',
        image: initial?.image || '',
        link: initial?.link || '',
        position: initial?.position || 'hero',
        order: initial?.order || 0,
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(initial?.image || '');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setForm({ ...form, image: data.url });
            } else {
                alert('Upload thất bại!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi xảy ra khi upload!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = initial ? 'PUT' : 'POST';
            const body = initial ? { ...form, id: initial.id } : form;
            await fetch('/api/admin/banners', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            onSave();
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium">Tiêu đề *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            {/* Image Upload Section */}
            <div>
                <label className="text-sm font-medium block mb-2">Hình ảnh *</label>

                {/* Preview */}
                {preview && (
                    <div className="mb-3 relative">
                        <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
                )}

                {/* Upload Options */}
                <div className="space-y-2">
                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-3 text-center hover:border-blue-500 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                                {uploading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-gray-500">Đang upload...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">Tải ảnh từ máy tính</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    {/* Or divider */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">hoặc</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* URL Input */}
                    <Input
                        value={form.image}
                        onChange={(e) => {
                            setForm({ ...form, image: e.target.value });
                            setPreview(e.target.value);
                        }}
                        placeholder="Nhập URL hình ảnh..."
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Link (khi click)</label>
                <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products" />
            </div>
            <div>
                <label className="text-sm font-medium">Vị trí *</label>
                <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                >
                    <option value="hero">Hero Banner</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="popup">Popup</option>
                </select>
            </div>
            <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Hủy</Button>
                <Button type="submit" disabled={saving || uploading || !form.image} className="flex-1 bg-blue-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu'}
                </Button>
            </div>
        </form>
    );
}

function CampaignForm({ initial, onSave, onCancel }: { initial: Campaign | null; onSave: () => void; onCancel: () => void }) {
    const [form, setForm] = useState({
        name: initial?.name || '',
        description: initial?.description || '',
        type: initial?.type || 'discount',
        discount: initial?.discount || '',
        startDate: initial?.startDate ? new Date(initial.startDate).toISOString().split('T')[0] : '',
        endDate: initial?.endDate ? new Date(initial.endDate).toISOString().split('T')[0] : '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = initial ? 'PUT' : 'POST';
            const body = initial ? { ...form, id: initial.id } : form;
            await fetch('/api/admin/campaigns', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            onSave();
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium">Tên chiến dịch *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div>
                <label className="text-sm font-medium">Loại chiến dịch *</label>
                <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                >
                    <option value="flash_sale">Flash Sale</option>
                    <option value="discount">Giảm giá</option>
                    <option value="freeship">Freeship</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium">Phần trăm giảm (%)</label>
                <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} min="0" max="100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Ngày bắt đầu *</label>
                    <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                    <label className="text-sm font-medium">Ngày kết thúc *</label>
                    <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
            </div>
            <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Hủy</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-blue-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu'}
                </Button>
            </div>
        </form>
    );
}
