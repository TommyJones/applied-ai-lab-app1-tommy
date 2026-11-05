import React, { useState, useMemo } from 'react';
import { SalesOrder } from '../types';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface DataTableProps {
  orders: SalesOrder[];
}

type SortField = 'quarter' | 'region' | 'channel' | 'product' | 'units' | 'discount_pct' | 'revenue';

export const DataTableComponent: React.FC<DataTableProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [quarterFilter, setQuarterFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const quarters = ['ALL', 'Q1', 'Q2', 'Q3', 'Q4'];
  const regions = ['ALL', ...Array.from(new Set(orders.map((o) => o.region)))];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.product.toLowerCase().includes(search.toLowerCase()) ||
        o.region.toLowerCase().includes(search.toLowerCase()) ||
        o.channel.toLowerCase().includes(search.toLowerCase()) ||
        o.quarter.toLowerCase().includes(search.toLowerCase());

      const matchesQuarter = quarterFilter === 'ALL' || o.quarter === quarterFilter;
      const matchesRegion = regionFilter === 'ALL' || o.region === regionFilter;

      return matchesSearch && matchesQuarter && matchesRegion;
    });
  }, [orders, search, quarterFilter, regionFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      } else {
        return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }
    });
  }, [filteredOrders, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numeric fields
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Sales Orders Database ({filteredOrders.length} records)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, and sort individual sales order transactions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, region..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64"
            />
          </div>

          {/* Quarter Filter */}
          <select
            value={quarterFilter}
            onChange={(e) => {
              setQuarterFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {quarters.map((q) => (
              <option key={q} value={q}>
                {q === 'ALL' ? 'All Quarters' : q}
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === 'ALL' ? 'All Regions' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <th
                onClick={() => handleSort('quarter')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Quarter <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('region')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Region <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('channel')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Channel <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('product')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Product <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('units')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center justify-end gap-1.5">
                  Units <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('discount_pct')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center justify-end gap-1.5">
                  Discount <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center justify-end gap-1.5">
                  Revenue <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                  No matching sales orders found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                      {o.quarter}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">{o.region}</td>
                  <td className="py-3 px-4 font-sans text-slate-500 dark:text-slate-400">{o.channel}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white">
                    {o.product}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {o.units.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400">
                    {(o.discount_pct * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    ${o.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedOrders.length)} of {sortedOrders.length} orders
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
