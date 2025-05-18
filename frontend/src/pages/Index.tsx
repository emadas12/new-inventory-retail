
import React from "react";
import { 
  Package, DollarSign, AlertTriangle, RefreshCw
} from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import LowStockProducts from "@/components/LowStockProducts";
import RecentRestocks from "@/components/RecentRestocks";
import StockLevelChart from "@/components/StockLevelChart";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useProductAnalytics } from "@/hooks/useProductAnalytics";

const Index = () => {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: productAnalytics, isLoading: isAnalyticsLoading } = useProductAnalytics();
  
  // Format aggregate stock trend data for the chart
  const stockTrendData = React.useMemo(() => {
    if (!productAnalytics) return [];
    
    // Get all unique dates from all products
    const allDates = new Set<string>();
    productAnalytics.forEach((product) => {
      product.trends.forEach((trend) => {
        allDates.add(trend.date);
      });
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort();
    
    // Create aggregated data points for each date
    return sortedDates.map((date) => {
      // Sum up stock for all products on this date
      const totalStock = productAnalytics.reduce((sum, product) => {
        const dateTrend = product.trends.find((trend) => trend.date === date);
        return sum + (dateTrend ? dateTrend.stock : 0);
      }, 0);
      
      return {
        name: date,
        stock: totalStock
      };
    });
  }, [productAnalytics]);

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your retail inventory system
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardMetricCard
          title="Total Products"
          value={isSummaryLoading ? "Loading..." : summary?.totalProducts || 0}
          icon={<Package className="h-4 w-4" />}
        />
        <DashboardMetricCard
          title="Inventory Value"
          value={isSummaryLoading 
            ? "Loading..." 
            : `$${summary?.totalValue.toFixed(2) || 0}`
          }
          description="Total retail value of current stock"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <DashboardMetricCard
          title="Low Stock Items"
          value={isSummaryLoading ? "Loading..." : summary?.lowStockProducts || 0}
          description="Products below threshold"
          icon={<AlertTriangle className="h-4 w-4" />}
          className={summary?.lowStockProducts ? "border-red-200" : ""}
        />
        <DashboardMetricCard
          title="Restocks Pending"
          value={isSummaryLoading ? "Loading..." : summary?.restocksPending || 0}
          description="Items needing restock"
          icon={<RefreshCw className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <LowStockProducts />
        <RecentRestocks />
      </div>
      
      <div className="mb-8">
        {isAnalyticsLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading stock trend data...</p>
          </div>
        ) : (
          <StockLevelChart 
            data={stockTrendData} 
            title="Overall Inventory Trends (Last 30 Days)" 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
