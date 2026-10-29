Experiment 8: Product Catalog using MongoDB and Mongoose.    



const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/productCatalog")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String
  }
});

const Product = mongoose.model("Product", productSchema);

// Add Product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      productId: req.params.id
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      productId: req.params.id
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Products by Name
app.get("/search/:name", async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
bash
npm init -y
npm install express mongoose
node server.js