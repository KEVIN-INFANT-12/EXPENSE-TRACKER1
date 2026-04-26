import { useTransactions } from "../hooks/useTransactions";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {transactions.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">
                  {t.category} - ₹{t.amount}
                </p>
                <p className="text-sm text-gray-500">{t.type}</p>
              </div>

              <Button
                variant="destructive"
                onClick={() => deleteTransaction(t._id!)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}