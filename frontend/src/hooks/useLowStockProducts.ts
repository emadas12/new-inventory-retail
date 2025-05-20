import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

// Fetch low stock products from API and convert to camelCase
const fetchLowStockProducts = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:5000/api/products/low-stock");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const raw = await response.json();

  return raw.map((product: any) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    stockLevel: product.stock_level,
    lowStockThreshold: product.low_stock_threshold,
    category: product.category,
    price: product.price,
    cost: product.cost,
    description: product.description ?? "", // optional
  }));
};

export function useLowStockProducts() {
  return useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: fetchLowStockProducts,
  });
}
