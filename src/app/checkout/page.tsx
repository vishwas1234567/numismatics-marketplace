'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { cartItems } = useCartStore();
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [user, router, cartItems]);

  if (!user || cartItems.length === 0) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05; // 5% dummy tax
  const total = subtotal + tax;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse input, allowing string matching or numeric equivalence
    const enteredAmount = parseFloat(amountInput.replace(/,/g, ''));
    
    if (isNaN(enteredAmount)) {
      setError('Please enter a valid numeric amount.');
      return;
    }

    // Strictly validate against exact total
    if (enteredAmount === Math.round(total * 100) / 100 || enteredAmount === total) {
      setError('');
      router.push('/success');
    } else {
      setError(`Payment Failed: Incorrect Amount. Please enter exactly ${total.toFixed(2)}`);
    }
  };

  return (
    <div className="min-h-[80vh] bg-zinc-50 dark:bg-zinc-900 py-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        
        <Link href="/cart" className="inline-flex items-center text-zinc-500 hover:text-amber-600 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
        </Link>
        
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          
          <div className="bg-amber-600 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent"></div>
            <Lock className="h-8 w-8 mx-auto mb-3 opacity-90 relative z-10" />
            <h1 className="text-2xl font-black tracking-tight relative z-10">Secure Checkout</h1>
            <p className="text-amber-100 text-sm mt-1 relative z-10">Dummy Payment Gateway</p>
          </div>
          
          <div className="p-8">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <p className="text-sm font-medium text-zinc-500 text-center mb-2 uppercase tracking-wider">Total Amount Due</p>
              <p className="text-4xl font-black text-zinc-900 dark:text-white text-center tabular-nums">{formatCurrency(total)}</p>
            </div>
            
            <form onSubmit={handlePayment} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900/30 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                  Verification Challenge: Enter Amount to Pay
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                  <input
                    type="text"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder={total.toString()}
                    className="w-full pl-10 pr-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-lg font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> For testing, type exactly <strong className="text-zinc-700 dark:text-zinc-300">{total}</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-4 rounded-xl shadow-lg hover:bg-black dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Pay Now
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
