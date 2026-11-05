export interface SalesOrder {
  quarter: string;
  region: string;
  channel: string;
  product: string;
  units: number;
  discount_pct: number;
  revenue: number;
  [key: string]: any;
}

export interface RegionalQ2Q3Metric {
  region: string;
  q2Revenue: number;
  q3Revenue: number;
  absChange: number;
  pctChange: number;
}
