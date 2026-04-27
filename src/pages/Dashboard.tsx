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

    // Monthly trend (last 6 months)
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

    // Top category
    const topCategory = categoryData[0];
    const avgDaily = Math.round(expenses / now.getDate());

    return { income, expenses, balance: income - expenses, expenseTrend, categoryData, monthlyData, budgetData, topCategory, avgDaily };
  }, [transactions, budgets]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

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
        <StatCard title="Total Balance" value={fmt(stats.balance)} icon={Wallet} variant="primary"
          subtitle="This month" />
        <StatCard title="Income" value={fmt(stats.income)} icon={TrendingUp} variant="success"
          subtitle="This month" />
        <StatCard title="Expenses" value={fmt(stats.expenses)} icon={TrendingDown} variant="warning"
          trend={{ value: Math.round(Math.abs(stats.expenseTrend)), positive: stats.expenseTrend < 0 }} />
        <StatCard title="Avg Daily" value={fmt(stats.avgDaily)} icon={PiggyBank}
          subtitle={stats.topCategory ? `Top: ${stats.topCategory.icon} ${stats.topCategory.name}` : ""} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Income vs Expenses */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Legend iconType="square" />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" barSize={20} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
              >
                {stats.categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {stats.categoryData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.icon} {cat.name}</span>
                </div>
                <span className="font-medium">{fmt(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Trend + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Spending Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 animate-slide-up">
          <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Budget Status</h3>
          <div className="space-y-4">
            {stats.budgetData.map((b) => (
              <div key={b.category}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{b.category}</span>
                  <span className="text-muted-foreground">
                    {fmt(b.spent)} / {fmt(b.budget)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(b.pct, 100)}%`,
                      backgroundColor: b.pct > 90 ? "hsl(var(--destructive))" : b.pct > 70 ? "hsl(var(--warning))" : "hsl(var(--primary))",
                    }}
                  />
                </div>
              </div>
            ))}
            {stats.budgetData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No budgets set yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border bg-card p-5 animate-slide-up">
        <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{CATEGORY_ICONS[tx.category]}</span>
                <div>
                  <p className="text-sm font-medium">{tx.notes || tx.category}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-foreground"}`}>
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
