"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { HoldingType } from "@/core/types";
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
  HOLDING_TYPES,
  HOLDING_TYPE_META,
} from "@/features/investments/data/holding-types";

export function AddHoldingDialog() {
  const { addHolding } = useStore();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<HoldingType>("etf");
  const [broker, setBroker] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [costBasis, setCostBasis] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const valid = name.trim().length > 0 && currentValue > 0;

  function reset() {
    setName("");
    setType("etf");
    setBroker("");
    setQuantity(0);
    setCostBasis(0);
    setCurrentValue(0);
  }

  function submit() {
    if (!valid) return;
    addHolding({
      name: name.trim(),
      type,
      broker: broker.trim() || "—",
      quantity,
      costBasis: costBasis || currentValue,
      currentValue,
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
          <DialogTitle>Add a holding</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input
              placeholder="e.g. IWDA — iShares Core MSCI World"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as HoldingType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOLDING_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {HOLDING_TYPE_META[t].emoji} {HOLDING_TYPE_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Broker / platform</Label>
              <Input
                placeholder="e.g. IBKR"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={quantity || ""}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Invested</Label>
              <MoneyInput
                value={costBasis || ""}
                onValueChange={setCostBasis}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Value now</Label>
              <MoneyInput
                value={currentValue || ""}
                onValueChange={setCurrentValue}
                placeholder="0"
              />
            </div>
          </div>

          <Button size="lg" disabled={!valid} onClick={submit}>
            Add holding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
