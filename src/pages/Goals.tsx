import { useState } from "react";
import { Plus, Trash2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

const STORAGE_KEY = "finflow_goals";

function loadGoals(): Goal[] {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch {}
  return [
    { id: "g-1", name: "Emergency Fund", target: 10000, saved: 6500, deadline: "2026-12-31" },
    { id: "g-2", name: "Vacation", target: 3000, saved: 1200, deadline: "2026-08-01" },
    { id: "g-3", name: "New Laptop", target: 2000, saved: 800, deadline: "2026-06-01" },
  ];
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const save = (g: Goal[]) => {
    setGoals(g);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
  };

  const handleAdd = () => {
    if (!name || !target) return;
    save([...goals, { id: `g-${Date.now()}`, name, target: parseFloat(target), saved: 0, deadline }]);
    setOpen(false);
    setName(""); setTarget(""); setDeadline("");
  };

  const addFunds = (id: string, amount: number) => {
    save(goals.map(g => g.id === id ? { ...g, saved: Math.min(g.saved + amount, g.target) } : g));
  };

  // ✅ ₹ FORMAT FIX
  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground text-sm">Track progress toward your financial goals</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Goal</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New Savings Goal</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g. Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Deadline (optional)</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleAdd}>
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          const completed = pct >= 100;

          return (
            <div key={goal.id} className="rounded-xl border bg-card p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${completed ? "bg-success/10" : "bg-primary/10"}`}>
                    <Target className={`h-5 w-5 ${completed ? "text-success" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {goal.deadline ? `Due ${goal.deadline}` : "No deadline"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => save(goals.filter(g => g.id !== goal.id))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{fmt(goal.saved)} saved</span>
                <span className="font-medium">{fmt(goal.target)}</span>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: completed ? "hsl(var(--success))" : "hsl(var(--primary))",
                  }}
                />
              </div>

              {completed ? (
                <p className="text-sm text-success font-medium">🎉 Goal reached!</p>
              ) : (
                <div className="flex gap-2">
                  {[50, 100, 500].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => addFunds(goal.id, amt)}
                    >
                      +{fmt(amt)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No savings goals yet. Create one to start tracking your progress.</p>
        </div>
      )}
    </div>
  );
}