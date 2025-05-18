import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StockLevelChart from "@/components/StockLevelChart";
import { useProductAnalytics } from "@/hooks/useProductAnalytics";
import { useInventoryTrends } from "@/hooks/useInventoryTrends";
import { useProducts } from "@/hooks/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AnalyticsPage: React.FC = () => {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const { data: productTrend = [] } = useProductAnalytics(selectedProductId, {
    enabled: !!selectedProductId,
  });

  const { data: productMetrics = [], isLoading: isLoadingMetrics } = useInventoryTrends();

  const selectedProduct = products.find(
    (p) => p.id.toString() === selectedProductId
  );

  const chartData = useMemo(() => {
    return productTrend.map((point) => ({
      name: point.date,
      stock: point.stock,
    }));
  }, [productTrend]);

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Inventory trends and stock analysis
        </p>
      </div>

      {/* Product Stock Trends Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Stock Trends</CardTitle>
            <CardDescription>
              View stock level changes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label htmlFor="product-select" className="block mb-2 text-sm font-medium">
                Select Product
              </label>
              <Select
                value={selectedProductId}
                onValueChange={(val) => setSelectedProductId(val)}
              >
                <SelectTrigger id="product-select" className="w-full max-w-xs">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingProducts ? (
                    <SelectItem value="loading" disabled>
                      Loading products...
                    </SelectItem>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No products available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedProductId ? (
              <div className="h-[300px]">
                <StockLevelChart
                  data={chartData}
                  title={`Stock Trends: ${selectedProduct?.name || ""}`}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-[300px] bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Select a product to view stock trends
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Metrics</CardTitle>
          <CardDescription>
            Stock level statistics for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingMetrics ? (
            <div className="flex justify-center py-4">
              <p>Loading metrics...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Min Stock</TableHead>
                  <TableHead className="text-right">Max Stock</TableHead>
                  <TableHead className="text-right">30-Day Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell>{metric.name}</TableCell>
                    <TableCell>{metric.sku}</TableCell>
                    <TableCell className="text-right">{metric.currentStock}</TableCell>
                    <TableCell className="text-right">{metric.minStock}</TableCell>
                    <TableCell className="text-right">{metric.maxStock}</TableCell>
                    <TableCell className="text-right">
                      <span className={
                        metric.changeAmount > 0
                          ? "text-inventory-green"
                          : metric.changeAmount < 0
                          ? "text-inventory-red"
                          : ""
                      }>
                        {metric.changeAmount > 0 ? "+" : ""}
                        {metric.changeAmount} ({metric.changePercent}%)
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
