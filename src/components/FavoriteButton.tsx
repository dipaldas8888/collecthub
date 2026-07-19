import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFav: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFav,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  const btnSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={onToggle}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`
        group relative ${btnSize} rounded-full border transition-all duration-200
        ${isFav
          ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/30 scale-110'
          : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-300 hover:shadow-md hover:shadow-rose-500/20'
        }
        ${className}
      `}
    >
      <Heart
        className={`${iconSize} transition-all duration-200 ${
          isFav ? 'fill-current scale-110' : 'group-hover:scale-110'
        }`}
      />
      {/* Burst animation on favorite */}
      {isFav && (
        <span className="absolute inset-0 rounded-full animate-ping bg-rose-400/40 pointer-events-none" />
      )}
    </button>
  );
};
