'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistItems } = useWishlistStore();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">My Wishlist</h1>
        <p className="text-zinc-500 mb-8">Items you've saved for later consideration.</p>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((coin) => (
              <ProductCard key={coin.id} coin={coin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <HeartCrack className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-zinc-500 mb-6">Explore the marketplace and click the heart icon to save items.</p>
            <Link 
              href="/marketplace" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
