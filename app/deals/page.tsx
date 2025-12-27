import { redirect } from 'next/navigation';

// Redirect /deals to /deals/hot-coupon (deal mặc định)
export default function DealsPage() {
    redirect('/deals/hot-coupon');
}
