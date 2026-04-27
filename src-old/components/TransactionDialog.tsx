import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

// ✅ TYPES (NO STORE)
type TransactionType = "income" | "expense";

type Category =
  | "food"
  | "rent"
  | "transport"
  | "entertainment"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

interface Transaction {
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes: string;
}

// ✅ DATA
const EXPENSE_CATEGORIES: Category[] = [
  "food", "rent", "transport", "entertainment", "utilities",
  "shopping", "health", "education", "other"
];

const INCOME_CATEGORIES: Category[] = [
  "salary", "freelance", "investment", "other"
];

const CATEGORY_ICONS: Record<Category, string> = {
  food: "🍔",
  rent: "🏠",
  transport: "🚗",
  entertainment: "🎬",
  utilities: "💡",
  shopping: "🛍️",
  health: "🏥",
  education: "📚",
  salary: "💰",
  freelance: "💻",
  investment: "📈",
  other: "📌",
};

// ✅ COMPONENT
interface TransactionDialogProps {
  onSave: (tx: Transaction) => void;
  editTx?: Transaction;
  trigger?: React.ReactNode;
}

export function TransactionDialog({ onSave, editTx, trigger }: TransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(editTx?.type ?? "expense");
  const [amount, setAmount] = useState(editTx?.amount?.toString() ?? "");
  const [category, setCategory] = useState<Category | "">(editTx?.category ?? "");
  const [date, setDate] = useState(
    editTx?.date ?? new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(editTx?.notes ?? "");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    if (!amount || !category || !date) return;

    onSave({
      amount: parseFloat(amount),
      category: category as Category,
      type,
      date,
      notes,
    });

    setOpen(false);

    if (!editTx) {
      setAmount("");
      setCategory("");
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editTx ? "Edit" : "New"} Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          
          {/* TYPE */}
          <div className="flex gap-2">
            <Button
              variant={type === "expense" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setType("expense");
                setCategory("");
              }}
            >
              Expense
            </Button>

            <Button
              variant={type === "income" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setType("income");
                setCategory("");
              }}
            >
              Income
            </Button>
          </div>

          {/* AMOUNT */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_ICONS[cat]}{" "}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* NOTES */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* SAVE */}
          <Button className="w-full" onClick={handleSave}>
            {editTx ? "Update" : "Add"} Transaction
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}