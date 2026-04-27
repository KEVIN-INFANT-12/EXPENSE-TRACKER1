import { useState, useEffect } from "react";

/* ================= TYPES ================= */

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string; // ✅ FIXED
  type: TransactionType;
  date: string;
  notes: string;
}

/* ================= CONSTANTS ================= */

export const EXPENSE_CATEGORIES = [
  "food",
  "rent",
  "transport",
  "entertainment",
  "utilities",
  "shopping",
  "health",
  "education",
  "other",
];

export const INCOME_CATEGORIES = [
  "salary",
  "freelance",
  "investment",
  "other",
];

export const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔",
  rent: "🏠",
  transport: "🚗",
  entertainment: "🎬",
  utilities: "💡",
  shopping: "🛍️",
  health: "🏥",
  education: "📚",
  salary: "💰",
  freelance: "💻",
  investment: "📈",
  other: "📌",
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: "#3B82F6",
  rent: "#6366F1",
  transport: "#F59E0B",
  entertainment: "#EC4899",
  utilities: "#8B5CF6",
  shopping: "#14B8A6",
  health: "#EF4444",
  education: "#06B6D4",
  salary: "#22C55E",
  freelance: "#3B82F6",
  investment: "#F59E0B",
  other: "#94A3B8",
};

/* ================= API ================= */

const API = "https://expense-backend-37bi.onrender.com";

/* ================= TRANSACTIONS ================= */

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // FETCH
  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/expenses`);
      const data = await res.json();

      // ✅ FIXED (NO CRASH)
      const fixed = data.map((t: any) => ({
        id: t._id,
        amount: t.amount,
        category: t.category || "other",
        type: t.type,
        date: t.date,
        notes: t.notes || "",
      }));

      setTransactions(fixed);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ADD
  const addTransaction = async (tx: Omit<Transaction, "id">) => {
    try {
      const res = await fetch(`${API}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tx),
      });

      const newTx = await res.json();

      setTransactions((prev) => [
        {
          id: newTx._id,
          amount: newTx.amount,
          category: newTx.category,
          type: newTx.type,
          date: newTx.date,
          notes: newTx.notes || "",
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("ADD ERROR:", err);
    }
  };

  // DELETE
  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`${API}/api/expenses/${id}`, {
        method: "DELETE",
      });

      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // UPDATE
  const updateTransaction = async (
    id: string,
    data: Partial<Transaction>
  ) => {
    try {
      const res = await fetch(`${API}/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const updated = await res.json();

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                id,
                amount: updated.amount,
                category: updated.category,
                type: updated.type,
                date: updated.date,
                notes: updated.notes || "",
              }
            : t
        )
      );
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
}

/* ================= BUDGETS ================= */

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addBudget = (bg: Omit<Budget, "id">) => {
    setBudgets((prev) => [
      ...prev,
      { ...bg, id: `b-${Date.now()}` },
    ]);
  };

  const updateBudget = (id: string, data: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...data } : b
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) =>
      prev.filter((b) => b.id !== id)
    );
  };

  return { budgets, addBudget, updateBudget, deleteBudget };
}