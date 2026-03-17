'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/marketplace');
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white/10 dark:bg-zinc-900/40 backdrop-blur-md p-2 rounded-2xl flex items-center mb-8 border border-white/20">
      <Search className="text-zinc-400 ml-3 h-6 w-6" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by coin name, country, or year..." 
        className="bg-transparent border-none outline-none text-white w-full px-4 py-3 placeholder:text-zinc-400"
      />
      <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
        Search Now
      </button>
    </form>
  );
}
