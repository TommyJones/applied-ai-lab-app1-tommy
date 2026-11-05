import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseSalesData } from '../utils/sampleData';
import { SalesOrder } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: SalesOrder[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onDataLoaded }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setError(null);
    setSuccessMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseSalesData(text);
        if (parsed.length === 0) {
          setError('No valid sales orders found. Ensure columns match: quarter, region, channel, product, units, discount_pct, revenue.');
          return;
        }
        onDataLoaded(parsed);
        setSuccessMsg(`Successfully loaded ${parsed.length} sales orders!`);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      } catch (err: any) {
        setError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Upload Sales Orders CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload a comma-separated values (CSV) file containing sales order records. Required columns:{' '}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800 dark:text-slate-200">
              quarter, region, channel, product, units, discount_pct, revenue
            </code>
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop your CSV file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports standard CSV files up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
