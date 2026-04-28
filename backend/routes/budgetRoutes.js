import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ DEFINE MODEL HERE (no import issues)
const budgetSchema = new mongoose.Schema({
  category: String,
  limit: Number,
  month: String,
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

// GET
router.get("/", async (req, res) => {
  const data = await Budget.find();
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newData = new Budget(req.body);
  await newData.save();
  res.json(newData);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;