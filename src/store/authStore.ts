import { create } from 'zustand';
import { User } from '@/types/user';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { useListingStore } from './listingStore';
import { useCollectionStore } from './collectionStore';
import { useWishlistStore } from './wishlistStore';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: (user) => set({ user }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
  initAuth: () => {
    // Initialize global listings immediately
    useListingStore.getState().initListings();
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            set({
              user: {
                id: firebaseUser.uid,
                name: data.name || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: data.role || 'buyer',
              },
              loading: false
            });
            
            // Initialize user-specific stores
            useCollectionStore.getState().initCollection(firebaseUser.uid);
            useWishlistStore.getState().initWishlist(firebaseUser.uid);
            useCartStore.getState().initCart(firebaseUser.uid);
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
        
        // Clear user-specific stores
        useCollectionStore.getState().initCollection('');
        useWishlistStore.getState().initWishlist('');
        useCartStore.getState().initCart('');
      }
    });
  }
}));
