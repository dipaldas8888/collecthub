import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { MarketplaceItem, CommunityPost } from '../context/AppContext';
import { 
  X, MapPin, User, Calendar, Tag, 
  Heart, Bookmark, Send, Sparkles, Plus, AlertCircle 
} from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'marketplace' | 'post';
  item?: MarketplaceItem | null;
  post?: CommunityPost | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  post
}) => {
  const { 
    addToCollection, 
    collectionItems, 
    likePost, 
    savePost, 
    addCommentToPost 
  } = useApp();
  
  const [commentText, setCommentText] = useState('');
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper to check if item is already in a specific collection
  const isItemInCollection = (title: string, colType: 'Owned' | 'Wishlist' | 'Selling') => {
    return collectionItems.some(
      (c) => c.title.toLowerCase() === title.toLowerCase() && c.type === colType
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;
    addCommentToPost(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Modal Card container */}
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'marketplace' && item && (
          <>
            {/* Left: Product Image */}
            <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 relative min-h-[300px] md:min-h-full flex items-center justify-center">
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                  <AlertCircle className="w-16 h-16 mb-2 text-slate-300" />
                  <span className="text-sm font-medium">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover max-h-[300px] md:max-h-[85vh]"
                />
              )}
              <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              <div>
                <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${
                  item.condition === 'Mint' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400' :
                  item.condition === 'Near Mint' ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-800 dark:text-teal-400' :
                  item.condition === 'Very Fine' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400' :
                  item.condition === 'Good' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400' :
                  'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                }`}>
                  Condition: {item.condition}
                </span>

                <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                  {item.title}
                </h2>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    asking price
                  </span>
                </div>

                {/* Estimate box */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between dark:bg-slate-800/50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Est. Value
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.estimatedValue)}
                  </span>
                </div>

                {/* Listing metadata */}
                <div className="mt-5 space-y-3.5 border-t border-b border-slate-100 dark:border-slate-800 py-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Seller: <strong className="text-slate-800 dark:text-slate-100">{item.sellerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location: <strong className="text-slate-800 dark:text-slate-100">{item.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Listed: <strong className="text-slate-800 dark:text-slate-100">{new Date(item.dateAdded).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons to Add to collections */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Add to My Hub Collections:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => addToCollection(item, 'Owned')}
                    disabled={isItemInCollection(item.title, 'Owned')}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      isItemInCollection(item.title, 'Owned')
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-800'
                        : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-sm shadow-indigo-600/10'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {isItemInCollection(item.title, 'Owned') ? 'Owned' : 'Add to Owned'}
                  </button>

                  <button
                    onClick={() => addToCollection(item, 'Wishlist')}
                    disabled={isItemInCollection(item.title, 'Wishlist')}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      isItemInCollection(item.title, 'Wishlist')
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-800'
                        : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:text-pink-800 dark:bg-pink-950/20 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-950/40'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current opacity-80" />
                    {isItemInCollection(item.title, 'Wishlist') ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>

                  <button
                    onClick={() => addToCollection(item, 'Selling')}
                    disabled={isItemInCollection(item.title, 'Selling')}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      isItemInCollection(item.title, 'Selling')
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    {isItemInCollection(item.title, 'Selling') ? 'Selling' : 'Add to Selling'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {type === 'post' && post && (
          <>
            {/* Left: Community Image */}
            <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 relative min-h-[300px] md:min-h-full flex items-center justify-center">
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                  <AlertCircle className="w-16 h-16 mb-2 text-slate-300" />
                  <span className="text-sm font-medium">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={post.image}
                  alt={post.caption}
                  onError={handleImageError}
                  className="w-full h-full object-cover max-h-[350px] md:max-h-[85vh]"
                />
              )}
              <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </div>
            </div>

            {/* Right: Comments, user and interactive actions */}
            <div className="w-full md:w-1/2 flex flex-col justify-between overflow-hidden max-h-[55vh] md:max-h-[85vh] bg-white dark:bg-slate-900">
              {/* Header: User Info */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {post.username}
                  </h3>
                  <span className="text-xs text-slate-500">Hub Contributor</span>
                </div>
              </div>

              {/* Feed Content: Caption and Comment list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Post Caption */}
                <div className="text-sm text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-50 dark:border-slate-800">
                  {post.caption}
                </div>

                {/* Comment stream */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Comments ({post.comments})
                  </h4>

                  {post.commentsList.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {post.commentsList.map((c, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-sm">
                          <span className="font-bold text-slate-950 dark:text-white shrink-0">
                            {c.username}
                          </span>
                          <span className="text-slate-650 dark:text-slate-350 break-words flex-1">
                            {c.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section: Actions & Add Comment Form */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-3 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1 hover:text-rose-600 transition-colors ${
                        post.likedByMe ? 'text-rose-600 font-bold' : ''
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.likedByMe ? 'fill-current text-rose-600' : ''}`} />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold">{post.comments} comments</span>
                    </div>
                  </div>

                  <button
                    onClick={() => savePost(post.id)}
                    className={`hover:text-indigo-600 transition-colors ${
                      post.savedByMe ? 'text-indigo-600' : ''
                    }`}
                    title={post.savedByMe ? 'Saved' : 'Save bookmark'}
                  >
                    <Bookmark className={`w-5 h-5 ${post.savedByMe ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl disabled:opacity-50 transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
