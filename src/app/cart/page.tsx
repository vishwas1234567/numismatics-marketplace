'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05; // 5% dummy tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center text-lg">
          Looks like you haven't added any numismatic treasures to your cart yet.
        </p>
        <Link 
          href="/marketplace" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
        >
          Start Discovering
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/marketplace" className="inline-flex items-center text-zinc-500 hover:text-amber-600 transition-colors mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" /> Continue Shopping
        </Link>

        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900" onClick={() => router.push(`/product/${item.id}`)}>
                  <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white hover:text-amber-600 transition-colors cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">{item.country} • {item.year}</p>
                    </div>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-4 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md text-zinc-500"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold w-6 text-center text-zinc-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md text-zinc-500"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-24">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-zinc-600 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span>Item Total ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                  <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Tax (5%)</span>
                  <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(tax)}</span>
                </div>
              </div>
              
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-zinc-900 dark:text-white">Grand Total</span>
                <span className="text-2xl font-black text-amber-600">{formatCurrency(total)}</span>
              </div>
              
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-5 w-5" />
              </button>
              
              <div className="mt-6 text-center text-xs text-zinc-500 flex justify-center items-center gap-2">
                <span>Secure dummy checkout process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
