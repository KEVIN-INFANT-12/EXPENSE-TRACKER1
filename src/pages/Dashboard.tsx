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

    // ✅ FIXED DATE (NO toISOString)
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, "0")}`;

    const thisMonthTx = transactions.filter(t => t.date.startsWith(thisMonth));
    const lastMonthTx = transactions.filter(t => t.date.startsWith(lastMonth));

    const income = thisMonthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const lastExpenses = lastMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const expenseTrend = lastExpenses ? ((expenses - lastExpenses) / lastExpenses) * 100 : 0;

    // Category breakdown
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

    // ✅ FIXED MONTHLY DATA
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i);

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const label = d.toLocaleDateString("en", { month: "short" });

      const mTx = transactions.filter(t => t.date.startsWith(key));

      monthlyData.push({
        month: label,
        income: Math.round(mTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)),
        expenses: Math.round(mTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)),
      });
    }

    // Budget usage
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
    const avgDaily = Math.round(expenses / (now.getDate() || 1));

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

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Your financial overview</p>
        </div>
        <TransactionDialog onSave={addTransaction} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={fmt(stats.balance)} icon={Wallet} variant="primary" />
        <StatCard title="Income" value={fmt(stats.income)} icon={TrendingUp} variant="success" />
        <StatCard title="Expenses" value={fmt(stats.expenses)} icon={TrendingDown} variant="warning" />
        <StatCard title="Avg Daily" value={fmt(stats.avgDaily)} icon={PiggyBank} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="rounded-xl border bg-card p-5">
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

      {/* Trend + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Budget Status</h3>
          <div className="space-y-4">
            {stats.budgetData.map((b) => (
              <div key={b.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{b.category}</span>
                  <span>{fmt(b.spent)} / {fmt(b.budget)}</span>
                </div>
                <div className="h-2 bg-muted rounded">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${Math.min(b.pct, 100)}%`,
                      backgroundColor: b.pct > 90 ? "red" : b.pct > 70 ? "orange" : "green"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        {transactions.slice(0, 5).map(tx => (
          <div key={tx.id} className="flex justify-between py-2 border-b">
            <span>{CATEGORY_ICONS[tx.category]} {tx.category}</span>
            <span>{tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}</span>
          </div>
        ))}
      </div>

    </div>
  );
}