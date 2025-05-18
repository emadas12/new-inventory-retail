
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import ProductTable from "@/components/ProductTable";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory products</p>
        </div>
        <Button onClick={() => navigate("/products/new")}>Add New Product</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
          <p>Error loading products. Please try again later.</p>
        </div>
      ) : products && products.length > 0 ? (
        <ProductTable products={products} />
      ) : (
        <div className="bg-muted p-8 text-center rounded-md">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first product to the inventory
          </p>
          <Button onClick={() => navigate("/products/new")}>
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
