import { create } from 'zustand';
import { Coin } from '@/types/coin';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { dummyCoins } from '@/data/coins';

interface ListingState {
  coins: Coin[];
  loading: boolean;
  initListings: () => void;
  addListing: (coin: Coin) => Promise<void>;
  removeListing: (id: string) => Promise<void>;
  updateListing: (id: string, updates: Partial<Coin>) => Promise<void>;
}

let initialized = false;

export const useListingStore = create<ListingState>((set) => ({
  coins: [],
  loading: true,
  initListings: () => {
    if (initialized) return;
    initialized = true;
    const colRef = collection(db, 'listings');
    onSnapshot(colRef, async (snapshot) => {
      const items: Coin[] = [];
      snapshot.forEach(d => {
        items.push(d.data() as Coin);
      });
      
      // Seed initial dummy listings if completely empty
      if (items.length === 0 && snapshot.metadata.fromCache === false) {
        set({ loading: false }); // Render empty first, seed async
        for (const coin of dummyCoins) {
          try {
            await setDoc(doc(db, 'listings', coin.id), coin);
          } catch(e) {}
        }
      } else {
        set({ coins: items, loading: false });
      }
    });
  },
  addListing: async (coin) => {
    await setDoc(doc(db, 'listings', coin.id), coin);
  },
  removeListing: async (id) => {
    await deleteDoc(doc(db, 'listings', id));
  },
  updateListing: async (id, updates) => {
    await updateDoc(doc(db, 'listings', id), updates);
  },
}));
