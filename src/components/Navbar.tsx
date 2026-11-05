import React from 'react';
import { BarChart3, Table2, Sparkles, Upload, FileDown, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'table' | 'ai';
  setActiveTab: (tab: 'dashboard' | 'table' | 'ai') => void;
  onOpenUpload: () => void;
  onLoadSample: () => void;
  onDownloadTemplate: () => void;
  rowCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onLoadSample,
  onDownloadTemplate,
  rowCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            M
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
              Meridian
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block tracking-wider uppercase">
              Sales Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table2 className="w-4 h-4 text-emerald-500" />
            Orders & Data ({rowCount})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ai'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Q2-Q3 Variance Summary
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadTemplate}
            title="Download CSV Template"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            Template
          </button>
          <button
            onClick={onLoadSample}
            title="Load Sample Dataset"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sample Data
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
        </div>
      </div>
    </header>
  );
};
