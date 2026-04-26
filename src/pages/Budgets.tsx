import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useBudgets, useTransactions } from "../hooks/useTransactions";

export default function Budgets() {
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [open, setOpen] = useState(false);

  const thisMonth = new Date().toISOString().slice(0, 7);

  const categories = ["food", "rent", "transport", "shopping", "other"];

  const handleAdd = () => {
    if (!category || !limit) return;

    addBudget({
  category: category as any,
  limit: Number(limit),
  month: thisMonth,
});

    setCategory("");
    setLimit("");
    setOpen(false);
  };

  const fmt = (n: number) => "₹" + n.toLocaleString();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budgets</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Budget
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <div className="p-4 border rounded-lg space-y-3 bg-white shadow">
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border p-2 w-full"
          />

          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      )}

      {/* BUDGET CARDS */}
      <div className="grid md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const spent = transactions
            .filter(
              (t) =>
                t.type === "expense" &&
                t.category === b.category &&
                t.date.startsWith(thisMonth)
            )
            .reduce((s, t) => s + t.amount, 0);

          const pct = Math.round((spent / b.limit) * 100);

          return (
            <div key={b.id} className="p-4 border rounded-lg space-y-2">

              <div className="flex justify-between">
                <h3 className="font-semibold">{b.category}</h3>

                <button onClick={() => deleteBudget(b.id)}>
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                {fmt(spent)} / {fmt(b.limit)}
              </p>

              {/* PROGRESS BAR */}
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    pct > 100
                      ? "bg-red-500"
                      : pct > 80
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>

              {pct > 100 && (
                <p className="text-red-500 text-sm">
                  Over budget by {fmt(spent - b.limit)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No budgets yet
        </p>
      )}
    </div>
  );
}