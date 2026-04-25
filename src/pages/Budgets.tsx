import { useState } from "react";
import { useTransactions, useBudgets } from "../hooks/useTransactions";

export default function Budgets() {
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const { transactions, deleteTransaction } = useTransactions();

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  // Add budget
  const handleAddBudget = () => {
    if (!category || !limit) return;

    addBudget({
      category,
      limit: Number(limit),
      month: new Date().toISOString().slice(0, 7),
    });

    setCategory("");
    setLimit("");
  };

  return (
    <div style={{ padding: "20px" }}>
      
      {/* ================= TRANSACTIONS ================= */}
      <h1>Transactions</h1>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p><b>Type:</b> {t.type}</p>
            <p><b>Category:</b> {t.category}</p>
            <p><b>Amount:</b> ₹{t.amount}</p>
            <p><b>Date:</b> {t.date}</p>

            <button
              onClick={() => deleteTransaction(t._id!)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* ================= ADD BUDGET ================= */}
      <h1>Add Budget</h1>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />

      <button onClick={handleAddBudget}>Add Budget</button>

      {/* ================= BUDGET LIST ================= */}
      <h1>Budgets</h1>

      {budgets.length === 0 ? (
        <p>No budgets yet</p>
      ) : (
        budgets.map((b) => {
          const spent = transactions
            .filter(t => t.category === b.category)
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #000",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <p><b>Category:</b> {b.category}</p>
              <p><b>Limit:</b> ₹{b.limit}</p>
              <p><b>Spent:</b> ₹{spent}</p>

              <button onClick={() => deleteBudget(b.id)}>
                Delete Budget
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}