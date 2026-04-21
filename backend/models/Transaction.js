import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  category: String,
  notes: String,
  date: String
});

export default mongoose.model("Transaction", transactionSchema);