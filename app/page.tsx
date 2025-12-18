import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/db';

async function getFlashSaleProducts() {
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
  return products.map(p => ({
    ...p,
    price: Number(p.price),
  }));
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
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Category Grid */}
          <CategoryGrid />

          {/* Flash Sale */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <FlashSale products={flashSaleProducts} />
          </div>

          {/* Featured Products */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Gợi Ý Hôm Nay</h2>
            <Suspense fallback={<LoadingSkeleton />}>
              <FeaturedProducts />
            </Suspense>
          </div>

          {/* Brand Showcase */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <BrandShowcase />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
