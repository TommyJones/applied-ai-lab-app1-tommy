import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SalesOrder, RegionalQ2Q3Metric } from '../types';
import { DollarSign, ShoppingBag, Percent, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  orders: SalesOrder[];
  regionalMetrics: RegionalQ2Q3Metric[];
  totalRevenue: number;
  totalUnits: number;
  avgDiscount: number;
  totalQ2Revenue: number;
  totalQ3Revenue: number;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  regionalMetrics,
  totalRevenue,
  totalUnits,
  avgDiscount,
  totalQ2Revenue,
  totalQ3Revenue,
}) => {
  // 1. Prepare data for Revenue by Region & Quarter chart
  // Group by quarter and region
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const regions = Array.from(new Set(orders.map((o) => o.region)));

  const chartDataByQuarter = quarters.map((q) => {
    const item: any = { quarter: q };
    regions.forEach((reg) => {
      const match = orders.filter((o) => o.quarter === q && o.region === reg);
      const rev = match.reduce((sum, o) => sum + o.revenue, 0);
      item[reg] = rev;
    });
    return item;
  });

  // 2. Prepare data for Channel breakdown
  const channelMap: { [key: string]: number } = {};
  orders.forEach((o) => {
    channelMap[o.channel] = (channelMap[o.channel] || 0) + o.revenue;
  });
  const channelData = Object.keys(channelMap).map((ch) => ({
    name: ch,
    value: channelMap[ch],
  }));

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Across {orders.length} total sales orders
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Q2 vs Q3 Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>${totalQ2Revenue.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-normal">→</span>
            <span>${totalQ3Revenue.toLocaleString()}</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {(((totalQ3Revenue - totalQ2Revenue) / (totalQ2Revenue || 1)) * 100).toFixed(1)}% QoQ growth
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Units Sold
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {totalUnits.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-2">Units across all product lines</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Discount
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {(avgDiscount * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-2">Mean discount percentage</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue by Region & Quarter (Bar Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue by Region & Quarter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing total revenue breakdown across all quarters
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataByQuarter} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}k` : val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {regions.map((reg, idx) => (
                  <Bar
                    key={reg}
                    dataKey={reg}
                    fill={COLORS[idx % COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Channel (Pie Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Revenue by Channel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution across sales channels
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {channelData.map((ch, idx) => (
              <div key={ch.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{ch.name}</span>
                </div>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  ${ch.value.toLocaleString()} ({((ch.value / totalRevenue) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Q2 to Q3 Summary Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Regional Q2 to Q3 Revenue Performance Table
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exact calculated revenue changes used for AI summary generation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 text-right">Q2 Revenue</th>
                <th className="py-3 px-4 text-right">Q3 Revenue</th>
                <th className="py-3 px-4 text-right">Absolute Change</th>
                <th className="py-3 px-4 text-right">Percentage Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {regionalMetrics.map((m) => (
                <tr key={m.region} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {m.region}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                    ${m.q2Revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200 font-bold">
                    ${m.q3Revenue.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      m.absChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {m.absChange >= 0 ? '+' : ''}${m.absChange.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      m.pctChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {m.pctChange >= 0 ? '+' : ''}{m.pctChange.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
