'use client';

import { useAuthStore } from '@/store/authStore';
import { useCollectionStore } from '@/store/collectionStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useListingStore } from '@/store/listingStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Grid, Tag, Heart, ShieldCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { collectionItems } = useCollectionStore();
  const { wishlistItems } = useWishlistStore();
  const { coins } = useListingStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const uniqueListingsMap = new Map();
  coins.filter(c => c.sellerId === user.id).forEach(c => uniqueListingsMap.set(c.id, c));
  const activeSellerListings = Array.from(uniqueListingsMap.values()) as typeof coins;
  
  const activeListingsCount = activeSellerListings.length;
  // const itemsForSaleCount = collectionItems.filter(c => c.isForSale).length + activeListingsCount; (unused anyway)
  
  const isSeller = user.role === 'seller' || user.role === 'both';
  const isBuyer = user.role === 'buyer' || user.role === 'both';
  
  const inventoryValue = activeSellerListings.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">Your Profile</h1>
        
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-8">
          <div className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="h-24 w-24 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0">
              <User className="h-10 w-10" />
            </div>
            <div className="text-center sm:text-left pt-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
                {user.name}
                {isSeller && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified Dealer
                  </span>
                )}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" /> {user.email} <span className="uppercase text-xs font-bold text-zinc-400">({user.role})</span>
              </p>
            </div>
            <div className="sm:ml-auto pt-2">
              <button
                onClick={logout}
                className="px-6 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            {isSeller && (
              <>
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-full text-amber-600 dark:text-amber-400 mb-3">
                    <Tag className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{activeListingsCount}</div>
                  <div className="text-sm text-zinc-500 font-medium">Active Listings</div>
                </div>
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-full text-green-600 dark:text-green-400 mb-3">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">₹{inventoryValue.toLocaleString()}</div>
                  <div className="text-sm text-zinc-500 font-medium">Inventory Value</div>
                </div>
              </>
            )}

            {isBuyer && (
              <>
                {user.role === 'buyer' && (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-full text-blue-600 dark:text-blue-400 mb-3">
                      <Grid className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">3</div>
                    <div className="text-sm text-zinc-500 font-medium">Followed Sellers</div>
                  </div>
                )}
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-full text-red-600 dark:text-red-400 mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{wishlistItems.length}</div>
                  <div className="text-sm text-zinc-500 font-medium">Saved Items</div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isSeller && (
            <>
              <Link href="/collection" className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg dark:text-white group-hover:text-amber-600 transition-colors">Manage Inventory</h3>
                  <Grid className="h-5 w-5 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">View, add, or edit your numismatic stock.</p>
              </Link>
              
              <Link href="/sell" className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg dark:text-white group-hover:text-amber-600 transition-colors">Create Listing</h3>
                  <Tag className="h-5 w-5 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">List new coins, notes, or medals to the marketplace.</p>
              </Link>
            </>
          )}
          
          {isBuyer && (
            <Link href="/wishlist" className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg dark:text-white group-hover:text-amber-600 transition-colors">Buyer Wishlist</h3>
                <Heart className="h-5 w-5 text-zinc-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Review items you've saved and purchase inquiries.</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
