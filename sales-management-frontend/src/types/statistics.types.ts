// Top Selling Product
export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

// Statistics Response
export interface Statistics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  topSellingProducts: TopSellingProduct[];
  revenueByDate: Record<string, number>; // { "01/01/2024": 1000000, ... }
}

// Date Range Request
export interface DateRangeRequest {
  startDate: string; // ISO format
  endDate: string; // ISO format
}

// Statistics State
export interface StatisticsState {
  data: Statistics | null;
  isLoading: boolean;
  error: string | null;
}

// Chart Data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}