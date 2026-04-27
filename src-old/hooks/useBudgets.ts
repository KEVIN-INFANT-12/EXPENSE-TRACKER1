import { useState } from "react";

export interface Budget {
  id: number;
  category: string;
  limit: number;
  month: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // ADD
  const addBudget = (b: Omit<Budget, "id">) => {
    setBudgets(prev => [
      ...prev,
      { ...b, id: Date.now() }
    ]);
  };

  // DELETE
  const deleteBudget = (id: number) => {
    setBudgets(prev =>
      prev.filter(b => b.id !== id)
    );
  };

  return {
    budgets,
    addBudget,
    deleteBudget
  };
}