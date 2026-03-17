'use client';

import { useParams, useRouter } from 'next/navigation';
import { dummySellers } from '@/data/sellers';
import { useListingStore } from '@/store/listingStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Star, MapPin, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

export default function SellerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { coins } = useListingStore();
  const { user } = useAuthStore();
  
  const seller = dummySellers.find((s) => s.id === id);
  const sellerCoins = coins.filter((c) => c.sellerId === id);

  if (!seller) {
    return (
      <div className="min-h-screen py-20 bg-zinc-50 dark:bg-zinc-900 text-center">
        <h2 className="text-2xl font-bold dark:text-white">Seller not found</h2>
        <Link href="/marketplace" className="text-amber-600 hover:underline mt-4 inline-block">Return to Marketplace</Link>
      </div>
    );
  }

  const handleContactSeller = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/messages?sellerId=${seller.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/marketplace" className="inline-flex items-center text-zinc-500 hover:text-amber-600 transition-colors mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Marketplace
        </Link>
        
        {/* Seller Info Section */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 mb-12 flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{seller.name}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{seller.bio}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-6">
              <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {seller.location}</div>
              <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Member since {seller.memberSince}</div>
              <div className="flex items-center gap-1.5 text-amber-600"><Star className="h-4 w-4 fill-amber-600" /> {seller.rating} / 5.0</div>
              <div className="flex items-center gap-1.5"><Award className="h-4 w-4" /> {seller.totalSales} Sales</div>
            </div>
            
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
             <button 
                onClick={handleContactSeller} 
                className="w-full md:w-auto bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold py-3 px-6 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
              >
                <MessageSquare className="h-5 w-5" /> Contact Seller
              </button>
          </div>
        </div>
        
        {/* Seller Collection Section */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Collection for Sale</h2>
        {sellerCoins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sellerCoins.map((coin) => (
              <ProductCard key={coin.id} coin={coin} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-950 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">This seller currently has no items for sale.</p>
          </div>
        )}
      </div>
    </div>
  );
}
