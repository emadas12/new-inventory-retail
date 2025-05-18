import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface TrendPoint {
  date: string;
  stock: number;
}

export function useProductAnalytics(productId: string, options = {}) {
  return useQuery<TrendPoint[]>({
    queryKey: ["productAnalytics", productId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/product-trend/${productId}`);
      return res.data;
    },
    enabled: !!productId,
    ...options,
  });
}
