import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface InventoryMetric {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  changeAmount: number;
  changePercent: number | string;
}

export function useInventoryTrends() {
  return useQuery<InventoryMetric[]>({
    queryKey: ["inventoryTrends"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/metrics`);
      return res.data;
    },
  });
}
