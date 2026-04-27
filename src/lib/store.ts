const API = "https://expense-backend-37bi.onrender.com";

// ================= TYPES =================
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  notes: string;
}

// ================= TRANSACTIONS =================
import { useState, useEffect } from "react";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // FETCH
  const fetchData = async () => {
    const res = await fetch(`${API}/api/expenses`);
    const data = await res.json();

    // 🔥 IMPORTANT FIX: map _id → id
    const fixed = data.map((t: any) => ({
      ...t,
      id: t._id
    }));

    setTransactions(fixed);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ADD
  const addTransaction = async (tx: Omit<Transaction, "id">) => {
    const res = await fetch(`${API}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tx)
    });

    const newTx = await res.json();

    setTransactions(prev => [{ ...newTx, id: newTx._id }, ...prev]);
  };

  // DELETE
  const deleteTransaction = async (id: string) => {
    await fetch(`${API}/api/expenses/${id}`, {
      method: "DELETE"
    });

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // UPDATE
  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const res = await fetch(`${API}/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const updated = await res.json();

    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...updated, id } : t)
    );
  };

  return { transactions, addTransaction, deleteTransaction, updateTransaction };
}