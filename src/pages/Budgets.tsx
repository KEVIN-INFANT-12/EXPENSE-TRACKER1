import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useBudgets, useTransactions, EXPENSE_CATEGORIES, CATEGORY_ICONS,
  type Category,
} from "@/lib/store";

export default function Budgets() {
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | "">("");
  const [limit, setLimit] = useState("");

  const thisMonth = new Date().toISOString().slice(0, 7);

  const handleAdd = () => {
    if (!category || !limit) return;
    addBudget({ category: category as Category, limit: parseFloat(limit), month: thisMonth });
    setOpen(false);
    setCategory("");
    setLimit("");
  };

  // ✅ ₹ FORMAT FIX
  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });

  const usedCategories = budgets.map(b => b.category);
  const availableCategories = EXPENSE_CATEGORIES.filter(c => !usedCategories.includes(c));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground text-sm">Monthly budget limits by category</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Budget</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Limit</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min="0"
                />
              </div>

              <Button className="w-full" onClick={handleAdd}>
                Create Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const spent = transactions
            .filter(t => t.type === "expense" && t.category === budget.category && t.date.startsWith(thisMonth))
            .reduce((s, t) => s + t.amount, 0);

          const pct = Math.round((spent / budget.limit) * 100);
          const isOver = pct > 100;
          const isWarning = pct > 80;

          return (
            <div key={budget.id} className="rounded-xl border bg-card p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CATEGORY_ICONS[budget.category]}</span>
                  <div>
                    <p className="font-semibold">
                      {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fmt(spent)} of {fmt(budget.limit)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    isOver ? "text-destructive" :
                    isWarning ? "text-warning" :
                    "text-primary"
                  }`}>
                    {pct}%
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteBudget(budget.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor:
                      isOver ? "hsl(var(--destructive))" :
                      isWarning ? "hsl(var(--warning))" :
                      "hsl(var(--primary))",
                  }}
                />
              </div>

              {isOver && (
                <p className="text-xs text-destructive mt-2 font-medium">
                  ⚠️ Over budget by {fmt(spent - budget.limit)}
                </p>
              )}

              {isWarning && !isOver && (
                <p className="text-xs text-warning mt-2 font-medium">
                  ⚡ Approaching limit — {fmt(budget.limit - spent)} remaining
                </p>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No budgets yet. Create one to start tracking your spending limits.</p>
        </div>
      )}
    </div>
  );
}