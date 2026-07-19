import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LazyImage } from '../components/LazyImage';
import { useDebounce } from '../hooks/useDebounce';
import {
  FolderHeart, Search, SlidersHorizontal, ArrowUpDown,
  Trash2, Move, TrendingUp, ShoppingBag,
  Info, BookmarkCheck
} from 'lucide-react';

export const Collection: React.FC = () => {
  const { 
    collectionItems, 
    filters, 
    setFilters, 
    removeFromCollection, 
    moveCollectionItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Owned' | 'Wishlist' | 'Selling'>('Owned');
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
  const [rawSearch, setRawSearch] = useState(filters.collection.search);
  const debouncedSearch = useDebounce(rawSearch, 350);

  // Clear filters
  const handleClearFilters = () => {
    setRawSearch('');
    setFilters((prev) => ({ ...prev, collection: { search: '', category: '', sort: 'dateAdded-desc' } }));
  };

  // Portfolio Stat Calculations
  const ownedItems = collectionItems.filter((item) => item.type === 'Owned');
  const wishlistItems = collectionItems.filter((item) => item.type === 'Wishlist');
  const sellingItems = collectionItems.filter((item) => item.type === 'Selling');

  const totalPortfolioValue = ownedItems.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const totalWishlistValue = wishlistItems.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const totalSellingValue = sellingItems.reduce((acc, curr) => acc + curr.price, 0);

  // Filter & Sort
  const { category, sort } = filters.collection;
  const activeSearch = rawSearch;

  const currentTabItems = collectionItems.filter((item) => item.type === activeTab);

  const filteredItems = currentTabItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === 'value-desc') return b.estimatedValue - a.estimatedValue;
    if (sort === 'value-asc') return a.estimatedValue - b.estimatedValue;
    if (sort === 'dateAdded-asc') return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    // Default newest added first
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Collection Hub
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Track your collectibles portfolio, monitor items you are hunting, and manage current sales.
        </p>
      </div>

      {/* Portfolio Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Owned Portfolio */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
              Owned Portfolio
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalPortfolioValue)}
            </h3>
            <p className="text-[10px] font-semibold text-slate-500">
              {ownedItems.length} verified collectibles
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/10">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Wishlist Value */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-slate-900 border border-pink-100 dark:border-pink-950/50 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-pink-650 dark:text-pink-400 uppercase tracking-wider">
              Wishlist Targets
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalWishlistValue)}
            </h3>
            <p className="text-[10px] font-semibold text-slate-500">
              {wishlistItems.length} items currently hunting
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-pink-550 text-white flex items-center justify-center shadow-lg shadow-pink-600/10 bg-pink-500">
            <FolderHeart className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Selling Listings */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-slate-900 border border-emerald-100 dark:border-emerald-950/50 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider">
              Market Listings
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalSellingValue)}
            </h3>
            <p className="text-[10px] font-semibold text-slate-500">
              {sellingItems.length} items listed for sale
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-550 text-white flex items-center justify-center shadow-lg shadow-emerald-600/10 bg-emerald-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(['Owned', 'Wishlist', 'Selling'] as const).map((tab) => {
          const count = collectionItems.filter((i) => i.type === tab).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMovingItemId(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
                isActive
                  ? 'border-indigo-650 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/50 dark:text-indigo-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Collection Search and Sorting */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search within ${activeTab} items...`}
              value={rawSearch}
              onChange={(e) => {
                setRawSearch(e.target.value);
                setFilters(prev => ({ ...prev, collection: { ...prev.collection, search: e.target.value } }));
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-56 flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                collection: { ...prev.collection, sort: e.target.value }
              }))}
              className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-slate-850 dark:text-slate-200"
            >
              <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="dateAdded-desc">Date Added: Newest</option>
              <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="dateAdded-asc">Date Added: Oldest</option>
              <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="value-desc">Value: High to Low</option>
              <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="value-asc">Value: Low to High</option>
            </select>
          </div>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Category:
          </div>

          <select
            value={category}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              collection: { ...prev.collection, category: e.target.value }
            }))}
            className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-850 dark:text-slate-200"
          >
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="">All Categories</option>
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="Trading Cards">Trading Cards</option>
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="Retro Games">Retro Games</option>
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="Comic Books">Comic Books</option>
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="Action Figures">Action Figures</option>
            <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250" value="Vintage Watches">Vintage Watches</option>
          </select>

          {(activeSearch || category) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-indigo-650 hover:text-indigo-850 font-semibold underline underline-offset-2 ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of collection items */}
      {sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          {activeSearch || category ? (
            <>
              <Info className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No search results</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                No items match "{activeSearch}" in your {activeTab} collection.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-3 px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all"
              >
                Reset search
              </button>
            </>
          ) : (
            <>
              {activeTab === 'Owned' && (
                <>
                  <BookmarkCheck className="w-16 h-16 text-slate-300 dark:text-slate-650 mb-3" />
                  <h3 className="text-lg font-bold text-slate-805 dark:text-white">Your Vault is Empty</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">
                    Keep track of items you own. Head over to the Marketplace and add a few!
                  </p>
                </>
              )}
              {activeTab === 'Wishlist' && (
                <>
                  <FolderHeart className="w-16 h-16 text-slate-350 dark:text-slate-650 mb-3" />
                  <h3 className="text-lg font-bold text-slate-805 dark:text-white">Wishlist is Empty</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">
                    Hunting for rare items? Mark items in the Marketplace to keep an eye on them.
                  </p>
                </>
              )}
              {activeTab === 'Selling' && (
                <>
                  <ShoppingBag className="w-16 h-16 text-slate-350 dark:text-slate-650 mb-3" />
                  <h3 className="text-lg font-bold text-slate-805 dark:text-white">Not selling anything</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">
                    List items from the Marketplace or add them directly here to start selling.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative shrink-0 overflow-hidden">
                <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-lg backdrop-blur-sm">{item.category}</span>
                <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{item.condition}</span>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {item.title}
                  </h3>

                  {/* Portfolio Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="block text-[10px] text-slate-450 font-bold uppercase">Estimated Value</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {formatCurrency(item.estimatedValue)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-455 font-bold uppercase">Date Added</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {new Date(item.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCollection(item.id, activeTab)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-900 rounded-xl transition-all"
                    title={`Remove from ${activeTab}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Move Popover Trigger */}
                  <div className="relative flex-1">
                    {movingItemId === item.id ? (
                      <div className="absolute right-0 bottom-0 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1 z-10 w-44 animate-scale-up">
                        <span className="text-[10px] font-bold text-slate-400 uppercase px-1 pb-1 border-b border-slate-100 dark:border-slate-800">Move item to:</span>
                        {activeTab !== 'Owned' && (
                          <button
                            onClick={() => {
                              moveCollectionItem(item.id, activeTab, 'Owned');
                              setMovingItemId(null);
                            }}
                            className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            Owned
                          </button>
                        )}
                        {activeTab !== 'Wishlist' && (
                          <button
                            onClick={() => {
                              moveCollectionItem(item.id, activeTab, 'Wishlist');
                              setMovingItemId(null);
                            }}
                            className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            Wishlist
                          </button>
                        )}
                        {activeTab !== 'Selling' && (
                          <button
                            onClick={() => {
                              moveCollectionItem(item.id, activeTab, 'Selling');
                              setMovingItemId(null);
                            }}
                            className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            Selling
                          </button>
                        )}
                        <button
                          onClick={() => setMovingItemId(null)}
                          className="text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMovingItemId(item.id)}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        <Move className="w-3.5 h-3.5" />
                        <span>Move Collection</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
