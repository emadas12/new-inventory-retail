import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface RestockInput {
  productId: string;
  quantity: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const restockProduct = async ({ productId, quantity }: RestockInput) => {
  const numericId = parseInt(productId); // 🔧 המרה ל-int כדי להתאים ל-<int:product_id>
  const response = await axios.post(`${API_URL}/products/${numericId}/restock`, {
    quantity,
  });
  return response.data;
};

export function useRestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restockProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockProducts"] });
      queryClient.invalidateQueries({ queryKey: ["recentRestocks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["productAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTrend"] });

    },
    onError: (error) => {
      console.error("❌ Restock failed:", error);
    },
  });
}
