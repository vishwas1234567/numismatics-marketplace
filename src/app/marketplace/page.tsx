'use client';

import { useListingStore } from '@/store/listingStore';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import Filters, { FilterState } from '@/components/Filters';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialQuery = searchParams.get('q');

  const { coins } = useListingStore();
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory ? [initialCategory] : [],
    metal: [],
    condition: [],
    yearRange: [-1000, 2026],
    priceRange: [0, 500000],
  });

  const categories = Array.from(new Set(coins.map((c) => c.category))).sort();
  const metals = Array.from(new Set(coins.map((c) => c.metal))).sort();
  const conditions = Array.from(new Set(coins.map((c) => String(c.condition)))).sort();

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      // Search
      const matchesSearch =
        coin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.year.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      // Filters
      if (filters.category.length > 0 && !filters.category.includes(coin.category)) return false;
      if (filters.metal.length > 0 && !filters.metal.includes(coin.metal)) return false;
      if (filters.condition.length > 0 && !filters.condition.includes(String(coin.condition))) return false;

      // Year Range
      if (coin.year < filters.yearRange[0] || coin.year > filters.yearRange[1]) return false;

      // Price Range
      if (coin.price < filters.priceRange[0] || coin.price > filters.priceRange[1]) return false;

      return true;
    });
  }, [coins, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">Marketplace</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Discover hundreds of rare coins, banknotes and medals.</p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar onSearch={setSearchQuery} initialQuery={initialQuery || ''} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <Filters
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
              metals={metals}
              conditions={conditions}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Showing {filteredCoins.length} items
            </div>
            {filteredCoins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
                {filteredCoins.map((coin) => (
                  <ProductCard key={coin.id} coin={coin} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No items found</h3>
                <p className="text-zinc-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
