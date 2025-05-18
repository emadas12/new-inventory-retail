
import { DashboardSummary, Product, ProductAnalytics, RestockLog } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Organic Cotton T-Shirt",
    sku: "TSHIRT-001",
    category: "Apparel",
    price: 24.99,
    cost: 12.50,
    stock: 45,
    lowStockThreshold: 20,
    description: "100% organic cotton t-shirt, available in multiple sizes and colors.",
    createdAt: "2025-01-15T09:30:00Z",
    updatedAt: "2025-04-01T14:15:00Z"
  },
  {
    id: "p2",
    name: "Classic Denim Jeans",
    sku: "JEANS-002",
    category: "Apparel",
    price: 59.99,
    cost: 25.00,
    stock: 28,
    lowStockThreshold: 15,
    description: "Classic straight-leg jeans made from premium denim.",
    createdAt: "2025-01-20T10:45:00Z",
    updatedAt: "2025-04-05T11:30:00Z"
  },
  {
    id: "p3",
    name: "Wireless Headphones",
    sku: "TECH-003",
    category: "Electronics",
    price: 89.99,
    cost: 45.00,
    stock: 12,
    lowStockThreshold: 10,
    description: "Bluetooth wireless headphones with noise cancellation and 24-hour battery life.",
    createdAt: "2025-02-10T08:20:00Z",
    updatedAt: "2025-04-12T16:40:00Z"
  },
  {
    id: "p4",
    name: "Stainless Steel Water Bottle",
    sku: "HOME-004",
    category: "Home Goods",
    price: 19.99,
    cost: 7.50,
    stock: 60,
    lowStockThreshold: 25,
    description: "Double-walled insulated water bottle, keeps drinks cold for 24 hours or hot for 12 hours.",
    createdAt: "2025-02-15T13:10:00Z",
    updatedAt: "2025-04-15T09:25:00Z"
  },
  {
    id: "p5",
    name: "Fitness Tracker",
    sku: "TECH-005",
    category: "Electronics",
    price: 129.99,
    cost: 65.00,
    stock: 8,
    lowStockThreshold: 12,
    description: "Waterproof fitness tracker with heart rate monitor, sleep tracking, and 7-day battery life.",
    createdAt: "2025-02-20T15:30:00Z",
    updatedAt: "2025-04-18T10:15:00Z"
  },
  {
    id: "p6",
    name: "Ceramic Coffee Mug",
    sku: "HOME-006",
    category: "Home Goods",
    price: 12.99,
    cost: 4.00,
    stock: 95,
    lowStockThreshold: 30,
    description: "Handcrafted ceramic coffee mug, microwave and dishwasher safe.",
    createdAt: "2025-03-01T09:00:00Z",
    updatedAt: "2025-04-20T14:50:00Z"
  },
  {
    id: "p7",
    name: "Canvas Sneakers",
    sku: "SHOES-007",
    category: "Footwear",
    price: 44.99,
    cost: 18.00,
    stock: 22,
    lowStockThreshold: 20,
    description: "Classic canvas sneakers, available in multiple colors.",
    createdAt: "2025-03-10T11:20:00Z",
    updatedAt: "2025-04-22T09:30:00Z"
  },
  {
    id: "p8",
    name: "Leather Wallet",
    sku: "ACC-008",
    category: "Accessories",
    price: 34.99,
    cost: 14.00,
    stock: 15,
    lowStockThreshold: 10,
    description: "Genuine leather bi-fold wallet with multiple card slots.",
    createdAt: "2025-03-15T14:45:00Z",
    updatedAt: "2025-04-25T16:20:00Z"
  }
];

// Mock Restock Logs
export const mockRestockLogs: RestockLog[] = [
  {
    id: uuidv4(),
    productId: "p3",
    productName: "Wireless Headphones",
    quantity: 15,
    previousStock: 5,
    newStock: 20,
    date: "2025-04-10T09:15:00Z"
  },
  {
    id: uuidv4(),
    productId: "p5",
    productName: "Fitness Tracker",
    quantity: 12,
    previousStock: 3,
    newStock: 15,
    date: "2025-04-12T14:30:00Z"
  },
  {
    id: uuidv4(),
    productId: "p8",
    productName: "Leather Wallet",
    quantity: 10,
    previousStock: 5,
    newStock: 15,
    date: "2025-04-15T10:45:00Z"
  },
  {
    id: uuidv4(),
    productId: "p2",
    productName: "Classic Denim Jeans",
    quantity: 20,
    previousStock: 8,
    newStock: 28,
    date: "2025-04-18T16:20:00Z"
  },
  {
    id: uuidv4(),
    productId: "p7",
    productName: "Canvas Sneakers",
    quantity: 15,
    previousStock: 7,
    newStock: 22,
    date: "2025-04-22T11:10:00Z"
  }
];

// Mock Dashboard Summary
export const mockDashboardSummary: DashboardSummary = {
  totalProducts: mockProducts.length,
  lowStockProducts: mockProducts.filter(p => p.stock <= p.lowStockThreshold).length,
  totalValue: mockProducts.reduce((sum, product) => sum + (product.price * product.stock), 0),
  restocksPending: mockProducts.filter(p => p.stock <= p.lowStockThreshold).length
};

// Mock Product Analytics
export const mockProductAnalytics: ProductAnalytics[] = mockProducts.map(product => {
  // Generate random stock trends
  const today = new Date();
  const trends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    
    // Random stock value that trends toward current stock
    const startStock = Math.max(0, product.stock - Math.round(Math.random() * 20));
    const progress = i / 29; // 0 to 1 based on day
    const stock = Math.round(startStock + (product.stock - startStock) * progress);
    
    return {
      date: date.toISOString().split('T')[0],
      stock
    };
  });
  
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    currentStock: product.stock,
    trends
  };
});
