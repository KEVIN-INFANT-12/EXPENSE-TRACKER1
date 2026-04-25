import { useTransactions } from "../hooks/useTransactions";
import { useState } from "react";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const API = "https://expense-backend-37bi.onrender.com";

  const addTransaction = async () => {
    try {
      const res = await fetch(`${API}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          type,
          date: new Date().toISOString(),
          notes: ""
        })
      });

      const data = await res.json();
      console.log("ADDED:", data);

      // refresh page manually for now
      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>Add Transaction</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={addTransaction}>
        Add
      </button>

      <hr />

      <h1>Transactions</h1>

      {transactions.length === 0 ? (
        <p>No data found</p>
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
    </div>
  );
}