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
      
      {/* ADD FORM */}
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

      <button onClick={handleAdd}>Add</button>

      <hr />

      {/* LIST */}
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