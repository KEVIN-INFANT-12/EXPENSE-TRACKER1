import { useState, useMemo } from "react";
import { Search, Trash2, Pencil, TrendingUp, TrendingDown, Calendar, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TransactionDialog } from "@/components/TransactionDialog";
import {
  useTransactions, CATEGORY_ICONS, EXPENSE_CATEGORIES, INCOME_CATEGORIES,
  type Category, type TransactionType,
} from "@/lib/store";

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (search && !t.notes.toLowerCase().includes(search.toLowerCase()) &&
          !t.category.includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, filterType, filterCategory]);

  const analysis = useMemo(() => {
    if (filtered.length === 0) return null;
    const total = filtered.reduce((s, t) => s + t.amount, 0);
    const avg = total / filtered.length;
    const max = Math.max(...filtered.map(t => t.amount));
    const min = Math.min(...filtered.map(t => t.amount));
    const dates = filtered.map(t => t.date).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    return { total, avg, max, min, count: filtered.length, firstDate, lastDate };
  }, [filtered]);

  const showAnalysis = filterCategory !== "all" || filterType !== "all" || search.length > 0;

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} transactions</p>
        </div>
        <TransactionDialog onSave={addTransaction} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as typeof filterCategory)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Analysis Summary - shown when filters are active */}
      {showAnalysis && analysis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
          <div className="rounded-xl border bg-primary/5 border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Total</p>
            </div>
            <p className="text-lg font-bold text-primary">{fmt(analysis.total)}</p>
          </div>
          <div className="rounded-xl border bg-success/5 border-success/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-success" />
              <p className="text-xs font-medium text-muted-foreground">Average</p>
            </div>
            <p className="text-lg font-bold text-success">{fmt(analysis.avg)}</p>
          </div>
          <div className="rounded-xl border bg-warning/5 border-warning/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-4 w-4 text-warning" />
              <p className="text-xs font-medium text-muted-foreground">Range</p>
            </div>
            <p className="text-sm font-semibold">{fmt(analysis.min)} – {fmt(analysis.max)}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Period</p>
            </div>
            <p className="text-sm font-semibold">{analysis.firstDate} → {analysis.lastDate}</p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border bg-card divide-y divide-border">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No transactions found</div>
        )}
        {filtered.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">{CATEGORY_ICONS[tx.category]}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{tx.notes || tx.category}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.date} · {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                  {tx.recurring && <span className="ml-1 text-primary">↻</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-foreground"}`}>
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </span>
              <TransactionDialog
                onSave={(data) => updateTransaction(tx.id, data)}
                editTx={tx}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive"
                onClick={() => deleteTransaction(tx.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
