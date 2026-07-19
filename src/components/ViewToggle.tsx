import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex items-center gap-0.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onToggle('grid')}
        aria-label="Grid view"
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          mode === 'grid'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onToggle('list')}
        aria-label="List view"
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          mode === 'list'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};
