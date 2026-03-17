'use client';

import { useListingStore } from '@/store/listingStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Heart, ShieldCheck, HelpCircle, User as UserIcon } from 'lucide-react';
import { useState, MouseEvent } from 'react';
import { formatCurrency } from '@/utils/helpers';
import { dummySellers } from '@/data/sellers';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { coins } = useListingStore();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const [isZoomed, setIsZoomed] = useState(false);

  const coin = coins.find((c) => c.id === id);
  const isWishlisted = coin ? wishlistItems.some((item) => item.id === coin.id) : false;
  const seller = coin ? dummySellers.find((s) => s.id === coin.sellerId) : undefined;

  if (!coin) {
    return (
      <div className="min-h-screen py-20 bg-zinc-50 dark:bg-zinc-900 text-center">
        <h2 className="text-2xl font-bold dark:text-white">Product not found</h2>
        <Link href="/marketplace" className="text-amber-600 hover:underline mt-4 inline-block">Return to Marketplace</Link>
      </div>
    );
  }

  const toggleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(coin.id);
    } else {
      addToWishlist(coin);
    }
  };

  const handleActionClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      addToCart(coin);
      router.push('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/marketplace" className="inline-flex items-center text-zinc-500 hover:text-amber-600 transition-colors mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Marketplace
        </Link>
        
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 bg-zinc-100 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center relative">
            <button 
              onClick={() => setIsZoomed(!isZoomed)} 
              className={`relative overflow-hidden rounded-2xl w-full transition-all duration-300 ${isZoomed ? 'cursor-zoom-out h-[600px]' : 'cursor-zoom-in aspect-square'}`}
            >
              <Image
                src={coin.image}
                alt={coin.title}
                fill
                className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'hover:scale-105'}`}
                priority
              />
            </button>
            <div className="flex gap-4 mt-6 w-full overflow-x-auto pb-4 custom-scrollbar">
               {/* Dummy additional images functionality */}
               {[1, 2, 3].map((idx) => (
                 <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-amber-500">
                    <Image src={coin.image} alt={coin.title} fill className="object-cover" />
                 </div>
               ))}
            </div>
            {coin.rarity === 'Extremely Rare' && (
              <span className="absolute top-6 left-6 bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-xl">
                Extremely Rare
              </span>
            )}
            {coin.rarity === 'Rare' && (
              <span className="absolute top-6 left-6 bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-xl">
                Rare
              </span>
            )}
          </div>
          
          {/* Details */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                  {coin.title}
                </h1>
                <button
                  onClick={toggleWishlist}
                  className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-300 hover:scale-110 hover:bg-red-50 hover:text-red-500 transition-all ml-4 flex-shrink-0"
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-red-500 stroke-red-500' : ''}`} />
                </button>
              </div>
              
              <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                {formatCurrency(coin.price)}
              </div>
              
              <div className="flex items-center gap-2 mb-6 mt-[-1rem] text-sm text-zinc-500">
                <UserIcon className="h-4 w-4" /> 
                <span>Listed by <Link href={`/seller/${coin.sellerId}`} className="font-semibold text-amber-600 hover:underline cursor-pointer">{seller?.name || coin.sellerId}</Link></span>
              </div>
              
              <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
                {coin.description || "A magnificent historical artifact perfect for any serious collection."}
              </p>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-500">Country</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.country}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-500">Year</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.year < 0 ? `${Math.abs(coin.year)} BC` : coin.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-500">Condition</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.condition}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-500">Metal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.metal}</span>
                </div>
                {coin.weight && (
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-500">Weight</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.weight}</span>
                  </div>
                )}
                {coin.certification && (
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-500">Certification</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">{coin.certification}</span>
                  </div>
                )}
              </div>
              
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 p-4 border border-amber-200 dark:border-amber-900/30 flex items-start gap-4 mb-8">
                <ShieldCheck className="text-amber-600 flex-shrink-0 h-6 w-6 mt-1" />
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Authentic Listing.</strong> This item has been verified according to marketplace standards. Purchase with peace of mind.
                </p>
              </div>
            </div>
            
            {user?.id === coin.sellerId ? (
              <div className="flex bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 justify-center font-medium shadow-sm">
                This is your active listing.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleActionClick} 
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 hover:-translate-y-1 transition-all"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => {
                    if(!user) router.push('/login');
                    else router.push(`/messages?sellerId=${coin.sellerId}&coinId=${coin.id}`);
                  }} 
                  className="flex-1 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
                >
                  <MessageSquare className="h-5 w-5" /> Contact Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
