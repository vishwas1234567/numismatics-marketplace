import { create } from 'zustand';
import { CollectionItem } from '@/types/user';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CollectionState {
  collectionItems: CollectionItem[];
  userId: string | null;
  loading: boolean;
  unsubscribe: (() => void) | null;
  initCollection: (userId: string) => void;
  addItem: (item: CollectionItem) => Promise<void>;
  markForSale: (id: string, isForSale: boolean) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collectionItems: [],
  userId: null,
  loading: true,
  unsubscribe: null,
  initCollection: (userId) => {
    const prevUnsub = get().unsubscribe;
    if (prevUnsub) prevUnsub();

    set({ userId, loading: true });
    if (!userId) {
      set({ collectionItems: [], loading: false, unsubscribe: null });
      return;
    }

    const colRef = collection(db, 'users', userId, 'collection');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: CollectionItem[] = [];
      snapshot.forEach(d => items.push(d.data() as CollectionItem));
      set({ collectionItems: items, loading: false });
    });
    set({ unsubscribe });
  },
  addItem: async (item) => {
    const { userId } = get();
    if (!userId) return;
    await setDoc(doc(db, 'users', userId, 'collection', item.id), item);
  },
  markForSale: async (id, isForSale) => {
    const { userId } = get();
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId, 'collection', id), { isForSale });
  },
  removeItem: async (id) => {
    const { userId } = get();
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId, 'collection', id));
  },
}));
