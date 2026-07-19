import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { CommunityPost } from '../context/AppContext';
import { DetailModal } from '../components/DetailModal';
import { LazyImage } from '../components/LazyImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { PostSkeletonList } from '../components/Skeletons';
import { useDebounce } from '../hooks/useDebounce';
import {
  Heart, MessageSquare, Bookmark, Search,
  Sparkles, Image, PlusCircle, BookmarkCheck
} from 'lucide-react';

export const Community: React.FC = () => {
  const {
    communityPosts,
    isLoading,
    filters,
    setFilters,
    likePost,
    savePost,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [rawSearch, setRawSearch] = useState(filters.community.search);
  const debouncedSearch = useDebounce(rawSearch, 350);

  // Handle open details modal
  const handleOpenDetails = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setRawSearch('');
    setFilters((prev) => ({ ...prev, community: { search: '', category: '' } }));
  };

  const { category: filterCategory } = filters.community;

  const filteredPosts = communityPosts.filter((post) => {
    const s = debouncedSearch.toLowerCase();
    const matchesSearch = post.caption.toLowerCase().includes(s) || post.username.toLowerCase().includes(s);
    const matchesCategory = filterCategory ? post.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Community Feed
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Showcase your collections, discuss grading, and connect with fellow enthusiasts.
          </p>
        </div>

        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-750 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share a Find</span>
        </button>
      </div>

      {/* Main Grid Layout: Feed on left, Info panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Create Post + Feed list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Card */}
          {showCreatePost && (
            <CreatePostForm onClose={() => setShowCreatePost(false)} />
          )}

          {/* Filters card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search posts by description or username..."
                  value={rawSearch}
                  onChange={(e) => {
                    setRawSearch(e.target.value);
                    setFilters(prev => ({ ...prev, community: { ...prev.community, search: e.target.value } }));
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  community: { ...prev.community, category: e.target.value }
                }))}
                className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs px-3.5 py-3 rounded-xl focus:ring-1 focus:ring-indigo-500 font-semibold w-full sm:w-48 cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Trading Cards">Trading Cards</option>
                <option value="Retro Games">Retro Games</option>
                <option value="Comic Books">Comic Books</option>
                <option value="Action Figures">Action Figures</option>
                <option value="Vintage Watches">Vintage Watches</option>
              </select>

              {(rawSearch || filterCategory) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-indigo-650 hover:text-indigo-800 font-semibold underline underline-offset-2 shrink-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Feed Post List */}
          {isLoading ? (
            <PostSkeletonList count={3} />
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <MessageSquare className="w-16 h-16 text-slate-350 dark:text-slate-650 mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No posts match your criteria</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Try searching for something else or clearing the current category filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-750 text-sm font-semibold rounded-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Post User Header */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.userAvatar} 
                        alt={post.username}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                          {post.username}
                        </h4>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div
                    onClick={() => handleOpenDetails(post)}
                    className="relative cursor-pointer h-64 overflow-hidden bg-slate-100 dark:bg-slate-950"
                  >
                    <LazyImage src={post.image} alt={post.caption} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                    <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                      <FavoriteButton isFav={isFavorite(post.id)} onToggle={e => { e.stopPropagation(); toggleFavorite(post.id); }} size="sm" />
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-4 space-y-3.5">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5">{post.username}</span>
                      {post.caption}
                    </p>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => likePost(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                            post.likedByMe 
                              ? 'text-rose-600' 
                              : 'text-slate-500 hover:text-rose-600'
                          }`}
                        >
                          <Heart className={`w-4.5 h-4.5 ${post.likedByMe ? 'fill-current text-rose-600' : ''}`} />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          onClick={() => handleOpenDetails(post)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          <MessageSquare className="w-4.5 h-4.5" />
                          <span>{post.comments} Comments</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => savePost(post.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            post.savedByMe 
                              ? 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900' 
                              : 'text-slate-400 border-slate-200 hover:text-slate-600 dark:border-slate-800'
                          }`}
                          title={post.savedByMe ? 'Bookmark Saved' : 'Save post'}
                        >
                          <Bookmark className={`w-4 h-4 ${post.savedByMe ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleOpenDetails(post)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Guidelines, stats, and bookmarks */}
        <div className="space-y-6 lg:sticky lg:top-20">
          {/* Quick Stats / Guidelines card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
              Community Spotlight
            </h3>
            <ul className="text-xs space-y-2.5 text-slate-500 dark:text-slate-400 leading-normal">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>Showcase your recent scores or newly graded items.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>Interact with others, like, and share constructive grading feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>Save bookmarks to refer back to values or seller posts.</span>
              </li>
            </ul>
          </div>

          {/* Bookmarks (Saved Posts) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2.5">
              <BookmarkCheck className="w-4.5 h-4.5 text-indigo-500" />
              Saved Bookmarks ({communityPosts.filter(p => p.savedByMe).length})
            </h3>

            {communityPosts.filter(p => p.savedByMe).length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                No saved posts. Save posts to read later.
              </div>
            ) : (
              <div className="space-y-3">
                {communityPosts.filter(p => p.savedByMe).map(post => (
                  <div 
                    key={post.id} 
                    onClick={() => handleOpenDetails(post)}
                    className="flex gap-3 items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <img 
                      src={post.image} 
                      alt="" 
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {post.username}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details modal overlay */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="post"
        post={selectedPost}
      />
    </div>
  );
};

// Sub-component: Form to Create a Post
const CreatePostForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addNewPost } = useApp();
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Trading Cards');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    addNewPost({
      caption: caption.trim(),
      category,
      image: image.trim()
    });

    setCaption('');
    setImage('');
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 animate-slide-in"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Image className="w-4 h-4 text-indigo-500" />
          Share a Collectible Find
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-655"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Trading Cards">Trading Cards</option>
            <option value="Retro Games">Retro Games</option>
            <option value="Comic Books">Comic Books</option>
            <option value="Action Figures">Action Figures</option>
            <option value="Vintage Watches">Vintage Watches</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Image URL (Optional)</label>
          <input
            type="url"
            placeholder="Paste direct Unsplash/image link"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Caption / Thoughts *</label>
        <textarea
          required
          rows={3}
          placeholder="What did you acquire? Mention the grade, the condition, or ask the community what they think!"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
      >
        Publish Post
      </button>
    </form>
  );
};

