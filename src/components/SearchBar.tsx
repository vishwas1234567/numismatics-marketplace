'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, initialQuery = '', placeholder = 'Search coins, countries, years...' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        className="block w-full p-4 pl-10 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:placeholder-zinc-400 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
