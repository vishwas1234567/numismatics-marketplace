import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coin } from '@/types/coin';

interface WishlistState {
  wishlistItems: Coin[];
  addToWishlist: (coin: Coin) => void;
  removeFromWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistItems: [],
      addToWishlist: (coin) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.find((c) => c.id === coin.id)
            ? state.wishlistItems
            : [...state.wishlistItems, coin],
        })),
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((c) => c.id !== id),
        })),
    }),
    { name: 'wishlist' }
  )
);
