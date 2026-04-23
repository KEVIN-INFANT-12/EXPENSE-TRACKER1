import { useState, useEffect, useCallback } from "react";

export type TransactionType = "expense" | "income";

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

export const EXPENSE_CATEGORIES: Category[] = [
  "food", "rent", "transport", "entertainment", "utilities", "shopping", "health", "education", "other",
];

export const INCOME_CATEGORIES: Category[] = [
  "salary", "freelance", "investment", "other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  food: "🍔", rent: "🏠", transport: "🚗", entertainment: "🎬",
  utilities: "💡", shopping: "🛍️", health: "🏥", education: "📚",
  salary: "💰", freelance: "💻", investment: "📈", other: "📌",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  food: "#3B82F6", rent: "#6366F1", transport: "#F59E0B", entertainment: "#EC4899",
  utilities: "#8B5CF6", shopping: "#14B8A6", health: "#EF4444", education: "#06B6D4",
  salary: "#22C55E", freelance: "#3B82F6", investment: "#F59E0B", other: "#94A3B8",
};

export interface Transaction {
  _id?: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes: string;
  recurring?: boolean;
}

// 🔥 BACKEND API URL
const API = "https://expense-backend-37bi.onrender.com";

// ================= TRANSACTIONS =================

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ✅ FETCH FROM BACKEND
const fetchTransactions = async () => {
  const res = await fetch(`${API}/transactions`);
  const data = await res.json();
  console.log("DATA FROM BACKEND:", data); // 🔥 ADD THIS
  setTransactions(data);
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ ADD
  const addTransaction = useCallback(async (tx: Omit<Transaction, "_id">) => {
    const res = await fetch(`${API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tx)
    });

    const newTx = await res.json();
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  // ✅ DELETE
  const deleteTransaction = useCallback(async (id: string) => {
    await fetch(`${API}/transactions/${id}`, {
      method: "DELETE"
    });
    setTransactions(prev => prev.filter(t => t._id !== id));
  }, []);

  // ✅ UPDATE
  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    const res = await fetch(`${API}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const updated = await res.json();
    setTransactions(prev =>
      prev.map(t => t._id === id ? updated : t)
    );
  }, []);

  return { transactions, addTransaction, deleteTransaction, updateTransaction };
}

// ================= BUDGETS (still local for now) =================

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addBudget = (bg: Omit<Budget, "id">) => {
    setBudgets(prev => [...prev, { ...bg, id: `b-${Date.now()}` }]);
  };

  const updateBudget = (id: string, data: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  return { budgets, addBudget, updateBudget, deleteBudget };
}