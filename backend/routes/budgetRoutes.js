import express from "express";
import Budget from "../models/Budget.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});

router.post("/", async (req, res) => {
  const budget = new Budget(req.body);
  await budget.save();
  res.json(budget);
});

router.delete("/:id", async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;