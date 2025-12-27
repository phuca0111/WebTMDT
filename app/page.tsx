import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import CategoriesSidebar from '@/components/home/CategoriesSidebar';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import YouMayLike from '@/components/home/YouMayLike';
import MarketingPopup from '@/components/home/MarketingPopup';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/db';

// Force dynamic rendering to avoid Prisma prerender errors on Vercel
export const dynamic = 'force-dynamic';

async function getFlashSaleProducts() {
  // Lấy 10 sản phẩm giá rẻ nhất làm Flash Sale
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { price: 'asc' },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      stock: true,
      soldCount: true,
    },
  });

  if (products.length > 0) {
    return products.map(p => ({
      ...p,
      price: Number(p.price),
    }));
  }

  // Return empty array as fallback
  return [];
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-3 space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const flashSaleProducts = await getFlashSaleProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5fa]">
      <MarketingPopup />
      <Navbar />

      <main className="flex-1 bg-[#f5f5fa]">
        {/* Hero Section với Sidebar nằm ngoài */}
        {/* Hero Section với Sidebar nằm ngoài */}
        <div className="container mx-auto px-4 pt-4">
          <div className="flex items-start gap-3">
            {/* Categories Sidebar - Sticky Container */}
            <div className="hidden lg:block w-60 flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
              <CategoriesSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Hero Banner */}
              <div className="mb-2">
                <HeroBanner />
              </div>

              {/* Khuyến Mãi Hot */}
              <CategoryGrid />

              {/* Flash Sale */}
              <div className="bg-white rounded-lg p-4 mb-2">
                <FlashSale products={flashSaleProducts} />
              </div>

              {/* Featured Products */}
              <div className="bg-white rounded-lg p-4 mb-2">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Gợi Ý Hôm Nay</h2>
                <Suspense fallback={<LoadingSkeleton />}>
                  <FeaturedProducts />
                </Suspense>
              </div>

              {/* Brand Showcase */}
              <div className="mb-2">
                <BrandShowcase />
              </div>

              {/* You May Like */}
              <div className="mb-2">
                <YouMayLike />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
