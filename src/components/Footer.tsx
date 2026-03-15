export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              NUMIS<span className="text-amber-600">MATIC</span>
            </h3>
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xs">
              The premier marketplace for numismatic treasures. Buy, sell, and discover rare coins and banknotes.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Ancient Coins</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Gold Coins</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Silver Coins</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Banknotes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Guide</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Safety</a></li>
              <li><a href="#" className="text-base text-zinc-500 hover:text-amber-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <p className="text-base text-zinc-400 xl:text-center text-center">
            &copy; 2026 Numismatic Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
