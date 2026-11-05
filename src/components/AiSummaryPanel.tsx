import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SalesOrder, RegionalQ2Q3Metric } from '../types';

interface AiSummaryPanelProps {
  orders: SalesOrder[];
  regionalMetrics: RegionalQ2Q3Metric[];
  totalQ2Revenue: number;
  totalQ3Revenue: number;
}

export const AiSummaryPanel: React.FC<AiSummaryPanelProps> = ({
  orders,
  regionalMetrics,
  totalQ2Revenue,
  totalQ3Revenue,
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sales/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionalQ2Q3Data: regionalMetrics,
          totalQ2Revenue,
          totalQ3Revenue,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find region that changed most by absolute or percentage
  const mostChanged = [...regionalMetrics].sort(
    (a, b) => Math.abs(b.absChange) - Math.abs(a.absChange)
  )[0];

  return (
    <div className="space-y-6">
      {/* Banner / Header Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash Analytical Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Q2 to Q3 Regional Variance & AI Summary
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Our AI evaluates your exact calculated sales revenue across all regions from Q2 to Q3, providing a strict three-sentence financial narrative citing computed data.
            </p>
          </div>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 font-semibold text-xs rounded-xl shadow-lg hover:bg-slate-100 active:bg-slate-200 transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {summary ? 'Regenerate Summary' : 'Generate AI Summary'}
          </button>
        </div>
      </div>

      {/* Grid of Regional Q2 vs Q3 Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionalMetrics.map((m) => {
          const isTop = mostChanged && mostChanged.region === m.region;
          return (
            <div
              key={m.region}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all ${
                isTop
                  ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {m.region}
                </span>
                {isTop && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-3 h-3" />
                    Top Change
                  </span>
                )}
              </div>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Q2 Revenue:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    ${m.q2Revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Q3 Revenue:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    ${m.q3Revenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Variance:</span>
                <span
                  className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                    m.absChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <ArrowUpRight className={`w-3.5 h-3.5 ${m.absChange < 0 ? 'rotate-90' : ''}`} />
                  {m.absChange >= 0 ? '+' : ''}
                  {m.pctChange.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Executive Three-Sentence AI Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated using only app-calculated revenue metrics between Q2 and Q3
              </p>
            </div>
          </div>
          {summary && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </button>
          )}
        </div>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <p className="text-xs font-medium">Analyzing Q2 vs Q3 regional numbers...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Generation Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !summary && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Ready to generate AI summary
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Click the button above to have Gemini analyze your regional Q2 and Q3 figures and write a precise three-sentence summary.
            </p>
            <button
              onClick={generateSummary}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
            >
              Generate Summary Now
            </button>
          </div>
        )}

        {!loading && summary && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl p-6">
            <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
              "{summary}"
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Model: Gemini 3.8 Flash</span>
              <span>Calculated from {orders.length} orders</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
