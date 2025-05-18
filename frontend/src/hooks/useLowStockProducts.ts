
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

// In a real app, this would fetch from your API
const fetchLowStockProducts = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:5000/api/products/low-stock");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};


export function useLowStockProducts() {
  return useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: fetchLowStockProducts,
  });
}
