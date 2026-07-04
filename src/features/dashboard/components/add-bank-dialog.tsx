"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

/** Add a bank/cash account. `trigger` lets callers style their own opener. */
export function AddBankDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { addBankAccount } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);

  const valid = name.trim().length > 0;

  function submit() {
    if (!valid) return;
    addBankAccount({ name: name.trim(), balance });
    setName("");
    setBalance(0);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setName("");
          setBalance(0);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            <Plus /> Add savings account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a savings account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Account name</Label>
            <Input
              placeholder="e.g. DBS Multiplier"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Balance</Label>
            <MoneyInput
              value={balance || ""}
              onValueChange={setBalance}
              placeholder="0"
            />
          </div>
          <Button size="lg" disabled={!valid} onClick={submit}>
            Add savings account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
