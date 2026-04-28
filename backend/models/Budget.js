import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  category: String,
  limit: Number,
  month: String,
}, { timestamps: true });

export default mongoose.model("Budget", budgetSchema);