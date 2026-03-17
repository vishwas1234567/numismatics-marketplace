'use client';

import { useAuthStore } from '@/store/authStore';
import { useCollectionStore } from '@/store/collectionStore';
import { useListingStore } from '@/store/listingStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/utils/helpers';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { CollectionItem } from '@/types/user';
import { CoinCondition, RarityLevel } from '@/types/coin';

export default function CollectionPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { collectionItems, markForSale, addItem, removeItem } = useCollectionStore();
  const { addListing, removeListing } = useListingStore();
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Coins',
    country: '',
    year: '',
    metal: '',
    condition: 'Very Fine' as CoinCondition,
    price: '', // estimated value
    rarity: 'Common' as RarityLevel,
    image: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role === 'buyer') {
      router.push('/profile');
    }
  }, [user, router]);

  if (!user) return null;

  const handleToggleForSale = (item: CollectionItem) => {
    const newIsForSale = !item.isForSale;
    markForSale(item.id, newIsForSale);
    
    if (newIsForSale) {
      addListing({ ...item, sellerId: user.id });
    } else {
      removeListing(item.id);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: CollectionItem = {
      id: `col_${Date.now()}`,
      title: formData.title,
      category: formData.category,
      country: formData.country,
      year: parseInt(formData.year) || new Date().getFullYear(),
      metal: formData.metal,
      condition: formData.condition,
      price: parseFloat(formData.price) || 0,
      rarity: formData.rarity,
      image: formData.image || '/images/rupee.png',
      isForSale: false,
      sellerId: user.id
    };
    addItem(newItem);
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">My Collection</h1>
            <p className="text-zinc-500 mt-1">Manage your personal numismatic items</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors"
          >
            <Plus className="h-5 w-5" /> Add New Item
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Add to Collection</h2>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white outline-none focus:border-amber-500" placeholder="Coin Name" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">Country</label>
                  <input required name="country" value={formData.country} onChange={handleChange} className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white outline-none focus:border-amber-500" placeholder="Country" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">Year</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white outline-none focus:border-amber-500" placeholder="Year" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">Estimated Value</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white outline-none focus:border-amber-500" placeholder="0.00" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-1">Image URL</label>
                  <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white outline-none focus:border-amber-500" placeholder="e.g. /images/rupee.png" />
               </div>
               <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                 <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-zinc-500 hover:text-zinc-700 font-medium">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">Save Item</button>
               </div>
            </form>
          </div>
        )}

        {collectionItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Image src="/images/rupee.png" alt="Empty" width={40} height={40} className="opacity-50 grayscale rounded-full" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Your collection is empty</h3>
            <p className="text-zinc-500">Start adding your numismatic treasures here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-48 bg-zinc-100 dark:bg-zinc-900 p-4 shrink-0 flex items-center justify-center">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  {item.isForSale && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                      <Tag className="h-3 w-3" /> For Sale
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      removeItem(item.id);
                      if (item.isForSale) {
                        removeListing(item.id);
                      }
                    }} 
                    className="absolute top-3 right-3 p-1.5 bg-white/80 dark:bg-black/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 rounded-lg transition-colors shadow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <div className="text-sm text-zinc-500 mb-3 flex items-center gap-2">
                      <span>{item.country}</span> &bull; <span>{item.year < 0 ? `${Math.abs(item.year)}BC` : item.year}</span>
                    </div>
                    <div className="font-semibold text-xl text-zinc-900 dark:text-zinc-100 mb-4">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      List on Marketplace
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="" 
                        className="sr-only peer" 
                        checked={item.isForSale}
                        onChange={() => handleToggleForSale(item)}
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
