import { useTransactions } from "../hooks/useTransactions";

export default function Dashboard() {
  const { transactions } = useTransactions();

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum - t.amount;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Balance</h3>
          <p>₹{totalBalance}</p>
        </div>

        <div>
          <h3>Income</h3>
          <p>₹{totalIncome}</p>
        </div>

        <div>
          <h3>Expenses</h3>
          <p>₹{totalExpenses}</p>
        </div>
      </div>
    </div>
  );
}