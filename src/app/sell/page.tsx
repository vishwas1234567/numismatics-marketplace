'use client';

import { useAuthStore } from '@/store/authStore';
import { useListingStore } from '@/store/listingStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { Coin, CoinCondition, RarityLevel } from '@/types/coin';

export default function SellPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { addListing } = useListingStore();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Coins',
    country: '',
    year: '',
    metal: '',
    condition: 'Very Fine' as CoinCondition,
    weight: '',
    mint: '',
    description: '',
    price: '',
    rarity: 'Common' as RarityLevel,
    certification: '',
    image: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role === 'buyer') {
      router.push('/profile');
    }
  }, [user, router]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create new listing
    const newListing: Coin = {
      id: `listing_${Date.now()}`,
      title: formData.title,
      category: formData.category,
      country: formData.country,
      year: parseInt(formData.year) || new Date().getFullYear(),
      metal: formData.metal,
      condition: formData.condition,
      weight: formData.weight,
      mint: formData.mint,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      rarity: formData.rarity,
      image: formData.image || '/images/rupee.png', // Default fallback if they leave it empty
      sellerId: user.id,
      certification: formData.certification
    };

    // Simulate network delay
    setTimeout(() => {
      addListing(newListing);
      setIsSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/marketplace');
      }, 2000);
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex justify-center items-center">
        <div className="bg-white dark:bg-zinc-950 p-10 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Listing Created!</h2>
          <p className="text-zinc-500 mb-6">Your item is now perfectly placed on our marketplace.</p>
          <p className="text-sm font-medium text-amber-600 animate-pulse">Redirecting to marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Sell an Item</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Reach fellow collectors by creating a professional listing.</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              
              {/* Image Input */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Item Image URL <span className="text-zinc-400 font-normal">(Optional)</span></label>
                <input name="image" value={formData.image} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-zinc-400" placeholder="e.g. /images/rupee.png or https://example.com/coin.jpg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-zinc-400" placeholder="e.g. 1943 Lincoln Steel Cent" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="Coins">Coins</option>
                    <option value="Banknotes">Banknotes</option>
                    <option value="Ancient Coins">Ancient Coins</option>
                    <option value="Silver Coins">Silver Coins</option>
                    <option value="Gold Coins">Gold Coins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Price ($)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-400" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Country Origin</label>
                  <input required name="country" value={formData.country} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-400" placeholder="e.g. USA" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Year Minted</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-400" placeholder="e.g. 1943" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Metal / Material</label>
                  <input required name="metal" value={formData.metal} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-400" placeholder="e.g. Steel, Silver, Paper" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Fine">Fine</option>
                    <option value="Very Fine">Very Fine</option>
                    <option value="Extremely Fine">Extremely Fine</option>
                    <option value="Uncirculated">Uncirculated</option>
                    <option value="Proof">Proof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Rarity</label>
                  <select name="rarity" value={formData.rarity} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="Common">Common</option>
                    <option value="Scarce">Scarce</option>
                    <option value="Rare">Rare</option>
                    <option value="Extremely Rare">Extremely Rare</option>
                    <option value="Unique">Unique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Weight <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <input name="weight" value={formData.weight} onChange={handleChange} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-400" placeholder="e.g. 2.7g" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none placeholder:text-zinc-400" placeholder="Provide details about historical significance, flaws, provenance..."></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`px-8 py-4 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700 hover:-translate-y-1 hover:shadow-amber-600/40'}`}
                >
                  {isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
