import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  condition: 'Mint' | 'Near Mint' | 'Very Fine' | 'Good' | 'Fair';
  price: number;
  sellerName: string;
  location: string;
  image: string;
  description: string;
  estimatedValue: number;
  dateAdded: string; // For "newest" sorting
}

export interface CommunityPost {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  category: string;
  likedByMe?: boolean;
  savedByMe?: boolean;
  commentsList: Array<{ username: string; text: string; date: string }>;
}

export interface CollectionItem {
  id: string;
  title: string;
  category: string;
  condition: string;
  price: number;
  image: string;
  dateAdded: string;
  estimatedValue: number;
  type: 'Owned' | 'Wishlist' | 'Selling';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface FilterState {
  marketplace: {
    search: string;
    category: string;
    condition: string;
    sort: string;
  };
  community: {
    search: string;
    category: string;
  };
  collection: {
    search: string;
    category: string;
    sort: string;
  };
}

export type ViewMode = 'grid' | 'list';

interface AppContextType {
  marketplaceItems: MarketplaceItem[];
  communityPosts: CommunityPost[];
  collectionItems: CollectionItem[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addToCollection: (item: MarketplaceItem | CollectionItem, targetType: 'Owned' | 'Wishlist' | 'Selling') => boolean;
  removeFromCollection: (itemId: string, type: 'Owned' | 'Wishlist' | 'Selling') => void;
  moveCollectionItem: (itemId: string, _currentType: 'Owned' | 'Wishlist' | 'Selling', targetType: 'Owned' | 'Wishlist' | 'Selling') => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  refreshData: () => Promise<void>;
  addNewListing: (item: Omit<MarketplaceItem, 'id' | 'dateAdded'>) => void;
  addNewPost: (post: { caption: string; category: string; image: string }) => void;
  // Theme
  isDark: boolean;
  toggleDark: () => void;
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  // Favorites
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoriteCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'm1',
    title: '1999 Pokémon Base Set Charizard 1st Edition PSA 10',
    category: 'Trading Cards',
    condition: 'Mint',
    price: 15500,
    sellerName: 'PalletTownGrading',
    location: 'Tokyo, JP',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    description: 'A holy grail for collectors. This 1st Edition Shadowless Charizard Holo has been graded Gem Mint 10 by PSA. The centering is flawless, surface scratch-free, and colors are incredibly vibrant.',
    estimatedValue: 16500,
    dateAdded: '2026-07-10T12:00:00Z',
  },
  {
    id: 'm2',
    title: 'Chrono Trigger (Super Nintendo, 1995) CIB',
    category: 'Retro Games',
    condition: 'Near Mint',
    price: 850,
    sellerName: 'RetroVault',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=80',
    description: 'Complete in Box (CIB). Includes the original box, game cartridge in pristine condition, instruction manual, and both promotional posters. Tested and saves perfectly.',
    estimatedValue: 900,
    dateAdded: '2026-07-15T09:30:00Z',
  },
  {
    id: 'm3',
    title: 'Omega Speedmaster Professional "Moonwatch" 1969',
    category: 'Vintage Watches',
    condition: 'Very Fine',
    price: 7200,
    sellerName: 'ChronosCollect',
    location: 'Geneva, CH',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80',
    description: 'Vintage reference 145.022-69. Caliber 861 manual wind movement. Dot over ninety (DON) bezel. Comes on its original 1171 bracelet. Unpolished case with honest wear.',
    estimatedValue: 7500,
    dateAdded: '2026-07-18T14:20:00Z',
  },
  {
    id: 'm4',
    title: 'Amazing Fantasy #15 (First Appearance of Spider-Man) Facsimile',
    category: 'Comic Books',
    condition: 'Near Mint',
    price: 45,
    sellerName: 'DailyBugleComics',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80',
    description: 'Beautiful copy of the high-quality 2019 facsimile edition of Spider-Man\'s first appearance. Graded at 9.6 candidate. White pages, crisp corners.',
    estimatedValue: 50,
    dateAdded: '2026-07-19T00:10:00Z',
  },
  {
    id: 'm5',
    title: 'Vintage Kenner Star Wars Boba Fett Action Figure (1979)',
    category: 'Action Figures',
    condition: 'Good',
    price: 320,
    sellerName: 'TatooineTreasure',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
    description: 'Original Kenner Boba Fett action figure. Blaster is missing but the joints are firm and paint wear is minimal. No copyright stamp on leg variant.',
    estimatedValue: 350,
    dateAdded: '2026-07-05T18:00:00Z',
  },
  {
    id: 'm6',
    title: 'Seiko "Pogue" Chronograph 6139-6002 Vintage 1974',
    category: 'Vintage Watches',
    condition: 'Very Fine',
    price: 1100,
    sellerName: 'RisingSunVintage',
    location: 'Kyoto, JP',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80',
    description: 'Famed Seiko Pogue with the brilliant yellow dial. Inner rotating bezel turns smoothly. Chronograph resets precisely to zero. All original parts.',
    estimatedValue: 1200,
    dateAdded: '2026-07-12T10:45:00Z',
  },
  {
    id: 'm7',
    title: 'Yu-Gi-Oh! Legend of Blue Eyes White Dragon Booster Box (24 Packs)',
    category: 'Trading Cards',
    condition: 'Mint',
    price: 4800,
    sellerName: 'KaibaCorpStore',
    location: 'Berlin, DE',
    image: 'https://images.unsplash.com/photo-1613771404724-11d27954b80b?w=800&auto=format&fit=crop&q=80',
    description: 'Unopened, shrink-wrapped 1st Edition booster box (Korean version). Extremely rare in this sealed condition. Kept in a UV-protected acrylic case.',
    estimatedValue: 5000,
    dateAdded: '2026-07-16T11:15:00Z',
  },
  {
    id: 'm8',
    title: 'Sega Dreamcast Sports Edition Console CIB',
    category: 'Retro Games',
    condition: 'Very Fine',
    price: 280,
    sellerName: 'DreamcastDreamer',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description: 'Limited Sports Edition Sega Dreamcast console in black, complete with matching black controller, VMU, cables, and original box. Works flawlessly.',
    estimatedValue: 300,
    dateAdded: '2026-07-14T15:30:00Z',
  },
  {
    id: 'm9',
    title: 'Hot Toys Iron Man Mark LXXXV (Diecast) 1/6 Scale',
    category: 'Action Figures',
    condition: 'Mint',
    price: 410,
    sellerName: 'AvengersVault',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1608889174633-56ad37d9011b?w=800&auto=format&fit=crop&q=80',
    description: 'Collector-owned Iron Man from Avengers: Endgame. Displayed briefly in a dust-free glass case. All LED lights function, includes all hands, Nano Lightning Refocuser, and shipper box.',
    estimatedValue: 420,
    dateAdded: '2026-07-17T08:00:00Z',
  }
];

const INITIAL_COMMUNITY: CommunityPost[] = [
  {
    id: 'p1',
    username: 'CardCollector99',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    caption: 'Finally added the Shadowless Charizard to my grading submission list! Feeling lucky about this one, hoping for a PSA 9 or 10. Wish me luck! 🤞🔥 #pokemon #charizard #grading',
    likes: 142,
    comments: 18,
    category: 'Trading Cards',
    likedByMe: false,
    savedByMe: false,
    commentsList: [
      { username: 'TrainerRed', text: 'That centering looks absolutely flawless! Easily a PSA 10 candidate.', date: '2026-07-18T16:00:00Z' },
      { username: 'GottaCatchEm', text: 'Awesome card, definitely a holy grail. Keep us posted on the grade!', date: '2026-07-18T17:30:00Z' },
      { username: 'GradingGuru', text: 'Surface looks clean. Good luck with the submission!', date: '2026-07-18T19:00:00Z' }
    ]
  },
  {
    id: 'p2',
    username: 'N64Kid',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    caption: 'Saturday morning setups. Dusting off the console collection and playing some classic Mario Kart 64. What was your favorite track? 🎮✨ #retrogaming #nintendo #childhood',
    likes: 95,
    comments: 12,
    category: 'Retro Games',
    likedByMe: false,
    savedByMe: false,
    commentsList: [
      { username: 'SegaFan', text: 'Bowser\'s Castle for sure! The music was legendary.', date: '2026-07-17T12:00:00Z' },
      { username: 'PeachLover', text: 'Yoshi Valley was always so chaotic. Love the setup!', date: '2026-07-17T14:15:00Z' }
    ]
  },
  {
    id: 'p3',
    username: 'WristwatchWanderer',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80',
    caption: 'The way the sunlight hits this 1969 Speedmaster dial is pure poetry. Timeless design that actually went to the moon. 🚀⌚ #omega #speedmaster #speedypuesday #vintagewatches',
    likes: 218,
    comments: 24,
    category: 'Vintage Watches',
    likedByMe: false,
    savedByMe: false,
    commentsList: [
      { username: 'WatchGuy', text: 'Stunning DON bezel. Don\'t ever polish that case, it has so much character!', date: '2026-07-18T10:00:00Z' },
      { username: 'SpaceMan', text: 'The ultimate watch. Absolutely beautiful piece of history.', date: '2026-07-18T11:20:00Z' }
    ]
  },
  {
    id: 'p4',
    username: 'ComicBookGuy',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80',
    caption: 'Just cataloged my Spider-Man shelf. Nothing beats standard comic book smell and the classic covers of the Silver Age! 🕸️📚 #spiderman #marvel #comics #silverage',
    likes: 83,
    comments: 6,
    category: 'Comic Books',
    likedByMe: false,
    savedByMe: false,
    commentsList: [
      { username: 'PeterParker', text: 'Spidey approved! Excellent collection.', date: '2026-07-16T15:00:00Z' }
    ]
  },
  {
    id: 'p5',
    username: 'ToyStoryCollector',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1608889174633-56ad37d9011b?w=800&auto=format&fit=crop&q=80',
    caption: 'unboxed my new diecast Iron Man. The weight of this figure is incredible, articulation is top notch. Tony Stark would be proud! 🤖💥 #hottoys #ironman #avengers #toyphotography',
    likes: 112,
    comments: 9,
    category: 'Action Figures',
    likedByMe: false,
    savedByMe: false,
    commentsList: [
      { username: 'StarkIndustries', text: 'Proof that Tony Stark has a heart. Looks awesome!', date: '2026-07-15T09:00:00Z' }
    ]
  }
];

const INITIAL_COLLECTION: CollectionItem[] = [
  {
    id: 'c1',
    title: 'Vintage Kenner Star Wars Boba Fett Action Figure (1979)',
    category: 'Action Figures',
    condition: 'Good',
    price: 320,
    image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
    dateAdded: '2026-06-15T10:00:00Z',
    estimatedValue: 350,
    type: 'Owned'
  },
  {
    id: 'c2',
    title: 'Seiko "Pogue" Chronograph 6139-6002 Vintage 1974',
    category: 'Vintage Watches',
    condition: 'Very Fine',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80',
    dateAdded: '2026-07-02T11:30:00Z',
    estimatedValue: 1200,
    type: 'Selling'
  },
  {
    id: 'c3',
    title: 'Chrono Trigger (Super Nintendo, 1995) CIB',
    category: 'Retro Games',
    condition: 'Near Mint',
    price: 850,
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=80',
    dateAdded: '2026-07-12T14:00:00Z',
    estimatedValue: 900,
    type: 'Wishlist'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage, otherwise use initial mock data
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const local = localStorage.getItem('hub_marketplace');
    return local ? JSON.parse(local) : INITIAL_MARKETPLACE;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const local = localStorage.getItem('hub_community');
    return local ? JSON.parse(local) : INITIAL_COMMUNITY;
  });

  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(() => {
    const local = localStorage.getItem('hub_collection');
    return local ? JSON.parse(local) : INITIAL_COLLECTION;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('hub_theme');
    if (stored !== null) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hub_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = useCallback(() => setIsDark((d) => !d), []);

  // View mode (grid/list)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('hub_viewMode') as ViewMode) || 'grid';
  });

