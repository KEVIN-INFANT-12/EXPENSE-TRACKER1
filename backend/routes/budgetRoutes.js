import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js"; // ✅ ADDED

const router = express.Router();

// ✅ DEFINE MODEL HERE (no import issues)
const budgetSchema = new mongoose.Schema({
  category: String,
  limit: Number,
  month: String,
  userId: String, // ✅ ADDED
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

// ================= GET =================
router.get("/", auth, async (req, res) => {
  const data = await Budget.find({
    userId: req.user.id, // ✅ FILTER
  });
  res.json(data);
});

// ================= POST =================
router.post("/", auth, async (req, res) => {
  const newData = new Budget({
    ...req.body,
    userId: req.user.id, // ✅ ATTACH USER
  });

  await newData.save();
  res.json(newData);
});

// ================= DELETE =================
router.delete("/:id", auth, async (req, res) => {
  await Budget.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id, // ✅ ONLY OWN
  });

  res.json({ success: true });
});

export default router;