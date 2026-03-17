import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coin } from '@/types/coin';
import { dummyCoins } from '@/data/coins';

interface ListingState {
  coins: Coin[];
  addListing: (coin: Coin) => void;
  removeListing: (id: string) => void;
  updateListing: (id: string, updates: Partial<Coin>) => void;
}

export const useListingStore = create<ListingState>()(
  persist(
    (set) => ({
      coins: dummyCoins, // default
      addListing: (coin) => set((state) => ({ coins: [...state.coins, coin] })),
      removeListing: (id) => set((state) => ({ coins: state.coins.filter((c) => c.id !== id) })),
      updateListing: (id, updates) =>
        set((state) => ({
          coins: state.coins.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    { 
      name: 'market_listings',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const mapping: Record<string, string> = { "seller_1": "james", "seller_2": "peter", "seller_3": "michael", "seller_4": "david", "seller_5": "sarah" };
          const mappedCoins = (persistedState.coins || []).map((c: any) => ({
            ...c,
            sellerId: mapping[c.sellerId] || c.sellerId
          }));
          return { ...persistedState, coins: mappedCoins };
        }
        return persistedState;
      }
    }
  )
);
