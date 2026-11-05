/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SalesOrder, RegionalQ2Q3Metric } from './types';
import { SAMPLE_CSV_STRING, parseSalesData } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DataTableComponent } from './components/DataTableModal';
import { AiSummaryPanel } from './components/AiSummaryPanel';
import { UploadModal } from './components/UploadModal';

export default function App() {
  const [orders, setOrders] = useState<SalesOrder[]>(() => parseSalesData(SAMPLE_CSV_STRING));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'ai'>('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Load sample dataset handler
  const handleLoadSample = () => {
    const data = parseSalesData(SAMPLE_CSV_STRING);
    setOrders(data);
  };

  // Download CSV template handler
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_STRING], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sales_orders_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.revenue, 0), [orders]);
  const totalUnits = useMemo(() => orders.reduce((sum, o) => sum + o.units, 0), [orders]);
  const avgDiscount = useMemo(() => {
    if (orders.length === 0) return 0;
    const sum = orders.reduce((acc, o) => acc + o.discount_pct, 0);
    return sum / orders.length;
  }, [orders]);

  const totalQ2Revenue = useMemo(
    () => orders.filter((o) => o.quarter === 'Q2').reduce((sum, o) => sum + o.revenue, 0),
    [orders]
  );

  const totalQ3Revenue = useMemo(
    () => orders.filter((o) => o.quarter === 'Q3').reduce((sum, o) => sum + o.revenue, 0),
    [orders]
  );

  // Regional Q2 vs Q3 metrics
  const regionalMetrics: RegionalQ2Q3Metric[] = useMemo(() => {
    const regSet = Array.from(new Set(orders.map((o) => o.region)));
    return regSet.map((region) => {
      const q2Rev = orders
        .filter((o) => o.region === region && o.quarter === 'Q2')
        .reduce((sum, o) => sum + o.revenue, 0);

      const q3Rev = orders
        .filter((o) => o.region === region && o.quarter === 'Q3')
        .reduce((sum, o) => sum + o.revenue, 0);

      const absChange = q3Rev - q2Rev;
      const pctChange = q2Rev === 0 ? (q3Rev > 0 ? 100 : 0) : (absChange / q2Rev) * 100;

      return {
        region,
        q2Revenue: q2Rev,
        q3Revenue: q3Rev,
        absChange,
        pctChange,
      };
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-[limegreen] text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLoadSample={handleLoadSample}
        onDownloadTemplate={handleDownloadTemplate}
        rowCount={orders.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            orders={orders}
            regionalMetrics={regionalMetrics}
            totalRevenue={totalRevenue}
            totalUnits={totalUnits}
            avgDiscount={avgDiscount}
            totalQ2Revenue={totalQ2Revenue}
            totalQ3Revenue={totalQ3Revenue}
          />
        )}

        {activeTab === 'table' && <DataTableComponent orders={orders} />}

        {activeTab === 'ai' && (
          <AiSummaryPanel
            orders={orders}
            regionalMetrics={regionalMetrics}
            totalQ2Revenue={totalQ2Revenue}
            totalQ3Revenue={totalQ3Revenue}
          />
        )}
      </main>

      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={(newOrders) => {
          setOrders(newOrders);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}
