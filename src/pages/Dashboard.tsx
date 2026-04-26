import { useTransactions } from "../hooks/useTransactions";

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
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        {/* Balance */}
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>Balance</h3>
          <p>Rs. {totalBalance}</p>
        </div>

        {/* Income */}
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>Income</h3>
          <p>Rs. {totalIncome}</p>
        </div>

        {/* Expenses */}
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>Expenses</h3>
          <p>Rs. {totalExpenses}</p>
        </div>

      </div>

      {/* Recent Transactions */}
      <h2 style={{ marginTop: "30px" }}>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p>No data found</p>
      ) : (
        transactions.slice(0, 5).map((t) => (
          <div key={t._id} style={{ marginTop: "10px" }}>
            {t.category} - Rs. {t.amount} ({t.type})
          </div>
        ))
      )}
    </div>
  );
}