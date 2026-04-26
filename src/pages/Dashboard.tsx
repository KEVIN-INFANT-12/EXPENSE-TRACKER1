import { useTransactions } from "../hooks/useTransactions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { transactions } = useTransactions();

  const totalBalance = transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Button>
          + Add Transaction
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Balance</h3>
          <p className="text-xl font-bold">₹ {totalBalance}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Income</h3>
          <p className="text-xl font-bold text-green-600">
            ₹ {totalIncome}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Expenses</h3>
          <p className="text-xl font-bold text-red-600">
            ₹ {totalExpenses}
          </p>
        </div>

      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <p>No data found</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t._id}
                className="border rounded-lg p-3 flex justify-between"
              >
                <span>
                  {t.category} - ₹ {t.amount}
                </span>
                <span className="text-sm text-gray-500">
                  {t.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}