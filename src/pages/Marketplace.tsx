import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { MarketplaceItem } from '../context/AppContext';
import { DetailModal } from '../components/DetailModal';
import { LazyImage } from '../components/LazyImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { ViewToggle } from '../components/ViewToggle';
import { MarketplaceSkeletonGrid, MarketplaceSkeletonList } from '../components/Skeletons';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search, SlidersHorizontal, ArrowUpDown, PlusCircle,
  MapPin, Plus, HelpCircle, Package, ArrowUpRight, X
} from 'lucide-react';

const CONDITION_COLORS: Record<string, string> = {
  'Mint': 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400',
  'Near Mint': 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-800 dark:text-teal-400',
  'Very Fine': 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
  'Good': 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400',
  'Fair': 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400',
};

export const Marketplace: React.FC = () => {
  const {
    marketplaceItems, isLoading, error, filters, setFilters,
    addToCollection, addNewListing, refreshData,
    viewMode, setViewMode, toggleFavorite, isFavorite,
  } = useApp();

  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [rawSearch, setRawSearch] = useState(filters.marketplace.search);

  const debouncedSearch = useDebounce(rawSearch, 350);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Trading Cards');
  const [newCondition, setNewCondition] = useState<MarketplaceItem['condition']>('Mint');
  const [newLocation, setNewLocation] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEstimatedValue, setNewEstimatedValue] = useState('');

  const { category, condition, sort } = filters.marketplace;

  const FALLBACK_IMAGES: Record<string, string> = {
    'Trading Cards': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    'Retro Games': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    'Vintage Watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80',
    'Comic Books': 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80',
    'Action Figures': 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
  };

  const sortedItems = useMemo(() => {
    const s = debouncedSearch.toLowerCase();
    const filtered = marketplaceItems.filter((item) => {
      const matchSearch = !s || item.title.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || item.sellerName.toLowerCase().includes(s);
      const matchCat = !category || item.category === category;
      const matchCond = !condition || item.condition === condition;
      return matchSearch && matchCat && matchCond;
    });
    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  }, [marketplaceItems, debouncedSearch, category, condition, sort]);

  const hasFilters = !!(rawSearch || category || condition);

  const handleClearFilters = () => {
    setRawSearch('');
    setFilters((p) => ({ ...p, marketplace: { search: '', category: '', condition: '', sort: p.marketplace.sort } }));
  };

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newLocation) return;
    const fallback = FALLBACK_IMAGES[newCategory] || FALLBACK_IMAGES['Action Figures'];
    addNewListing({
      title: newTitle, price: parseFloat(newPrice) || 0, category: newCategory,
      condition: newCondition, location: newLocation, sellerName: 'You (CollectorHub)',
      image: newImage.trim() || fallback,
      description: newDescription || 'No description provided.',
      estimatedValue: parseFloat(newEstimatedValue) || parseFloat(newPrice) || 0,
    });
    setNewTitle(''); setNewPrice(''); setNewCategory('Trading Cards'); setNewCondition('Mint');
    setNewLocation(''); setNewImage(''); setNewDescription(''); setNewEstimatedValue('');
    setShowAddForm(false);
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Marketplace</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Browse and collect verified collectible listings.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Collectible</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleListSubmit} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-4 animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" /> List an Item for Sale
            </h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title *</label>
              <input required type="text" placeholder="e.g. 1999 Charizard PSA 10" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {Object.keys(FALLBACK_IMAGES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price (USD) *</label>
              <input required type="number" placeholder="450" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Value</label>
              <input type="number" placeholder="500" value={newEstimatedValue} onChange={e => setNewEstimatedValue(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Condition</label>
              <select value={newCondition} onChange={e => setNewCondition(e.target.value as MarketplaceItem['condition'])} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {['Mint','Near Mint','Very Fine','Good','Fair'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location *</label>
              <input required type="text" placeholder="Chicago, IL" value={newLocation} onChange={e => setNewLocation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Image URL (optional)</label>
              <input type="url" placeholder="https://..." value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
              <textarea rows={1} placeholder="Describe condition, history..." value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm">Publish Listing</button>
        </form>
      )}

      {/* Filters row */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, description, or seller..."
              value={rawSearch}
              onChange={e => {
                setRawSearch(e.target.value);
                setFilters(p => ({ ...p, marketplace: { ...p.marketplace, search: e.target.value } }));
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select value={sort} onChange={e => setFilters(p => ({ ...p, marketplace: { ...p.marketplace, sort: e.target.value } }))} className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer dark:text-slate-300">
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </div>
            <ViewToggle mode={viewMode} onToggle={setViewMode} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select value={category} onChange={e => setFilters(p => ({ ...p, marketplace: { ...p.marketplace, category: e.target.value } }))} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold dark:text-slate-300">
            <option value="">All Categories</option>
            {Object.keys(FALLBACK_IMAGES).map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={condition} onChange={e => setFilters(p => ({ ...p, marketplace: { ...p.marketplace, condition: e.target.value } }))} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold dark:text-slate-300">
            <option value="">All Conditions</option>
            {['Mint','Near Mint','Very Fine','Good','Fair'].map(c => <option key={c}>{c}</option>)}
          </select>
          {hasFilters && (
            <button onClick={handleClearFilters} className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold ml-auto">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl">
          <HelpCircle className="w-12 h-12 text-red-400 mb-2" />
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button onClick={refreshData} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold">Retry</button>
        </div>
      )}

      {/* Loading skeletons */}
      {!error && isLoading && (viewMode === 'grid' ? <MarketplaceSkeletonGrid /> : <MarketplaceSkeletonList />)}

      {/* Items */}
      {!error && !isLoading && (
        sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No listings found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">Try adjusting your search or filters.</p>
            {hasFilters && <button onClick={handleClearFilters} className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 text-sm font-semibold rounded-xl">Clear Filters</button>}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map(item => (
              <GridCard key={item.id} item={item} fmt={fmt} isFav={isFavorite(item.id)} onToggleFav={e => { e.stopPropagation(); toggleFavorite(item.id); }} onView={() => { setSelectedItem(item); setIsModalOpen(true); }} onAddOwned={e => { e.stopPropagation(); addToCollection(item, 'Owned'); }} condColors={CONDITION_COLORS} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map(item => (
              <ListCard key={item.id} item={item} fmt={fmt} isFav={isFavorite(item.id)} onToggleFav={e => { e.stopPropagation(); toggleFavorite(item.id); }} onView={() => { setSelectedItem(item); setIsModalOpen(true); }} onAddOwned={e => { e.stopPropagation(); addToCollection(item, 'Owned'); }} condColors={CONDITION_COLORS} />
            ))}
          </div>
        )
      )}

      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type="marketplace" item={selectedItem} />
    </div>
  );
};

/* ---- Sub-components ---- */
interface CardProps {
  item: MarketplaceItem;
  fmt: (n: number) => string;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
  onView: () => void;
  onAddOwned: (e: React.MouseEvent) => void;
  condColors: Record<string, string>;
}

const GridCard: React.FC<CardProps> = ({ item, fmt, isFav, onToggleFav, onView, onAddOwned, condColors }) => (
  <div onClick={onView} className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
      <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">{item.category}</span>
      <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
        <FavoriteButton isFav={isFav} onToggle={onToggleFav} size="sm" />
      </div>
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"><MapPin className="w-3 h-3" />{item.location}</span>
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${condColors[item.condition] || ''}`}>{item.condition}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-850 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">by {item.sellerName}</p>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(item.price)}</span>
        <div className="flex gap-1.5">
          <button onClick={onAddOwned} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-all" title="Add to Owned"><Plus className="w-4 h-4" /></button>
          <button onClick={onView} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg transition-colors">Inspect <ArrowUpRight className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  </div>
);

const ListCard: React.FC<CardProps> = ({ item, fmt, isFav, onToggleFav, onView, onAddOwned, condColors }) => (
  <div onClick={onView} className="group flex bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
    <div className="relative w-36 sm:w-48 shrink-0 bg-slate-100 dark:bg-slate-800">
      <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
        <FavoriteButton isFav={isFav} onToggle={onToggleFav} size="sm" />
      </div>
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">{item.category}</span>
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${condColors[item.condition] || ''}`}>{item.condition}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{item.title}</h3>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location} · by {item.sellerName}</p>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{fmt(item.price)}</span>
        <button onClick={onAddOwned} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-all"><Plus className="w-3.5 h-3.5" />Add</button>
        <button onClick={onView} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg transition-colors">Inspect <ArrowUpRight className="w-3 h-3" /></button>
      </div>
    </div>
  </div>
);
