'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

export default function SuccessPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const [orderSummary, setOrderSummary] = useState({ total: 0, items: 0 });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    // Only capture the items if we actually have a cart
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.05;
      const total = subtotal + tax;
      const itemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
      
      setOrderSummary({ total, items: itemsCount });
      
      // Clear cart permanently out of local storage immediately on mount
      clearCart();
    } else if (orderSummary.items === 0) {
      // If no valid cart was captured AND state is empty (user landed here randomly)
      router.push('/marketplace');
    }
  }, [cartItems, clearCart, orderSummary.items, router]);

  if (!user || orderSummary.items === 0) return null;

  return (
    <div className="min-h-[85vh] bg-zinc-50 dark:bg-zinc-900 py-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-10 text-center relative overflow-hidden">
        
        {/* Confetti Background Effect (CSS only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent opacity-70 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 shadow-inner border border-green-200 dark:border-green-800/50">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500 animate-bounce" />
          </div>

          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">Your rare numismatic treasures are on their way.</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 text-left border border-zinc-100 dark:border-zinc-800 mb-8 max-w-sm mx-auto shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <Package className="h-5 w-5 text-amber-600" /> Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span>Order Reference</span>
                <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs">#{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
                <span>Total Items</span>
                <span className="font-medium text-zinc-900 dark:text-white">{orderSummary.items}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span className="font-bold text-zinc-900 dark:text-white">Amount Paid</span>
                <span className="font-black text-amber-600 text-lg">{formatCurrency(orderSummary.total)}</span>
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 justify-center bg-green-50 dark:bg-green-900/10 py-2 rounded-lg font-medium">
               <ShieldCheck className="h-4 w-4" /> Payment verified securely
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/marketplace" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
