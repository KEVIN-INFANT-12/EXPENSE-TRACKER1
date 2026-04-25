import { useTransactions } from "../hooks/useTransactions.ts";
import { useBudgets } from "../hooks/useBudgets.ts";
import { useState } from "react";

export default function Budgets() {
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const { transactions, deleteTransaction } = useTransactions();

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

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
      <h1>Transactions</h1>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map((t) => (
          <div key={t._id}>
            {t.category} - ₹{t.amount}
            <button onClick={() => deleteTransaction(t._id!)}>
              Delete
            </button>
          </div>
        ))
      )}

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

      <h1>Budgets</h1>

      {budgets.length === 0 ? (
        <p>No budgets yet</p>
      ) : (
        budgets.map((b) => {
          const spent = transactions
            .filter((t) => t.category === b.category)
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={b.id}>
              {b.category} - ₹{b.limit} | Spent: ₹{spent}
              <button onClick={() => deleteBudget(b.id)}>
                Delete
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}