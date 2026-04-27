import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";

export default function AddTransactionModal() {
  const { addTransaction } = useTransactions();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const handleAdd = () => {
    if (!amount || !category) return;

    addTransaction({
      amount: Number(amount),
      category,
      type: type as "income" | "expense",
      date: new Date().toISOString(),
      notes: "",
    });

    setAmount("");
    setCategory("");
    setOpen(false);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Transaction
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">

            <h2 className="text-xl font-bold">Add Transaction</h2>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div className="flex justify-between">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}