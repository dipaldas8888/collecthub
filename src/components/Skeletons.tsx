import React from 'react';

// A single skeleton card in grid mode
export const MarketplaceCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-4 space-y-3">
      {/* Category pill */}
      <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-3/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      {/* Seller */}
      <div className="h-3 w-2/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  </div>
);

// Grid of skeleton cards
interface SkeletonGridProps {
  count?: number;
}
export const MarketplaceSkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MarketplaceCardSkeleton key={i} />
    ))}
  </div>
);

// A single skeleton card in list mode
export const MarketplaceListSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden flex animate-pulse">
    <div className="w-32 sm:w-44 shrink-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="flex-1 p-4 space-y-3">
      <div className="h-3 w-1/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="flex gap-3 pt-2">
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  </div>
);

export const MarketplaceSkeletonList: React.FC<SkeletonGridProps> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <MarketplaceListSkeleton key={i} />
    ))}
  </div>
);

// Community post skeleton
export const PostCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
    <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3.5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-1/6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
    <div className="h-64 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="flex gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

export const PostSkeletonList: React.FC<SkeletonGridProps> = ({ count = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

// Collection item skeleton
export const CollectionCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  </div>
);
