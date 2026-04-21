import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { TransactionDialog } from "@/components/TransactionDialog";
import {
  useTransactions, useBudgets, CATEGORY_ICONS, CATEGORY_COLORS, type Category,
} from "@/lib/store";

export default function Dashboard() {
  const { transactions, addTransaction } = useTransactions();
  const { budgets } = useBudgets();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1).toISOString().slice(0, 7);

    const thisMonthTx = transactions.filter(t => t.date.startsWith(thisMonth));
    const lastMonthTx = transactions.filter(t => t.date.startsWith(lastMonth));

    const income = thisMonthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const lastExpenses = lastMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const expenseTrend = lastExpenses ? ((expenses - lastExpenses) / lastExpenses) * 100 : 0;

    const catMap: Record<string, number> = {};
    thisMonthTx.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const categoryData = Object.entries(catMap)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round(value),
        color: CATEGORY_COLORS[name as Category],
        icon: CATEGORY_ICONS[name as Category],
      }))
      .sort((a, b) => b.value - a.value);

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString("en", { month: "short" });

      const mTx = transactions.filter(t => t.date.startsWith(key));

      monthlyData.push({
        month: label,
        income: Math.round(mTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)),
        expenses: Math.round(mTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)),
      });
    }

    const budgetData = budgets.map(b => {
      const spent = thisMonthTx
        .filter(t => t.type === "expense" && t.category === b.category)
        .reduce((s, t) => s + t.amount, 0);

      return {
        category: b.category.charAt(0).toUpperCase() + b.category.slice(1),
        budget: b.limit,
        spent: Math.round(spent),
        pct: Math.round((spent / b.limit) * 100),
      };
    });

    const topCategory = categoryData[0];
    const avgDaily = Math.round(expenses / now.getDate());

    return {
      income,
      expenses,
      balance: income - expenses,
      expenseTrend,
      categoryData,
      monthlyData,
      budgetData,
      topCategory,
      avgDaily
    };
  }, [transactions, budgets]);

  // ✅ ₹ FORMAT
  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }); 

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Your financial overview</p>
        </div>
        <TransactionDialog onSave={addTransaction} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={fmt(stats.balance)} icon={Wallet} variant="primary" subtitle="This month" />
        <StatCard title="Income" value={fmt(stats.income)} icon={TrendingUp} variant="success" subtitle="This month" />
        <StatCard title="Expenses" value={fmt(stats.expenses)} icon={TrendingDown} variant="warning"
          trend={{ value: Math.round(Math.abs(stats.expenseTrend)), positive: stats.expenseTrend < 0 }} />
        <StatCard title="Avg Daily" value={fmt(stats.avgDaily)} icon={PiggyBank}
          subtitle={stats.topCategory ? `Top: ${stats.topCategory.icon} ${stats.topCategory.name}` : ""} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" />
              <Bar dataKey="expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.categoryData} dataKey="value">
                {stats.categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Remaining same */}
    </div>
  );
}