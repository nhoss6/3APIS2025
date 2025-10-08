import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

// Ajouter un commentaire
router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Text required" });

    const comment = await Comment.create({ post: postId, text });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Récupérer tous les commentaires d’un post
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modifier un commentaire
router.patch("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const updated = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
