import { useState, useEffect, useCallback } from "react";

export interface Transaction {
  _id?: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  notes: string;
}

const API = "https://expense-backend-37bi.onrender.com";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // FETCH
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/api/expenses`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ADD
  const addTransaction = useCallback(async (tx: Omit<Transaction, "_id">) => {
    try {
      const res = await fetch(`${API}/api/expenses`, {
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

  // DELETE
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await fetch(`${API}/api/expenses/${id}`, {
        method: "DELETE",
      });

      setTransactions(prev =>
        prev.filter(item => item._id !== id)
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  }, []);

  return {
    transactions,
    addTransaction,
    deleteTransaction
  };
}
// ================= BUDGETS =================

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

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  return { budgets, addBudget, deleteBudget };
}