import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import budgetRoutes from "./routes/budgetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import auth from "./middleware/auth.js"; // ✅ ADDED

const app = express();

// 🔥 DEBUG LOG
console.log("SERVER FILE LOADED 🚀");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ROUTES
app.use("/api/budgets", budgetRoutes);

// TEST ROUTES
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/test-budget", (req, res) => {
  res.send("Budget route working");
});

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// TRANSACTION MODEL
const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  category: String,
  notes: String,
  date: String,
  userId: String, // already present ✅
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// ================= EXPENSE ROUTES =================

// GET (only user data)
app.get("/api/expenses", auth, async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.user.id }); // ✅ FILTER
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (attach userId)
app.post("/api/expenses", auth, async (req, res) => {
  const newData = new Transaction({
    ...req.body,
    userId: req.user.id, // ✅ ADD USER
  });

  await newData.save();
  res.json(newData);
});

// DELETE (only own data)
app.delete("/api/expenses/:id", auth, async (req, res) => {
  await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ message: "Deleted" });
});

// UPDATE (only own data)
app.put("/api/expenses/:id", auth, async (req, res) => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  res.json(updated);
});

// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});