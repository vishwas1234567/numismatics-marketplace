import { create } from 'zustand';
import { Coin } from '@/types/coin';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CartItem extends Coin {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  userId: string | null;
  loading: boolean;
  unsubscribe: (() => void) | null;
  initCart: (userId: string) => void;
  addToCart: (item: Coin) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  userId: null,
  loading: true,
  unsubscribe: null,
  initCart: (userId) => {
    const prevUnsub = get().unsubscribe;
    if (prevUnsub) prevUnsub();

    set({ userId, loading: true });
    if (!userId) {
      set({ cartItems: [], loading: false, unsubscribe: null });
      return;
    }

    const colRef = collection(db, 'users', userId, 'cart');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: CartItem[] = [];
      snapshot.forEach(d => items.push(d.data() as CartItem));
      set({ cartItems: items, loading: false });
    });
    set({ unsubscribe });
  },
  addToCart: async (item) => {
    const { userId, cartItems } = get();
    if (!userId) return;
    
    const existing = cartItems.find(i => i.id === item.id);
    const docRef = doc(db, 'users', userId, 'cart', item.id);
    if (existing) {
      await updateDoc(docRef, { quantity: existing.quantity + 1 });
    } else {
      await setDoc(docRef, { ...item, quantity: 1 });
    }
  },
  removeFromCart: async (itemId) => {
    const { userId } = get();
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId, 'cart', itemId));
  },
  updateQuantity: async (itemId, quantity) => {
    const { userId } = get();
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId, 'cart', itemId), { quantity: Math.max(1, quantity) });
  },
  clearCart: async () => {
    const { userId, cartItems } = get();
    if (!userId) return;
    
    const batch = writeBatch(db);
    cartItems.forEach(item => {
      const docRef = doc(db, 'users', userId, 'cart', item.id);
      batch.delete(docRef);
    });
    await batch.commit();
  },
}));
