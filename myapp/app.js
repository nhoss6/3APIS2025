 
import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

import connectDB from "./db.js"; // Connexion MongoDB
import Product from "./models/Product.js"; // Modèle

// --- Routers ---
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import postsRouter from "./routes/posts.js";         
import commentsRouter from "./routes/comments.js";
import authRouter from "./routes/auth.js";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connexion MongoDB au démarrage
connectDB();

// Création de l'app Express
const app = express();

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes principales
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);          
app.use("/", commentsRouter);

// Exemple de routes MongoDB directes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

// Route par défaut (utile pour tests ou debug)
app.get("/", (req, res) => {
  res.json({ message: "🚀 API 3APIS opérationnelle" });
});

// Export pour Supertest / Jest
export default app;
