import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import budgetRoutes from "./routes/budgetRoutes.js";

const app = express();

// 🔥 DEBUG LOG (to confirm correct file is running)
console.log("SERVER FILE LOADED 🚀");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

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
  userId: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// EXPENSE ROUTES
app.get("/api/expenses", async (req, res) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/expenses", async (req, res) => {
  const newData = new Transaction(req.body);
  await newData.save();
  res.json(newData);
});

app.delete("/api/expenses/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put("/api/expenses/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
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