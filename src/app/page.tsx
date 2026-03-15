import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { dummyCoins } from '@/data/coins';
import { ArrowRight, Search, ShieldCheck, Trophy, BadgeCent } from 'lucide-react';

export default function Home() {
  const featuredCoins = dummyCoins.slice(0, 4);
  const categories = [
    { name: 'Coins', image: '/images/rupee.png', count: 12 },
    { name: 'Banknotes', image: '/images/banknote.png', count: 5 },
    { name: 'Ancient Coins', image: '/images/owl.png', count: 4 },
    { name: 'Silver Coins', image: '/images/denarius.png', count: 8 },
    { name: 'Gold Coins', image: '/images/sovereign.png', count: 6 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-zinc-900/70" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Discover Rare <span className="text-amber-500">Numismatic Treasures</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            The world's premier destination for collectors to buy, sell, and discover authentic historical coins, medals, and banknotes.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white/10 dark:bg-zinc-900/40 backdrop-blur-md p-2 rounded-2xl flex items-center mb-8 border border-white/20">
            <Search className="text-zinc-400 ml-3 h-6 w-6" />
            <input 
              type="text" 
              placeholder="Search by coin name, country, or year..." 
              className="bg-transparent border-none outline-none text-white w-full px-4 py-3 placeholder:text-zinc-400"
            />
            <Link href="/marketplace" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
              Search Now
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-zinc-300">
            <span>Popular searches:</span>
            <Link href="/marketplace?q=Roman" className="hover:text-amber-500 transition-colors">Roman Coins</Link>
            <Link href="/marketplace?q=Gold" className="hover:text-amber-500 transition-colors">Gold Nuggets</Link>
            <Link href="/marketplace?q=Silver" className="hover:text-amber-500 transition-colors">Silver Dollars</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Secure Marketplace</h3>
              <p className="text-zinc-500 text-sm">Safe & verified listings for collectors</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
              <Trophy className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Rare Authentics</h3>
              <p className="text-zinc-500 text-sm">Expertly certified numismatic items</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
              <BadgeCent className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Sell your Collection</h3>
              <p className="text-zinc-500 text-sm">Reach thousands of passionate buyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Shop by Category</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Discover items curated just for you</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <Link href={`/marketplace?category=${cat.name}`} key={idx} className="group relative block rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                <p className="text-zinc-300 text-sm">{cat.count} Items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Featured Listings</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Hand-picked rare finds from our marketplace</p>
            </div>
            <Link href="/marketplace" className="hidden sm:flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCoins.map(coin => (
              <ProductCard key={coin.id} coin={coin} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/marketplace" className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-amber-600 text-amber-600 font-semibold rounded-xl hover:bg-amber-600 hover:text-white transition-colors">
              View All Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
