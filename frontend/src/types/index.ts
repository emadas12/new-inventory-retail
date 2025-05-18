
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number; // חשוב: השתמש ב-stock (לא stock_level) בקוד frontend
  lowStockThreshold: number;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}



export interface RestockLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  date: string;
}

export interface StockTrend {
  date: string;
  stock: number;
}

export interface ProductAnalytics {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  trends: StockTrend[];
}

export interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  totalValue: number;
  restocksPending: number;
}
