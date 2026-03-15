import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CollectionItem } from '@/types/user';

interface CollectionState {
  collectionItems: CollectionItem[];
  addItem: (item: CollectionItem) => void;
  markForSale: (id: string, isForSale: boolean) => void;
  removeItem: (id: string) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collectionItems: [],
      addItem: (item) => set((state) => ({ collectionItems: [...state.collectionItems, item] })),
      markForSale: (id, isForSale) =>
        set((state) => ({
          collectionItems: state.collectionItems.map((item) =>
            item.id === id ? { ...item, isForSale } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          collectionItems: state.collectionItems.filter((item) => item.id !== id),
        })),
    }),
    { name: 'user_collection' }
  )
);
