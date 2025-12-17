'use client';

import { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchReviews();
        checkAuth();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            const data = await res.json();
            setReviews(data.reviews || []);
            setAvgRating(data.avgRating || 0);
        } catch {
            console.error('Error fetching reviews');
        } finally {
            setLoading(false);
        }
    };

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            setIsLoggedIn(!!data.user);
        } catch {
            setIsLoggedIn(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userRating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating: userRating,
                    comment: comment.trim() || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success(data.updated ? 'Đã cập nhật đánh giá!' : 'Đánh giá thành công!');
            setUserRating(0);
            setComment('');
            fetchReviews();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, size = 'sm') => {
        const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Đánh giá sản phẩm</h2>

            {/* Rating Summary */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
                <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">{avgRating.toFixed(1)}</div>
                    <div className="mt-1">{renderStars(Math.round(avgRating), 'lg')}</div>
                    <p className="text-sm text-slate-500 mt-1">{reviews.length} đánh giá</p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 w-6">{star}</span>
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-8">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Form */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mb-8 pb-6 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-3">Viết đánh giá của bạn</h3>

                    {/* Star Rating Input */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-slate-600">Đánh giá:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setUserRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-7 w-7 transition-colors ${star <= (hoverRating || userRating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-slate-200 text-slate-200 hover:fill-amber-200 hover:text-amber-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {userRating > 0 && (
                            <span className="text-sm text-slate-500">
                                ({['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'][userRating]})
                            </span>
                        )}
                    </div>

                    {/* Comment */}
                    <Textarea
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này... (không bắt buộc)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-4"
                        rows={3}
                    />

                    <Button
                        type="submit"
                        disabled={submitting || userRating === 0}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500"
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            ) : (
                <div className="mb-8 pb-6 border-b border-slate-100 text-center">
                    <p className="text-slate-500 mb-3">Đăng nhập để viết đánh giá</p>
                    <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Đăng nhập ngay →
                    </a>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="text-center py-8 text-slate-500">Đang tải đánh giá...</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">
                                    {review.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-800">{review.user.name}</span>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-xs text-slate-500 mb-2">
                                    {formatDate(new Date(review.createdAt))}
                                </p>
                                {review.comment && (
                                    <p className="text-slate-600">{review.comment}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
