import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/demo-login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "username is required" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ username, token });
});

export default router;
