import { useState, useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // FILTER
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;

      if (
        search &&
        !t.category.toLowerCase().includes(search.toLowerCase()) &&
        !t.notes.toLowerCase().includes(search.toLowerCase())
      ) return false;

      return true;
    });
  }, [transactions, search, filterType, filterCategory]);

  // ANALYSIS
  const analysis = useMemo(() => {
    if (filtered.length === 0) return null;

    const total = filtered.reduce((s, t) => s + t.amount, 0);
    const avg = total / filtered.length;
    const max = Math.max(...filtered.map(t => t.amount));
    const min = Math.min(...filtered.map(t => t.amount));

    return { total, avg, max, min };
  }, [filtered]);

  const fmt = (n: number) => "₹" + n.toLocaleString();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Transactions</h1>

      {/* ADD SIMPLE */}
      <button
        onClick={() =>
          addTransaction({
            amount: 100,
            category: "test",
            type: "expense",
            date: new Date().toISOString(),
            notes: "test"
          })
        }
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Quick Add
      </button>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1"
        />

        <select onChange={(e) => setFilterType(e.target.value)} className="border p-2">
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="all">All Categories</option>
          {[...new Set(transactions.map(t => t.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

      </div>

      {/* ANALYSIS */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <div className="p-3 border rounded">
            <p>Total</p>
            <b>{fmt(analysis.total)}</b>
          </div>

          <div className="p-3 border rounded">
            <p>Avg</p>
            <b>{fmt(analysis.avg)}</b>
          </div>

          <div className="p-3 border rounded">
            <p>Max</p>
            <b>{fmt(analysis.max)}</b>
          </div>

          <div className="p-3 border rounded">
            <p>Min</p>
            <b>{fmt(analysis.min)}</b>
          </div>

        </div>
      )}

      {/* LIST */}
      <div className="border rounded">

        {filtered.length === 0 && (
          <p className="p-4 text-center">No transactions</p>
        )}

        {filtered.map((tx) => (
          <div key={tx._id} className="flex justify-between p-3 border-b">

            <div>
              <p>{tx.category}</p>
              <small>{tx.date}</small>
            </div>

            <div className="flex gap-3 items-center">
              <span>
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </span>

              <button
                onClick={() => deleteTransaction(tx._id!)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}