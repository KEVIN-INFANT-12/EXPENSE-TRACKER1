import { useTransactions } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { transactions } = useTransactions();

  // ================= SUMMARY =================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expenses;

  // ================= FIXED MONTHLY LOGIC =================
  const monthlyData: Record<
    string,
    { income: number; expense: number }
  > = {};

  transactions.forEach((t) => {
    const d = new Date(t.date);

    const month = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  const chartData = Object.keys(monthlyData).map((month) => ({
    month,
    income: monthlyData[month].income,
    expense: monthlyData[month].expense,
  }));

  // ================= UI =================
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Balance</p>
          <h2 className="text-2xl font-bold">₹{balance}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Income</p>
          <h2 className="text-2xl font-bold text-green-600">₹{income}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Expenses</p>
          <h2 className="text-2xl font-bold text-red-500">₹{expenses}</h2>
        </div>

      </div>

      {/* BAR CHART */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Income vs Expense
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" />
            <Bar dataKey="expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">
          Recent Transactions
        </h2>

        {transactions.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex justify-between border-b py-2"
          >
            <span>{t.category}</span>
            <span
              className={
                t.type === "income"
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {t.type === "income" ? "+" : "-"}₹{t.amount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}