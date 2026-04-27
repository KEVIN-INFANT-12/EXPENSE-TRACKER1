import { useTransactions } from "../hooks/useTransactions";
import AddTransactionModal from "../components/AddTransactionModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { transactions } = useTransactions();

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expenses;

  // BAR DATA
  const barData = [{ name: "Total", income, expenses }];

  // PIE DATA
  const categoryMap: any = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <AddTransactionModal />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Total Balance</p>
          <h2 className="text-2xl font-bold">₹{balance}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Income</p>
          <h2 className="text-green-600 text-2xl font-bold">₹{income}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Expenses</p>
          <h2 className="text-red-500 text-2xl font-bold">₹{expenses}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Transactions</p>
          <h2 className="text-2xl font-bold">{transactions.length}</h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="mb-4 font-semibold">Income vs Expenses</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="mb-4 font-semibold">Category Breakdown</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RECENT */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="mb-4 font-semibold">Recent Transactions</h2>

        {transactions.slice(0, 5).map(t => (
          <div key={t._id} className="flex justify-between border-b py-2">
            <span>{t.category}</span>
            <span className={t.type === "income" ? "text-green-600" : "text-red-500"}>
              {t.type === "income" ? "+" : "-"}₹{t.amount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}