import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Compass, ShoppingBag, Users, FolderHeart, Moon, Sun, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { collectionItems, isDark, toggleDark, favoriteCount } = useApp();
  const collectionCount = collectionItems.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
              CollectHub
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-0.5 sm:gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </NavLink>

            <NavLink
              to="/community"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </NavLink>

            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`
              }
            >
              <FolderHeart className="w-4 h-4" />
              <span className="hidden sm:inline">Collection</span>
              {collectionCount > 0 && (
                <span className="hidden sm:flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                  {collectionCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right actions: favorites badge + dark mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Favorites indicator */}
            {favoriteCount > 0 && (
              <NavLink
                to="/"
                className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-all duration-200"
                title={`${favoriteCount} favorited item${favoriteCount > 1 ? 's' : ''}`}
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold px-1 leading-none">
                  {favoriteCount}
                </span>
              </NavLink>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200 shadow-sm overflow-hidden"
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isDark ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
                }`}
              >
                <Moon className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
