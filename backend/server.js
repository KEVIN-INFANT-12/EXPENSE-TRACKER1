import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Transaction from "./models/Transaction.js"; //  IMPORTANT

const app = express();

app.use(cors());
app.use(express.json());

// DB CONNECTION
mongoose.connect("mongodb://localhost:27017/expenseDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// TEST
app.get("/", (req, res) => {
  res.send("API running");
});

// GET
app.get("/transactions", async (req, res) => {
  const data = await Transaction.find();
  res.json(data);
});

// POST
app.post("/transactions", async (req, res) => {
  const newTx = new Transaction(req.body);
  await newTx.save();
  res.json(newTx);
});

// DELETE
app.delete("/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

//  UPDATE
app.put("/transactions/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});