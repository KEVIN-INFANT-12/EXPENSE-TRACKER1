import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  category: String,
  notes: String,
  date: String,
  userId: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// TEST
app.get("/", (req, res) => {
  res.send("API running");
});

// GET
app.get("/api/expenses", async (req, res) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
app.post("/api/expenses", async (req, res) => {
  const newData = new Transaction(req.body);
  await newData.save();
  res.json(newData);
});

// DELETE ✅ FIXED
app.delete("/api/expenses/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE ✅ FIXED
app.put("/api/expenses/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});