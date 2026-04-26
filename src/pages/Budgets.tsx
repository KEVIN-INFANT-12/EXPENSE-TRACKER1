import { useState } from "react";
import { useBudgets, Category } from "../hooks/useTransactions";
import { Button } from "@/components/ui/button";

export default function Budgets() {
  const { budgets, addBudget, deleteBudget } = useBudgets();

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const handleAdd = () => {
    if (!category || !limit) return;

    addBudget({
      category: category as Category,
      limit: Number(limit),
      month: new Date().toISOString().slice(0, 7),
    });

    setCategory("");
    setLimit("");
  };

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">Budgets</h1>

      {/* ADD FORM */}
      <div className="flex gap-3 flex-wrap">

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        <input
          type="number"
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        <Button onClick={handleAdd}>
          Add Budget
        </Button>

      </div>

      {/* LIST */}
      {budgets.length === 0 ? (
        <p>No budgets yet</p>
      ) : (
        <div className="space-y-3">
          {budgets.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <span>
                {b.category} - ₹ {b.limit}
              </span>

              <Button
                variant="destructive"
                onClick={() => deleteBudget(b.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}