import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLowStockProducts } from "@/hooks/useLowStockProducts";

const LowStockProducts: React.FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useLowStockProducts();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-inventory-red mr-2" />
            Low Stock Products
          </CardTitle>
          <CardDescription>Products that need to be restocked</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/restock")}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Restock
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <p>Loading...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-inventory-red font-medium">
                    {product.stockLevel} / {product.lowStockThreshold}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <p>No low stock products.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockProducts;
