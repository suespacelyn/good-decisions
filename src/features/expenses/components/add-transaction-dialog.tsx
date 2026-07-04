"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type {
  ExpenseCategory,
  Recurrence,
  TransactionKind,
} from "@/core/types";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
} from "@/features/expenses/data/categories";
import { cn } from "@/lib/utils";

const RECURRENCE_LABELS: Record<Recurrence, string> = {
  once: "One-off",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AddTransactionDialog() {
  const { addTransaction } = useStore();
  const [open, setOpen] = useState(false);

  const [kind, setKind] = useState<TransactionKind>("expense");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const [date, setDate] = useState(todayISO());

  const valid = label.trim().length > 0 && amount > 0;

  function reset() {
    setKind("expense");
    setCategory("food");
    setLabel("");
    setAmount(0);
    setRecurrence("once");
    setDate(todayISO());
  }

  function submit() {
    if (!valid) return;
    addTransaction({
      kind,
      category: kind === "income" ? "other" : category,
      label: label.trim(),
      amount,
      recurrence,
      date: new Date(date).toISOString(),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Income / expense toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            {(["expense", "income"] as TransactionKind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-lg py-2 text-sm font-bold capitalize transition-colors",
                  kind === k
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground",
                )}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Input
              placeholder={kind === "income" ? "e.g. Salary" : "e.g. Hawker lunch"}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Amount</Label>
              <MoneyInput
                value={amount || ""}
                onValueChange={setAmount}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {kind === "expense" && (
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ExpenseCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Repeats</Label>
            <Select
              value={recurrence}
              onValueChange={(v) => setRecurrence(v as Recurrence)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(RECURRENCE_LABELS) as Recurrence[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {RECURRENCE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" disabled={!valid} onClick={submit}>
            Add transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
