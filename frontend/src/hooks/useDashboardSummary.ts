import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/types";

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch('http://localhost:5000/api/dashboard/summary');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  return response.json();
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
  });
}
