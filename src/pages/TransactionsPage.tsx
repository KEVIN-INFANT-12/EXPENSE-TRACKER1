import { useTransactions } from "../hooks/useTransactions";
import AddTransactionModal from "../components/AddTransactionModal";
import { useState } from "react";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // FILTER LOGIC (SAFE)
  const filtered = transactions.filter((t) => {
    return (
      (typeFilter === "all" || t.type === typeFilter) &&
      (categoryFilter === "all" || t.category === categoryFilter) &&
      (t.category || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const uniqueCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <AddTransactionModal />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow">

        {/* SEARCH */}
        <input
          placeholder="Search by category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* TYPE FILTER */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* CATEGORY FILTER */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>

          {uniqueCategories.length === 0 ? (
            <option disabled>No categories</option>
          ) : (
            uniqueCategories.map((c, i) => (
              <option key={i}>{c}</option>
            ))
          )}
        </select>

      </div>

      {/* LIST */}
      <div className="bg-white shadow rounded-xl p-4">

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No transactions found
          </p>
        ) : (
          filtered.map((t) => (
            <div
              key={t._id || Math.random()}
              className="flex justify-between items-center border-b py-3"
            >

              {/* LEFT */}
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">

                <span
                  className={
                    t.type === "income"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </span>

                <button
                  onClick={() => deleteTransaction(t._id!)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}