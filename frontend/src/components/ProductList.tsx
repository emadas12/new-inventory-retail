import React, { useEffect, useState } from "react";

type Product = {
 id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  low_stock_threshold: number;
  description: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📦 Product List</h1>
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.id} className="border p-2 rounded">
            <strong>{product.name}</strong> - {product.category} - {product.stock} in stock
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
