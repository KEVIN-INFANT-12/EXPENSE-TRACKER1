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

export interface Transaction {
  _id?: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes: string;
  recurring?: boolean;
}

// ✅ FINAL API (with env support)
const API = import.meta.env.VITE_API_URL || "https://expense-backend-37bi.onrender.com";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ✅ FETCH
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/transactions`);
      const data = await res.json();
      console.log("DATA FROM BACKEND:", data);
      setTransactions(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ ADD
  const addTransaction = useCallback(async (tx: Omit<Transaction, "_id">) => {
    try {
      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tx)
      });

      const newTx = await res.json();
      setTransactions(prev => [newTx, ...prev]);
    } catch (err) {
      console.error("ADD ERROR:", err);
    }
  }, []);

  // ✅ DELETE
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await fetch(`${API}/transactions/${id}`, {
        method: "DELETE"
      });
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  }, []);

  // ✅ UPDATE
  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    try {
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
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  }, []);

  return { transactions, addTransaction, deleteTransaction, updateTransaction };
}
