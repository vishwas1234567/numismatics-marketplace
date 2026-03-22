import { create } from 'zustand';
import { Coin } from '@/types/coin';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WishlistState {
  wishlistItems: Coin[];
  userId: string | null;
  loading: boolean;
  unsubscribe: (() => void) | null;
  initWishlist: (userId: string) => void;
  addToWishlist: (coin: Coin) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistItems: [],
  userId: null,
  loading: true,
  unsubscribe: null,
  initWishlist: (userId) => {
    const prevUnsub = get().unsubscribe;
    if (prevUnsub) prevUnsub();

    set({ userId, loading: true });
    if (!userId) {
      set({ wishlistItems: [], loading: false, unsubscribe: null });
      return;
    }

    const colRef = collection(db, 'users', userId, 'wishlist');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: Coin[] = [];
      snapshot.forEach(d => items.push(d.data() as Coin));
      set({ wishlistItems: items, loading: false });
    });
    set({ unsubscribe });
  },
  addToWishlist: async (coin) => {
    const { userId } = get();
    if (!userId) return;
    await setDoc(doc(db, 'users', userId, 'wishlist', coin.id), coin);
  },
  removeFromWishlist: async (id) => {
    const { userId } = get();
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId, 'wishlist', id));
  },
}));