  useEffect(() => {
    localStorage.setItem('hub_viewMode', viewMode);
  }, [viewMode]);

  // Favorites
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('hub_favorites');
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('hub_favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  // Default filters
  const [filters, setFilters] = useState<FilterState>(() => {
    const local = localStorage.getItem('hub_filters');
    return local ? JSON.parse(local) : {
      marketplace: { search: '', category: '', condition: '', sort: 'newest' },
      community: { search: '', category: '' },
      collection: { search: '', category: '', sort: 'dateAdded-desc' }
    };
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('hub_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('hub_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('hub_collection', JSON.stringify(collectionItems));
  }, [collectionItems]);

  useEffect(() => {
    localStorage.setItem('hub_filters', JSON.stringify(filters));
  }, [filters]);

  // Toast utilities
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulate network fetching to fulfill logical requirement of "Show loading indicators while fetching data"
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Randomly trigger error 5% of the time to demonstrate robust error handling (optional, but let's keep it safe or triggerable via button)
    } catch (err) {
      setError('Failed to fetch latest collectibles. Please check your connection.');
      showToast('Network error: failed to fetch data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Item to Collection with duplicate prevention
  const addToCollection = (
    item: MarketplaceItem | CollectionItem,
    targetType: 'Owned' | 'Wishlist' | 'Selling'
  ): boolean => {
    // Check if duplicate exists in the SPECIFIC target collection
    const exists = collectionItems.some(
      (c) => c.title.toLowerCase() === item.title.toLowerCase() && c.type === targetType
    );

    if (exists) {
      showToast(`"${item.title}" is already in your ${targetType} collection.`, 'error');
      return false;
    }

    const newItem: CollectionItem = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: item.title,
      category: item.category,
      condition: item.condition,
      price: item.price,
      image: item.image,
      dateAdded: new Date().toISOString(),
      estimatedValue: item.estimatedValue,
      type: targetType
    };

    setCollectionItems((prev) => [newItem, ...prev]);
    showToast(`Added "${item.title}" to ${targetType}!`, 'success');
    return true;
  };

  // Remove from Collection
  const removeFromCollection = (itemId: string, type: 'Owned' | 'Wishlist' | 'Selling') => {
    const itemToRemove = collectionItems.find(c => c.id === itemId);
    if (!itemToRemove) return;

    setCollectionItems((prev) => prev.filter((c) => c.id !== itemId));
    showToast(`Removed "${itemToRemove.title}" from ${type}.`, 'info');
  };

  // Move item between collections with duplicate check
  const moveCollectionItem = (
    itemId: string,
    _currentType: 'Owned' | 'Wishlist' | 'Selling',
    targetType: 'Owned' | 'Wishlist' | 'Selling'
  ) => {
    const item = collectionItems.find((c) => c.id === itemId);
    if (!item) return;

    // Check if it already exists in the TARGET collection
    const existsInTarget = collectionItems.some(
      (c) => c.title.toLowerCase() === item.title.toLowerCase() && c.type === targetType
    );

    if (existsInTarget) {
      showToast(`Cannot move: "${item.title}" is already in your ${targetType} collection.`, 'error');
      return;
    }

    setCollectionItems((prev) =>
      prev.map((c) =>
        c.id === itemId
          ? { ...c, type: targetType, dateAdded: new Date().toISOString() }
          : c
      )
    );
    showToast(`Moved "${item.title}" to ${targetType}!`, 'success');
  };

  // Like a post
  const likePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByMe;
          return {
            ...post,
            likedByMe: liked,
            likes: liked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // Save/unsave post
  const savePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const saved = !post.savedByMe;
          showToast(saved ? 'Post saved to bookmarks!' : 'Post removed from bookmarks', 'info');
          return { ...post, savedByMe: saved };
        }
        return post;
      })
    );
  };

  // Comment on post
  const addCommentToPost = (postId: string, text: string) => {
    if (!text.trim()) return;

    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            username: 'You (CollectorHub)',
            text: text.trim(),
            date: new Date().toISOString()
          };
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...post.commentsList, newComment]
          };
        }
        return post;
      })
    );
    showToast('Comment posted!', 'success');
  };

  // Add new marketplace listing
  const addNewListing = (item: Omit<MarketplaceItem, 'id' | 'dateAdded'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `m_${Date.now()}`,
      dateAdded: new Date().toISOString()
    };
    setMarketplaceItems((prev) => [newItem, ...prev]);
    showToast(`Successfully listed "${item.title}" for sale!`, 'success');
  };

  // Add new community post
  const addNewPost = (post: { caption: string; category: string; image: string }) => {
    const newPostItem: CommunityPost = {
      id: `p_${Date.now()}`,
      username: 'You (CollectorHub)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      image: post.image,
      caption: post.caption,
      likes: 0,
      comments: 0,
      category: post.category,
      likedByMe: false,
      savedByMe: false,
      commentsList: []
    };
    setCommunityPosts((prev) => [newPostItem, ...prev]);
    showToast('Post shared with the community!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        marketplaceItems,
        communityPosts,
        collectionItems,
        isLoading,
        error,
        filters,
        toasts,
        showToast,
        removeToast,
        setFilters,
        addToCollection,
        removeFromCollection,
        moveCollectionItem,
        likePost,
        savePost,
        addCommentToPost,
        refreshData,
        addNewListing,
        addNewPost,
        isDark,
        toggleDark,
        viewMode,
        setViewMode,
        favorites,
        toggleFavorite,
        isFavorite,
        favoriteCount: favorites.size,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
