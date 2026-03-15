'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Coin } from '@/types/coin';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency } from '@/utils/helpers';
import { useState, MouseEvent } from 'react';

interface ProductCardProps {
  coin: Coin;
}

export default function ProductCard({ coin }: ProductCardProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isWishlisted = wishlistItems.some((item) => item.id === coin.id);

  const toggleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(coin.id);
    } else {
      addToWishlist(coin);
    }
  };

  return (
    <Link href={`/product/${coin.id}`} className="group block bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={coin.image}
          alt={coin.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-500 hover:scale-110 transition-all z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 stroke-red-500' : ''}`} />
        </button>
        {coin.rarity === 'Extremely Rare' && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            Extremely Rare
          </span>
        )}
        {coin.rarity === 'Rare' && (
          <span className="absolute bottom-3 left-3 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            Rare
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
            {coin.title}
          </h3>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
          <span>{coin.country}</span>
          <span>&bull;</span>
          <span>{coin.year}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="font-bold text-xl text-zinc-900 dark:text-white">
            {formatCurrency(coin.price)}
          </span>
          <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md">
            {coin.condition}
          </span>
        </div>
      </div>
    </Link>
  );
}
