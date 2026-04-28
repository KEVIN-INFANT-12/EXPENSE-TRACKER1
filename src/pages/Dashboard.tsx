import { useTransactions } from "@/lib/store";

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
    const d = new Date(t.date); // ✅ IMPORTANT FIX

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

  // Convert to array
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

      {/* CHART DATA DEBUG (TEMP) */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Data (Debug)
        </h2>

        {chartData.map((c, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{c.month}</span>
            <span>Income: ₹{c.income}</span>
            <span>Expense: ₹{c.expense}</span>
          </div>
        ))}
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