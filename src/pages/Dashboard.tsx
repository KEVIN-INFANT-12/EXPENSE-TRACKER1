import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

import { useTransactions } from "../hooks/useTransactions";

// simple category colors (since you don’t have store file)
const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function Dashboard() {
  const { transactions } = useTransactions();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    // category breakdown
    const catMap: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    const categoryData = Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      income,
      expenses,
      balance: income - expenses,
      categoryData,
    };
  }, [transactions]);

  const fmt = (n: number) => "₹" + n.toLocaleString();

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="p-4 border rounded-lg">
          <p>Balance</p>
          <h2 className="text-xl font-bold">{fmt(stats.balance)}</h2>
        </div>

        <div className="p-4 border rounded-lg">
          <p>Income</p>
          <h2 className="text-green-600">{fmt(stats.income)}</h2>
        </div>

        <div className="p-4 border rounded-lg">
          <p>Expenses</p>
          <h2 className="text-red-600">{fmt(stats.expenses)}</h2>
        </div>

      </div>

      {/* BAR CHART */}
      <div className="p-4 border rounded-lg">
        <h3 className="mb-4">Income vs Expenses</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{ name: "Total", income: stats.income, expenses: stats.expenses }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="p-4 border rounded-lg">
        <h3 className="mb-4">Category Breakdown</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={stats.categoryData} dataKey="value" nameKey="name">
              {stats.categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT */}
      <div className="p-4 border rounded-lg">
        <h3 className="mb-4">Recent Transactions</h3>

        {transactions.slice(0, 5).map((tx) => (
          <div key={tx._id} className="flex justify-between border-b py-2">
            <span>{tx.category}</span>
            <span>
              {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}