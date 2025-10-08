import express from "express";
import Product from "../models/Product.js";
import { productSchema, productUpdateSchema } from "../validators/productValidator.js";

const router = express.Router();

//   CREATE
router.post("/", async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const product = await Product.create(value);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//   READ all
router.get("/", async (_req, res) => {
  const products = await Product.find();
  res.json(products);
});

//   READ by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

//   UPDATE (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    // Validation avec le schéma de mise à jour (champs optionnels)
    const { error, value } = productUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Mise à jour dans MongoDB
    const product = await Product.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//   DELETE
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: `Product ${product.name} deleted successfully` });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

export default router;
