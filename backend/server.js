const express = require('express');
const app = express();
const PORT = 5001; // Changed to avoid conflict with Flask

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store products
let products = [];

// GET route to fetch all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET route to fetch products with low stock
app.get('/api/products/low-stock', (req, res) => {
  const lowStockProducts = products.filter(p => p.stock <= 10);
  res.json(lowStockProducts);
});

// POST route to add a new product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;

  // Validate required fields
  const requiredFields = ['id', 'name', 'sku', 'price', 'stock'];
  for (let field of requiredFields) {
    if (!newProduct[field]) {
      return res.status(400).json({ error: `Missing field: ${field}` });
    }
  }

  // Optional: Check if product with same ID already exists
  const exists = products.some(p => p.id === newProduct.id);
  if (exists) {
    return res.status(400).json({ error: 'Product with this ID already exists' });
  }

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
