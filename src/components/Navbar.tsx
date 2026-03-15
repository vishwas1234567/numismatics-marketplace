'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User as UserIcon, Heart, Search, ShoppingBag, Menu } from 'lucide-react';
import { useState } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { wishlistItems } = useWishlistStore();
  const { cartItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">NUMIS<span className="text-amber-600">MATIC</span></span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/marketplace" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Marketplace</Link>
              {user && (user.role === 'seller' || user.role === 'both') && (
                <>
                  <Link href="/sell" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Sell</Link>
                  <Link href="/collection" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">My Collection</Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <Link href="/wishlist" className="p-2 text-zinc-400 hover:text-zinc-500 relative transition-colors">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="p-2 text-zinc-400 hover:text-zinc-500 relative transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  {totalCartItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
                <Link href="/messages" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Messages</Link>
                <Link href="/profile" className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/marketplace" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Marketplace</Link>
            {user ? (
              <>
                {(user.role === 'seller' || user.role === 'both') && (
                  <>
                    <Link href="/sell" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Sell</Link>
                    <Link href="/collection" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">My Collection</Link>
                  </>
                )}
                <Link href="/wishlist" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Wishlist ({wishlistItems.length})</Link>
                <Link href="/cart" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Cart ({totalCartItems})</Link>
                <Link href="/messages" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Messages</Link>
                <Link href="/profile" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Profile</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900">Login</Link>
                <Link href="/register" className="block px-3 py-2 text-base font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
