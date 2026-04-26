import { useTransactions } from "../hooks/useTransactions";
import { useState } from "react";

export default function TransactionsPage() {
  const { transactions, deleteTransaction, addTransaction } = useTransactions();

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
      notes: ""
    });

    setAmount("");
    setCategory("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Transactions
      </h1>

      {/* ADD FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <select
          onChange={(e) => setType(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button
          onClick={handleAdd}
          style={{
            padding: "8px 12px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Add
        </button>
      </div>

      {/* LIST */}
      {transactions.length === 0 ? (
        <p>No data found</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>
              {t.category} - Rs. {t.amount} ({t.type})
            </span>

            <button
              onClick={() => deleteTransaction(t._id!)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px"
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}