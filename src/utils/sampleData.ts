import { SalesOrder } from '../types';

export const SAMPLE_CSV_STRING = `quarter,region,channel,product,units,discount_pct,revenue
Q1,North America,Direct,CloudServer Pro,1200,0.05,114000
Q1,North America,Partner,DataVault Enterprise,450,0.10,202500
Q1,Europe,Direct,AI Gateway License,800,0.00,160000
Q1,Europe,E-commerce,Analytics Studio,300,0.15,76500
Q1,APAC,Partner,CloudServer Pro,950,0.08,87400
Q1,Latin America,Direct,DataVault Enterprise,200,0.00,100000
Q2,North America,Direct,CloudServer Pro,1450,0.05,137750
Q2,North America,Partner,DataVault Enterprise,520,0.10,234000
Q2,Europe,Direct,AI Gateway License,920,0.05,174800
Q2,Europe,E-commerce,Analytics Studio,410,0.10,110700
Q2,APAC,Partner,CloudServer Pro,1100,0.10,99000
Q2,Latin America,Direct,DataVault Enterprise,280,0.05,133000
Q3,North America,Direct,CloudServer Pro,2100,0.05,199500
Q3,North America,Partner,DataVault Enterprise,750,0.15,318750
Q3,Europe,Direct,AI Gateway License,850,0.10,153000
Q3,Europe,E-commerce,Analytics Studio,550,0.05,156750
Q3,APAC,Partner,CloudServer Pro,1400,0.08,128800
Q3,Latin America,Direct,DataVault Enterprise,310,0.05,147250
Q4,North America,Direct,CloudServer Pro,1800,0.10,162000
Q4,North America,Partner,DataVault Enterprise,680,0.10,306000
Q4,Europe,Direct,AI Gateway License,1050,0.05,199500
Q4,Europe,E-commerce,Analytics Studio,480,0.10,129600
Q4,APAC,Partner,CloudServer Pro,1250,0.05,118750
Q4,Latin America,Direct,DataVault Enterprise,290,0.05,137750`;

export function parseSalesData(csvText: string): SalesOrder[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const result: SalesOrder[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (!currentLine) continue;

    // Handle potential quoted commas or simple split
    const values = currentLine.split(',').map(v => v.trim());
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      const val = values[index];
      if (['units', 'discount_pct', 'revenue'].includes(header)) {
        row[header] = parseFloat(val) || 0;
      } else {
        row[header] = val;
      }
    });

    // Ensure fallback default column names if slightly misnamed
    result.push({
      quarter: row.quarter || row['quarter'] || 'Q1',
      region: row.region || row['region'] || 'Unknown',
      channel: row.channel || row['channel'] || 'Direct',
      product: row.product || row['product'] || 'Default Product',
      units: Number(row.units ?? row['units'] ?? 0),
      discount_pct: Number(row.discount_pct ?? row['discount_pct'] ?? 0),
      revenue: Number(row.revenue ?? row['revenue'] ?? 0),
    });
  }

  return result;
}
