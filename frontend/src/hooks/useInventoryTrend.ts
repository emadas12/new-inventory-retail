import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface InventoryTrendPoint {
  date: string;
  stock: number;
}

export function useInventoryTrend() {
  return useQuery<InventoryTrendPoint[]>({
    queryKey: ["inventoryTrend"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/analytics/inventory-trend`);
      return res.data;
    },
  });
}
