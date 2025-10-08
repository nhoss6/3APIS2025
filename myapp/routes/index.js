// routes/index.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the API root 🚀");
});

export default router;
