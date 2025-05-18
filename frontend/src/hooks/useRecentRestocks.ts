import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface RestockLog {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  timestamp: string;
}

const fetchRecentRestocks = async (): Promise<RestockLog[]> => {
  const res = await axios.get(`${API_URL}/restocks`);
  const logs = res.data;

  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs.slice(0, 5);
};

export function useRecentRestocks() {
  return useQuery({
    queryKey: ["recentRestocks"],
    queryFn: fetchRecentRestocks,
  });
}
