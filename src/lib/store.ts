import { useState, useEffect } from "react";

/* ================= TYPES ================= */

export type TransactionType = "income" | "expense";

export type Category =
  | "food"
  | "rent"
  | "transport"
  | "entertainment"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes: string;
}

/* ================= CONSTANTS ================= */

export const EXPENSE_CATEGORIES: Category[] = [
  "food", "rent", "transport", "entertainment",
  "utilities", "shopping", "health", "education", "other",
];

export const INCOME_CATEGORIES: Category[] = [
  "salary", "freelance", "investment", "other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
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

export const CATEGORY_COLORS: Record<Category, string> = {
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

// ✅ FIX: ONLY ONE API DECLARATION
const API = import.meta.env.VITE_API_URL;

/* ================= TRANSACTIONS ================= */

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/expenses`);
      const data = await res.json();

      const fixed = data.map((t: any) => ({
        ...t,
        id: t._id,
      }));

      setTransactions(fixed);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        { ...newTx, id: newTx._id },
        ...prev,
      ]);
    } catch (err) {
      console.error("ADD ERROR:", err);
    }
  };

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
          t.id === id ? { ...updated, id } : t
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
  category: Category;
  limit: number;
  month: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const fetchBudgets = async () => {
    const res = await fetch(`${API}/api/budgets`);
    const data = await res.json();

    const fixed = data.map((b: any) => ({
      id: b._id,
      category: b.category,
      limit: b.limit,
      month: b.month,
    }));

    setBudgets(fixed);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async (bg: Omit<Budget, "id">) => {
    const res = await fetch(`${API}/api/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bg),
    });

    const newBg = await res.json();

    setBudgets((prev) => [
      {
        id: newBg._id,
        category: newBg.category,
        limit: newBg.limit,
        month: newBg.month,
      },
      ...prev,
    ]);
  };

  const deleteBudget = async (id: string) => {
    await fetch(`${API}/api/budgets/${id}`, {
      method: "DELETE",
    });

    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return { budgets, addBudget, deleteBudget };
}