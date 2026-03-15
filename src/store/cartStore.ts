import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coin } from '@/types/coin';

export interface CartItem extends Coin {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Coin) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'shopping_cart',
    }
  )
);
