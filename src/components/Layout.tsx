import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { FeedbackToast } from './FeedbackToast';
import { RefreshCw, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC = () => {
  const { refreshData, isLoading } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Floating Refresh Trigger */}
        <div className="absolute right-4 sm:right-6 top-4 z-10">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 shadow-sm transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Simulate loading state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Sync Hub'}</span>
          </button>
        </div>

        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} CollectHub. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> for collectors everywhere.
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <FeedbackToast />
    </div>
  );
};
